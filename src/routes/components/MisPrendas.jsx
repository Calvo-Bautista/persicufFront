import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { getPrendasUsuario } from "../../helpers/prendasService";
import { getimgURLporID } from "../../helpers/imagenService";

const MisPrendas = () => {
  const { userId } = useContext(AuthContext); // Obtenemos el ID del usuario desde el contexto
  const [prendas, setPrendas] = useState([]); // Estado para almacenar las prendas del usuario
  const [loading, setLoading] = useState(true); // Estado de carga
  const [mensaje, setMensaje] = useState(""); // Estado para mensajes de error o vacío


  // Función para agregar URLs de imágenes a las prendas
  const addImageURLsToPrendas = async (prendas) => {
    return await Promise.all(
      prendas.map(async (prenda) => {
        const imageUrl = await getimgURLporID(prenda.imagenID);
        return { ...prenda, imageUrl }; // Agrega la URL de la imagen a la prenda
      })
    );
  };

  useEffect(() => {
    const fetchPrendas = async () => {
      if (!userId) {
        setMensaje("Usuario no identificado.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setMensaje("");

        const respuesta = await getPrendasUsuario(userId); // Llamada al servicio
        if (respuesta?.exito && Array.isArray(respuesta.datos) && respuesta.datos.length > 0) {
          const prendasWithImages = await addImageURLsToPrendas(respuesta.datos); // Agrega las URLs de las imágenes
          setPrendas(prendasWithImages); // Almacena las prendas con sus imágenes en el estado
        } else {
          setMensaje(respuesta?.mensaje || "No tienes prendas registradas.");
        }
      } catch (error) {
        console.error("Error al obtener las prendas del usuario:", error);
        setMensaje("Hubo un error al cargar tus prendas.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrendas();
  }, [userId]);

  // Formatear el precio
  const formatPrice = (price) => `$ ${price.toFixed(2)}`;

  // Mostrar un mensaje de carga mientras se obtienen los datos
  if (loading) {
    return (
      <Container className="text-center mt-5">
        <p>Cargando tus prendas...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h3 className="mb-4">Mis Prendas</h3>
      {mensaje ? (
        // Mostrar mensaje en caso de error o lista vacía
        <p>{mensaje}</p>
      ) : (
        // Renderizar las prendas
        <Row className="g-4">
          {prendas.map((prenda) => (
            <Col key={prenda.id} xs={12} sm={6} lg={4}>
              <Card className="h-100">
                <Card.Img
                  variant="top"
                  src={prenda.imageUrl} // Usa la URL dinámica
                  alt={prenda.nombre}
                  style={{ aspectRatio: "1", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{prenda.nombre}</Card.Title>
                  <Card.Text className="text-muted">
                    {formatPrice(prenda.precio)}
                  </Card.Text>
                  <Card.Text className="text-muted small">{`Rubro: ${prenda.rubroID}`}</Card.Text>
                  <Button variant="primary" href={`/prenda/${prenda.id}`}>
                    Ver detalles
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MisPrendas;
