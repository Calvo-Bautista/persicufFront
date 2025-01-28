import React, { useState, useEffect } from "react";
import { Container, Row, Col, Nav, Button, Card } from "react-bootstrap";
import { buscarPrendas } from "../../helpers/prendasService";
import { buscarUsuario } from "../../helpers/usuarios/usuariosService";
import { useSearchParams } from "react-router-dom";
import { buscarCamperas } from "../../helpers/camperasService";
import { buscarPantalones } from "../../helpers/pantalonesService";
import { buscarRemeras } from "../../helpers/remerasService";
import { buscarZapatos } from "../../helpers/zapatosService";

export default function ResultadosBusqueda() {
  const [resultados, setResultados] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const terminoBusqueda = searchParams.get("query") || "";
  const [activeCategory, setActiveCategory] = useState("Todas");

  useEffect(() => {
    const obtenerResultados = async () => {
      try {
        setLoading(true);
        setResultados([]);
        setMensaje("");

        let respuesta;

        // Lógica para buscar según la categoría activa
        if (activeCategory === "Remeras") {
          respuesta = await buscarRemeras(terminoBusqueda);
        } else if (activeCategory === "Zapatos") {
          respuesta = await buscarZapatos(terminoBusqueda);
        } else if (activeCategory === "Pantalones") {
          respuesta = await buscarPantalones(terminoBusqueda);
        } else if (activeCategory === "Camperas") {
          respuesta = await buscarCamperas(terminoBusqueda);
        } else {
          respuesta = await buscarPrendas(terminoBusqueda); // Búsqueda general
        }

        if (respuesta?.datos && Array.isArray(respuesta.datos) && respuesta.datos.length > 0) {
          const resultadosConCreador = await Promise.all(
            respuesta.datos.map(async (prenda) => {
              if (prenda.usuarioID) {
                try {
                  const usuarioRespuesta = await buscarUsuario(prenda.usuarioID);
                  if (usuarioRespuesta?.data) {
                    return {
                      ...prenda,
                      creador: usuarioRespuesta.data.datos?.nombreUsuario || "Desconocido",
                    };
                  }
                } catch (error) {
                  console.error(`Error al buscar usuario con ID ${prenda.usuarioID}:`, error);
                }
              }
              return { ...prenda, creador: "Desconocido" };
            })
          );
          setResultados(resultadosConCreador);
        } else {
          setMensaje(respuesta?.mensaje || "No se encontraron resultados.");
        }
      } catch (error) {
        console.error("Error al buscar las prendas:", error);
        setMensaje("No se encontraron resultados.");
      } finally {
        setLoading(false);
      }
    };

    obtenerResultados();
  }, [terminoBusqueda, activeCategory]);

  const categories = [
    "Todas",
    "Remeras",
    "Camperas",
    "Pantalones",
    "Zapatos",
  ];

  const formatPrice = (price) => {
    return `$ ${price.toFixed(2)}`;
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <p>Cargando resultados...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="px-4">
      <h3 className="my-4">Resultados de la búsqueda para: "{terminoBusqueda}"</h3>

      <Nav className="border-bottom py-3 mb-4 overflow-auto flex-nowrap">
        {categories.map((category) => (
          <Nav.Item key={category}>
            <Nav.Link
              className={`text-dark me-4 ${activeCategory === category ? "fw-bold" : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      {mensaje ? (
        <p>{mensaje}</p>
      ) : (
        <Row className="g-4">
          {resultados.map((prenda) => (
            <Col key={prenda.id} xs={12} sm={6} lg={3}>
              <Card className="product-card h-100">
                <Card.Img
                  variant="top"
                  src={prenda.imagen}
                  alt={prenda.nombre}
                  style={{ aspectRatio: "1", objectFit: "cover" }}
                />
                <Card.Body className="d-flex flex-column">
                  <h5 className="card-title">{prenda.nombre}</h5>
                  <p className="card-text">
                    <strong>Precio: </strong>
                    {formatPrice(prenda.precio)}
                  </p>
                  <p className="card-text">
                    <strong>Creador: </strong>
                    {prenda.creador}
                  </p>
                  <Button
                    variant="primary"
                    href={`/prenda/${prenda.id}`}
                    className="mt-auto"
                  >
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
}
