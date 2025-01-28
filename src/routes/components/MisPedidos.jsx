import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { getPedidosUsuario } from "../../helpers/pedidosService";

const MisPedidos = () => {
  const { userId } = useContext(AuthContext); // Obtenemos el ID del usuario desde el contexto
  const [pedidos, setPedidos] = useState([]); // Estado para almacenar los pedidos del usuario
  const [loading, setLoading] = useState(true); // Estado de carga
  const [mensaje, setMensaje] = useState(""); // Estado para mensajes de error o vacío

  useEffect(() => {
    const fetchPedidos = async () => {
      console.log("User ID:", userId); // Verificar el ID del usuario

      if (!userId) {
        setMensaje("Usuario no identificado.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setMensaje(""); // Limpiar mensajes anteriores

        const respuesta = await getPedidosUsuario(userId); // Llamada al servicio
        console.log("Respuesta del backend:", respuesta); // Verificar la respuesta

        // Verificar que la respuesta sea exitosa y contenga pedidos
        if (respuesta?.exito && Array.isArray(respuesta.datos) && respuesta.datos.length > 0) {
          setPedidos(respuesta.datos); // Almacenar los pedidos en el estado
        } else {
          setMensaje(respuesta?.mensaje || "No tienes pedidos registrados.");
        }
      } catch (error) {
        console.error("Error al obtener los pedidos del usuario:", error);
        setMensaje("No tienes pedidos registrados.");
      } finally {
        setLoading(false); // Detener la carga
      }
    };

    fetchPedidos();
  }, [userId]);

  // Mostrar un mensaje de carga mientras se obtienen los datos
  if (loading) {
    return (
      <Container className="text-center mt-5">
        <p>Cargando tus pedidos...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h3 className="mb-4">Mis Pedidos</h3>
      {mensaje ? (
        // Mostrar mensaje en caso de error o lista vacía
        <p>{mensaje}</p>
      ) : (
        // Renderizar los pedidos
        <Row className="g-4">
          {pedidos.map((pedido, index) => (
            <Col key={index} xs={12} sm={6} lg={4}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{`Pedido #${index + 1}`}</Card.Title>
                  <Card.Text className="text-muted">{`Precio Total: $${pedido.precioTotal}`}</Card.Text>
                  <Card.Text className="text-muted">{`Domicilio ID: ${pedido.domicilioID}`}</Card.Text>
                  <Card.Text className="text-muted">{`Usuario ID: ${pedido.usuarioID}`}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MisPedidos;
