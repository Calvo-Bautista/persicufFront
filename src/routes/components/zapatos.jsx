import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { getZapatos } from '../../helpers/zapatosService'; // Asegúrate de que el servicio esté correctamente importado
import { buscarUsuario } from '../../helpers/usuarios/usuariosService'; // Asegúrate de que el servicio esté correctamente importado

const VerMasZapatos = () => {
  const [zapatos, setZapatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchZapatos = async () => {
      try {
        setLoading(true);
        const respuesta = await getZapatos();
        
        if (respuesta?.datos && Array.isArray(respuesta.datos)) {
          // Crear un mapeo de zapatos con nombres de usuario
          const zapatosConUsuarios = await Promise.all(
            respuesta.datos.map(async (item) => {
              if (item.usuarioID) {
                try {
                  const usuarioRespuesta = await buscarUsuario(item.usuarioID);
                  console.log(`Respuesta de buscarUsuario para ID ${item.usuarioID}: `, usuarioRespuesta); // Muestra la respuesta completa
   
                  if (usuarioRespuesta?.data?.exito) {
                    console.log(`Estructura de usuarioRespuesta: `, usuarioRespuesta?.data?.datos); // Muestra los datos
                    const nombreUsuario = usuarioRespuesta?.data?.datos?.nombreUsuario;
                    if (nombreUsuario) {
                      return { ...item, creador: nombreUsuario };
                    } else {
                      console.error(`El usuario con ID ${item.usuarioID} no tiene un nombre de usuario válido.`);
                      return { ...item, creador: "Desconocido" };
                    }
                  } else {
                    console.error(`No se pudo encontrar el usuario con ID ${item.usuarioID}`);
                    return { ...item, creador: "Desconocido" };
                  }
                } catch (error) {
                  console.error(`Error al buscar usuario con ID ${item.usuarioID}:`, error);
                  return { ...item, creador: "Desconocido" };
                }
              } else {
                return { ...item, creador: "Desconocido" };
              }
            })
          );
   
          setZapatos(zapatosConUsuarios);
        } else {
          setMensaje("No se encontraron zapatos.");
        }
      } catch (error) {
        console.error("Error al obtener los zapatos:", error);
        setMensaje("Hubo un problema al obtener los zapatos.");
      } finally {
        setLoading(false);
      }
    };
   

    fetchZapatos();
  }, []);

  const formatPrice = (price) => {
    return `$ ${price.toFixed(3)}`;
  };

  if (loading) {
    return <Container className="text-center mt-5"><p>Cargando zapatos...</p></Container>;
  }

  return (
    <Container fluid className="px-4">
      <h3 className="my-4">Zapatos</h3>

      {mensaje ? (
        <p>{mensaje}</p>
      ) : (
        <Row className="g-4">
          {zapatos.map((item) => (
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
                  <p className="card-text"><strong>Creador: </strong>{item.creador}</p>
                  <Button variant="primary" href={`/zapatos/personalizar/${item.id}`} className="mt-auto">
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

export default VerMasZapatos;
