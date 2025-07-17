export async function fetchCryptos() {
    try {
        const response = await fetch("http://localhost:8080/api/cryptos");
        
        if(!response.ok){
            throw new Error(`Error de red ${response.status}`);
        }
         const data = await response.json();
         return data.data;
    } catch (error) {
        console.log("Error al obtener criptomonedas:",error);
        throw error;
    }
};