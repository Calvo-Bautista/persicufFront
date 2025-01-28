import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { getRemeras } from '../../helpers/remerasService'; // Asegúrate de que el servicio esté correctamente importado
import { buscarUsuario } from '../../helpers/usuarios/usuariosService';

const VerMasRemeras = () => {
  const [remeras, setRemeras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchRemeras = async () => {
      try {
        setLoading(true);

        // Obtener remeras desde la API
        const respuesta = await getRemeras();
        console.log('Respuesta de remeras:', respuesta); // Ver la estructura de la respuesta
        if (respuesta?.datos && Array.isArray(respuesta.datos)) {
          // Crear un mapeo de remeras con nombres de usuario
          const remerasConUsuarios = await Promise.all(
            respuesta.datos.map(async (item) => {
              if (item.usuarioID) {
                try {
                  const usuarioRespuesta = await buscarUsuario(item.usuarioID);
                  console.log(`Respuesta de buscarUsuario para ID ${item.usuarioID}:`, usuarioRespuesta); // Ver respuesta del usuario

                  // Verificar la estructura completa de la respuesta
                  if (usuarioRespuesta?.data) {
                    console.log('Estructura de usuarioRespuesta:', usuarioRespuesta.data); // Log completo de la respuesta

                    // Acceder de manera segura al nombre de usuario
                    const nombreUsuario = usuarioRespuesta.data.datos?.nombreUsuario || "Desconocido";

                    return {
                      ...item,
                      creador: nombreUsuario,
                    };
                  } else {
                    console.error(`Error en la respuesta del usuario para ${item.usuarioID}`);
                  }
                } catch (error) {
                  console.error(`Error al buscar usuario con ID ${item.usuarioID}:`, error);
                }
              }
              // Si no hay usuarioID o falla la consulta, asignar "Desconocido"
              return { ...item, creador: "Desconocido" };
            })
          );

          console.log('Remeras con usuarios:', remerasConUsuarios); // Ver el estado final de las remeras
          setRemeras(remerasConUsuarios);
        } else {
          setMensaje("No se encontraron remeras.");
        }
      } catch (error) {
        console.error("Error al obtener las remeras:", error);
        setMensaje("Hubo un problema al obtener las remeras.");
      } finally {
        setLoading(false);
      }
    };

    fetchRemeras();
  }, []);

  const formatPrice = (price) => {
    return `$ ${price.toFixed(3)}`;
  };

  if (loading) {
    return <Container className="text-center mt-5"><p>Cargando remeras...</p></Container>;
  }

  return (
    <Container fluid className="px-4">
      <h3 className="my-4">Remeras</h3>

      {mensaje ? (
        <p>{mensaje}</p>
      ) : (
        <Row className="g-4">
          {remeras.map((item) => (
            <Col key={item.id} xs={12} sm={6} lg={3}>
              <Card className="product-card h-100">
                <Card.Img 
                  variant="top" 
                  src={item.image} 
                  alt={item.nombre}
                  style={{ aspectRatio: "1", objectFit: "cover" }}
                />
                <Card.Body className="d-flex flex-column">
                  <h5 className="card-title">{item.nombre}</h5>
                  <p className="card-text"><strong>Precio: </strong>{formatPrice(item.precio)}</p>
                  <p className="card-text"><strong>Creador: </strong>{item.creador}</p> {/* Nombre del creador */}
                  <Button variant="primary" href={`/remeras/personalizar/${item.id}`} className="mt-auto">
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

export default VerMasRemeras;
