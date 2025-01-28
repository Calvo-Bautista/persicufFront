import axios from "axios";

// GET
export async function getPedidos() {
    try {
        const response = await axios.get("https://localhost:7050/api/Pedido/obtenerPedidos");
        return response.data; // Devuelve solo el cuerpo de la respuesta
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al obtener los pedidos");
    }
}



// pedidoUsuario
export async function getPedidosUsuario(ID) {
    try {
        const response = await axios.get(`https://localhost:7050/api/Pedido/obtenerPedidosUsuario?ID=${ID}`);
        return response.data; // Devuelve solo el cuerpo de la respuesta
    } catch (error) {
        console.error(error.response);
        throw new Error(error.response?.data?.mensaje || "Error al obtener los pedidos");
    }
}

// POST
export async function createPedido(nuevoPedido) {
    try {
        const response = await axios.post("https://localhost:7050/api/Pedido/crearPedido", nuevaPedido);
        return response;
    } catch (error) {
        console.log("Este es el error: ", error.response.data.mensaje)
        throw new Error(error.response.data.mensaje);
    }
};

//DELETE
export async function deletePedido(PedidoId) {
    try {
        const response = await axios.delete(`https://localhost:7050/api/Pedido/eliminarPedido?ID=${PedidoId}`);
        return response;
    } catch (error) {
        throw new Error(error.response.data.mensaje);
    }
}