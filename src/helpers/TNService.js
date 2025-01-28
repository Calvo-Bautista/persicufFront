import axios from "axios";

// GET
export async function getTallesNumerico() {
    try {
        const response = await axios.get("https://localhost:7050/api/TalleNumerico/obtenerTallesNumerico");
        return response.data;
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al obtener los Talles Numericos");
    }
}

export async function getTalleNumericoID(nombreTalle) {
    try {
        const response = await getTallesNumerico();
        const talles = response.datos; // Asegúrate de que `datos` sea correcto según el formato de la API
        const talle = talles.find(t => t.descripcion === nombreTalle);
        if (talle) {
            return talle.id;
        } else {
            throw new Error(`No se encontró un talle con el nombre: ${nombreTalle}`);
        }
    } catch (error) {
        console.error("Error al obtener el ID del talle:", error.message);
        throw error;
    }
}

// POST
export async function createTalleNumerico(nuevoTN) {
    try {
        const response = await axios.post("https://localhost:7050/api/TalleNumerico/crearTalleNumerico", nuevoTN);
        return response;
    } catch (error) {
        console.log("Este es el error: ", error.response.data.mensaje)
        throw new Error(error.response.data.mensaje);
    }
};

// DELETE
export async function deleteTalleNumerico(TNId) {
    try {
        const response = await axios.delete(`https://localhost:7050/api/TalleNumerico/eliminarTalleNumerico?ID=${TNId}`);
        return response;
    } catch (error) {
        throw new Error(error.response.data.mensaje);
    }
}
