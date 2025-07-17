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

document.addEventListener("DOMContentLoaded", async () => {
    
// Función que carga las criptomonedas desde el api.js, guarda los datos globalmente, calcula cuántas páginas se necesitan, genera los botones y muestra la primera página.
    async function cargarCriptos(){
        try {
            const data = await fetchCryptos();
            console.log(data, "soy la data del main.js q trae las criptos a travez de api.js");
            listadoCryptos = data;

            const totalPaginas = Math.ceil(listadoCryptos.length / 10); // calculo cuantas paginas necesito para la cantidad de resultados

            renderPaginador(totalPaginas); // renderizo botones por cantidad de paginas
            mostrarPagina(1); // muestro la pagina
        } catch (error) {
            console.log("Error desde main.js", error)
            resultados.innerHTML = "<p>Error al cargar datos</p>"
        }
    };
    
// Renderizo una lista de criptos recibida como parámetro, y luego inserto los valores en HTML dentro del contenedor principal.
    function renderResultados(lista){
        if(lista.length === 0){
            resultados.innerHTML = "<p>No se encontraron resultados</p>"
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

    await cargarCriptos(); // Ejecuto la primera carga

    intervaloAutoRefresh = setInterval(()=>{
        console.log("Me refresque")
        cargarCriptos();
    }, 10000); // Auto-refresh cada 10 segundos guardado en variable para hacer clean despues

// Lógica boton refrescar, limpia el intervalo, recarga los datos y reinicia el contador
    btnRefrescar.addEventListener("click", async ()=>{
        clearInterval(intervaloAutoRefresh); 
        await cargarCriptos();  
        intervaloAutoRefresh = setInterval(cargarCriptos, 10000); 
    });

// Función que genera los botones de paginación según la cantidad de páginas recibida. Cada botón muestra su página correspondiente al hacer clic.
    function renderPaginador(totalPaginas, array = listadoCryptos){
        // borrar los botones anteriores, por si habia creados
        paginador.innerHTML = "";

        //Recorremos del 1 a numero total de paginas, creo el boton, le inserto numero de pagina, le asigno id y agrego una clase. Por ultimo muestro la pagina e inserto el boton dentro del contendor
        for (let i = 1; i <= totalPaginas; i++) {
            const botonPaginacion = document.createElement("button"); // Creo el boton

            botonPaginacion.textContent = i; 
            botonPaginacion.id = `boton-${i}`; 
            botonPaginacion.classList.add("btn", "btn-outline-secondary", "mx-1", "mb-2");


            botonPaginacion.addEventListener("click", ()=>{
                mostrarPagina(i, array); 
            });

            paginador.appendChild(botonPaginacion); 
        }
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

});





