import {fetchCryptos} from "./api.js";

// genero variables donde guardo mis elementos html
const resultados = document.getElementById("contenedorGrillaCards");
const btnRefrescar = document.getElementById("buscadorRefrescar");
const paginador = document.getElementById("paginador");
const selectRango = document.getElementById("filtroRango");
const inputBuscador = document.getElementById("buscador");


// genero una variable como array vacio para luego insertarle la data
let listadoCryptos = [];

// Guardo en variable el intervalo del refresh para luego limpiar y reiniciar
let intervaloAutoRefresh = null;
// Declaro esta variable global para utilizarla en set interval para conservar el numero de pagina cuando refresca
let numeroPaginaActiva = 1;

document.addEventListener("DOMContentLoaded", async () => {

// Función que carga las criptomonedas desde el api.js, guarda los datos globalmente, calcula cuántas páginas se necesitan, genera los botones y muestra la primera página.
    async function cargarCriptos(numeroPaginaActiva = 1){
        try {
            const data = await fetchCryptos();
            console.log(data, "soy la data del main.js q trae las criptos a travez de api.js");
            listadoCryptos = data;

            const totalPaginas = Math.ceil(listadoCryptos.length / 10); // calculo cuantas paginas necesito para la cantidad de resultados

            renderPaginador(totalPaginas, listadoCryptos, numeroPaginaActiva); // renderizo botones por cantidad de paginas
            mostrarPagina(numeroPaginaActiva); // muestro la pagina
        } catch (error) {
            console.log("Error desde main.js", error)
            resultados.innerHTML = "<p>Error al cargar datos</p>"
        }
    };
    
// Renderizo una lista de criptos recibida como parámetro, y luego inserto los valores en HTML dentro del contenedor principal.
    function renderResultados(lista){
        if(lista.length === 0){
            resultados.innerHTML =  "<p>No se encontraron resultados</p>"
            return
        }
        resultados.innerHTML = lista.map((cripto) => (
            `
            <tr>
                <td>${cripto.id}</td>
                <td><i>${cripto.symbol}</i></td>
                <td>${cripto.name}</td>
                <td>$${cripto.quote.USD.price.toFixed(2)}</td>
                <td>${cripto.quote.USD.percent_change_24h.toFixed(2)}%</td>
                <td>${Number(cripto.quote.USD.volume_24h).toLocaleString()}</td>
            </tr>
            `
        )).join("");
    };
    console.log(numeroPaginaActiva, "Soy el numero de la pagina activa antes del await");

    await cargarCriptos(numeroPaginaActiva); // Ejecuto la primera carga

    intervaloAutoRefresh = setInterval(()=>{
        const paginaItemActiva = document.querySelector(" #paginador .active");
        numeroPaginaActiva = paginaItemActiva ? parseInt(paginaItemActiva.textContent):1;
        console.log(numeroPaginaActiva, "Set interval");
        console.log("Me refresque")
        cargarCriptos(numeroPaginaActiva);
    }, 10000); // Auto-refresh cada 10 segundos guardado en variable para hacer clean despues

// Lógica boton refrescar, limpia el intervalo, recarga los datos y reinicia el contador
    btnRefrescar.addEventListener("click", async ()=>{
        const paginaItemActivaBtnRefresh = document.querySelector(" #paginador .active");
        
        numeroPaginaActiva = paginaItemActivaBtnRefresh ? parseInt(paginaItemActivaBtnRefresh.textContent):1;
        console.log(numeroPaginaActiva, "Boton refresh");

        clearInterval(intervaloAutoRefresh); 
        await cargarCriptos(numeroPaginaActiva);  
        intervaloAutoRefresh = setInterval(() => {
        console.log(numeroPaginaActiva, "Set interval despues de tocar boton");

            cargarCriptos(numeroPaginaActiva); // le pasás la página actual como parámetro
        }, 10000);
    });

// Función que genera los botones de paginación según la cantidad de páginas recibida. Cada botón muestra su página correspondiente al hacer clic.
    function renderPaginador(totalPaginas, array = listadoCryptos, paginaActual = 1){
        // borrar los botones anteriores, por si habia creados
        paginador.innerHTML = "";

         // Botón anterior
        const liPrev = document.createElement("li");
        liPrev.className = "page-item";
        liPrev.innerHTML = `<a class="page-link" href="#">«</a>`;
        paginaActual === 1 ? liPrev.classList.add("disabled"):liPrev.classList.remove("disabled") ;

        liPrev.addEventListener("click", () => {
            if (paginaActual > 1) {
            renderPaginador(totalPaginas, array, paginaActual - 1);
            mostrarPagina(paginaActual - 1, array);
            }
        });
        
        paginador.appendChild(liPrev);

        const maxVisible = 5;
        let start = Math.max(1, paginaActual - 2);
        let end = Math.min(totalPaginas, start + maxVisible - 1);
        if(end - start < maxVisible - 1) {
            start = Math.max(1, end < maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            const li = document.createElement("li");
            li.className = "page-item" + (i === paginaActual ? " active" : "");
            li.id = `page-item-${i}`
            li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            li.addEventListener("click", () => {
            renderPaginador(totalPaginas, array, i);
            mostrarPagina(i, array);
            });
            paginador.appendChild(li);
        }

        // → Botón siguiente
        const liNext = document.createElement("li");
        liNext.className = "page-item";
        liNext.innerHTML = `<a class="page-link" href="#">»</a>`;
        if (paginaActual === totalPaginas) liNext.classList.add("disabled");

        liNext.addEventListener("click", () => {
            if (paginaActual < totalPaginas) {
            renderPaginador(totalPaginas, array, paginaActual + 1);
            mostrarPagina(paginaActual + 1, array);
            }
        });

        paginador.appendChild(liNext);
    }   
// Muestra una página específica de resultados (10 por página). Recibe por parametro un array (global o distinto) para mostrar filtros o búsquedas.
    function mostrarPagina(num, array = listadoCryptos){
        const inicio = (num - 1)* 10;
        const fin = num * 10;

        const paginaCriptos = array.slice(inicio, fin);

        renderResultados(paginaCriptos);
    };



// Funcion general aplicarFiltros, filtro por nombre y rango a la vez. 
    function aplicarFiltros(){
        const nombre = inputBuscador.value.toLowerCase();
        const rangoSeleccionado = selectRango.value;
        
        console.log("Nombre buscado:", nombre);
        console.log("Rango seleccionado:", rangoSeleccionado);

        // Filtrar por nombre
        let resultadoFiltrado = listadoCryptos.filter((cripto) => {
            const nombreBuscado = cripto.name.toLowerCase();
            return nombreBuscado.includes(nombre); 
        });

        // Aplico el filtro por rango sobre el resultado ya filtrado
        resultadoFiltrado = resultadoFiltrado.filter((cripto)=>{
             const valorRango = cripto.quote.USD.price;

            switch (rangoSeleccionado) { 
                case "menor500":
                    return valorRango < 500;
                case "500-1000":
                    console.log(valorRango)
                    return valorRango >= 500 && valorRango <= 1000;
                case "mayor1000":
                    return valorRango > 1000;
                case "todos":
                default:
                    return true
            }
        });
        const totalPaginas = Math.ceil(resultadoFiltrado.length / 10);
        renderPaginador(totalPaginas, resultadoFiltrado);
        mostrarPagina(1, resultadoFiltrado);
    }

    inputBuscador.addEventListener("input", aplicarFiltros);
    selectRango.addEventListener("change", aplicarFiltros);

    const limpiarBuscador = document.getElementById("limpiarBuscador");
    const limpiarRango = document.getElementById("limpiarRango");
    
    limpiarBuscador.addEventListener("click", async()=>{
        inputBuscador.value = "";
        await cargarCriptos(numeroPaginaActiva);
       
    });
    limpiarRango.addEventListener("click", async ()=>{
        selectRango.value = "todos";
        await cargarCriptos(numeroPaginaActiva);
       
    });


});





