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