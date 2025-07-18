// Filtra las criptos por nombre ingresado en el input buscador. Devuelve un array con las coincidencias.  
    function buscarPorNombre (valorBuscador){
        const resultadoFiltrado = listadoCryptos.filter((cripto)=>{
            const nombre = cripto.name.toLowerCase();
            const valor = valorBuscador.toLowerCase();

            return nombre.includes(valor)
        })
        return resultadoFiltrado;
    }
// Lógica input buscador
    inputBuscador.addEventListener("input", (e)=>{
        e.preventDefault();
        const valorBuscador = inputBuscador.value;

        const resultadoFiltrado = buscarPorNombre(valorBuscador);

        const totalPaginas = Math.ceil(resultadoFiltrado.length / 10);
        renderPaginador(totalPaginas);
        mostrarPagina(1, resultadoFiltrado);

        console.log(resultadoFiltrado)
    });

    const selectRango = document.getElementById("filtroRango");

// Filtra las criptos según el rango de precios seleccionado en el <select>. Devuelve un array con las coincidencias.
    function buscarPorRango(valorSeleccionado){
        
        const resultadoFiltradoPorRango = listadoCryptos.filter((cripto)=>{
             const valorRango = cripto.quote.USD.price;

            switch (valorSeleccionado) {
                
                case "menor500":
                    return valorRango < 500
                case "500-1000":
                    console.log(valorRango)
                    return valorRango >= 500 && valorRango <= 1000
                case "mayor1000":
                    return valorRango > 1000
                case "todos":
                    return true
            }
             
        })

        return resultadoFiltradoPorRango

    };
// Lógica select filtrado por rango
    selectRango.addEventListener("change", (e)=>{
        e.preventDefault();
        const valorSeleccionado = e.target.value;

        const resultadoFiltradoPorRango = buscarPorRango(valorSeleccionado);

        const totalPaginas = Math.ceil(resultadoFiltradoPorRango.length / 10);
        renderPaginador(totalPaginas);
        mostrarPagina(1, resultadoFiltradoPorRango);
        

        console.log(resultadoFiltradoPorRango);
    })




    function renderPaginador(totalPaginas, array = listadoCryptos, paginaActual = 1) {
        paginador.innerHTML = "";

        // ← Botón anterior
        const liPrev = document.createElement("li");
        liPrev.className = "page-item";
        liPrev.innerHTML = `<a class="page-link" href="#">«</a>`;
        if (paginaActual === 1) liPrev.classList.add("disabled");

        liPrev.addEventListener("click", () => {
            if (paginaActual > 1) {
            renderPaginador(totalPaginas, array, paginaActual - 1);
            mostrarPagina(paginaActual - 1, array);
            }
        });

        paginador.appendChild(liPrev);

        // Mostrar máximo 5 botones, centrado en la página actual
        const maxVisible = 5;
        let start = Math.max(1, paginaActual - 2);
        let end = Math.min(totalPaginas, start + maxVisible - 1);
        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            const li = document.createElement("li");
            li.className = "page-item" + (i === paginaActual ? " active" : "");
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
        }  }