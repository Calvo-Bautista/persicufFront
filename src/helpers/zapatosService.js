import axios from "axios";

// GET
export async function getZapatos() {
    try {
        const response = await axios.get("https://localhost:7050/api/Zapato/obtenerZapatos");
        return response.data; // Devuelve solo el cuerpo de la respuesta
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al obtener los zapatos");
    }
}

// buscar
export async function buscarZapatos(busqueda) {
    try {
        const response = await axios.get(`https://localhost:7050/api/Zapato/buscarZapatos?busqueda=${busqueda}`);
        return response.data; 
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al realizar la busqueda");
    }
}

// POST
export async function createZapato(nuevoZapato) {
    try {
        const response = await axios.post("https://localhost:7050/api/Zapato/crearZapato", nuevoZapato);
        return response;
    } catch (error) {
        console.log("Este es el error: ", error.response.data.mensaje)
        throw new Error(error.response.data.mensaje);
    }
};

//DELETE
export async function deleteZapato(ZapatoId) {
    try {
        const response = await axios.delete(`https://localhost:7050/api/Zapato/eliminarZapato?ID=${ZapatoId}`);
        return response;
    } catch (error) {
        throw new Error(error.response.data.mensaje);
    }
}