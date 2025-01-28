import axios from "axios";

// GET
export async function getCamperas() {
    try {
        const response = await axios.get("https://localhost:7050/api/Campera/obtenerCamperas");
        return response.data; // Devuelve solo el cuerpo de la respuesta
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al obtener las camperas");
    }
}

// buscar
export async function buscarCamperas(busqueda) {
    try {
        const response = await axios.get(`https://localhost:7050/api/Campera/buscarCamperas?busqueda=${busqueda}`);
        return response.data; 
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al realizar la busqueda");
    }
}

// POST
export async function createCampera(nuevaCampera) {
    try {
        const response = await axios.post("https://localhost:7050/api/Campera/crearCampera", nuevaCampera);
        return response;
    } catch (error) {
        console.log("Este es el error: ", error.response.data.mensaje)
        throw new Error(error.response.data.mensaje);
    }
};

//DELETE
export async function deleteRemera(CamperaId) {
    try {
        const response = await axios.delete(`https://localhost:7050/api/Campera/eliminarCampera?ID=${CamperaId}`);
        return response;
    } catch (error) {
        throw new Error(error.response.data.mensaje);
    }
}