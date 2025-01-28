import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getCamperas } from '../../helpers/camperasService';
import { getPantalones } from '../../helpers/pantalonesService';
import { getRemeras } from '../../helpers/remerasService';
import { getZapatos } from '../../helpers/zapatosService';
import { buscarUsuario } from '../../helpers/usuarios/usuariosService';
import { getimgURLporID } from '../../helpers/imagenService';
import { Link } from 'react-router-dom';

const HomeForm = () => {
  const [remeras, setRemeras] = useState([]);
  const [pantalones, setPantalones] = useState([]);
  const [camperas, setCamperas] = useState([]);
  const [zapatos, setZapatos] = useState([]);
  const [creadores, setCreadores] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener la URL de la imagen para cada prenda
  const addImageURLs = async (prendas) => {
    try {
      const updatedPrendas = await Promise.all(
        prendas.map(async (prenda) => {
          const imageUrl = await getimgURLporID(prenda.imagenID);
          return { ...prenda, image: imageUrl };
        })
      );
      return updatedPrendas;
    } catch (error) {
      console.error("Error al agregar URLs de imágenes:", error.message);
      return prendas; // Retorna las prendas sin URL si hay error
    }
  };

  // Función para obtener las prendas desde la base de datos
  useEffect(() => {
    const fetchPrendas = async () => {
      try {
        setLoading(true);
        const [remerasData, pantalonesData, camperasData, zapatosData] = await Promise.all([
          getRemeras(),
          getPantalones(),
          getCamperas(),
          getZapatos(),
        ]);

        const remerasWithImages = await addImageURLs(remerasData.datos.slice(0, 4));
        const pantalonesWithImages = await addImageURLs(pantalonesData.datos.slice(0, 4));
        const camperasWithImages = await addImageURLs(camperasData.datos.slice(0, 4));
        const zapatosWithImages = await addImageURLs(zapatosData.datos.slice(0, 4));

        setRemeras(remerasWithImages);
        setPantalones(pantalonesWithImages);
        setCamperas(camperasWithImages);
        setZapatos(zapatosWithImages);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Hubo un error al cargar las prendas');
        setLoading(false);
      }
    };

    fetchPrendas();
  }, []);

  // Función para buscar el nombre del creador
  const fetchCreador = async (usuarioID) => {
    if (!usuarioID || creadores[usuarioID]) return; // Evita solicitudes duplicadas
    try {
      const response = await buscarUsuario(usuarioID); // Llama a la función de búsqueda
      const nombre = response.data.datos.nombreUsuario;
      setCreadores((prev) => ({
        ...prev,
        [usuarioID]: nombre,
      }));
    } catch (error) {
      console.error(`Error al obtener el creador con ID ${usuarioID}:`, error);
    }
  };

  // Buscar los nombres de los creadores al cargar las prendas
  useEffect(() => {
    [...remeras, ...pantalones, ...camperas, ...zapatos].forEach((item) => {
      fetchCreador(item.usuarioID);
    });
  }, [remeras, pantalones, camperas, zapatos]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  const renderPrendas = (prendas, tipo) => (
    <section className="py-5 bg-light">
      <div className="container">
        <h3 className="text-center mb-4">{tipo}</h3>
        <div className="row">
          {prendas.map((item) => (
            <div key={item.id} className="col-md-3 mb-4">
              <div className="card">
              <img 
                src={item.image} 
                className="card-img-top" 
                alt={item.nombre} 
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
                <div className="card-body">
                  <h5 className="card-title">{item.nombre}</h5>
                  <p className="card-text"><strong>Precio: </strong>{item.precio} USD</p>
                  <p className="card-text">
                    <strong>Creador: </strong>
                    {creadores[item.usuarioID] || 'Cargando...'}
                  </p>
                  <Link to={`/prenda/${item.id}`} className="btn btn-primary">
                    Ver prenda
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-3">
          <Link to={`/${tipo.toLowerCase()}`} className="btn btn-secondary">Ver más {tipo.toLowerCase()}</Link>
        </div>
      </div>
    </section>
  );

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1">
        <section className="py-5 bg-light">
          <div className="container mt-0">
            <h2 className="text-center mb-4">Bienvenido a Persicuf</h2>
            <p className="text-center lead">¡Personaliza tus prendas de la manera que tú quieras!</p>
          </div>
        </section>

        {/* Mostrar categorías */}
        <section className="py-5 bg-light">
          <div className="container">
            <h3 className="text-center mb-4">Prendas a personalizar</h3>
            <div className="row">
              {['Remeras', 'Camperas', 'Pantalones', 'Zapatos'].map((product, index) => (
                <div key={index} className="col-md-3 mb-4">
                  <div className="card">
                    <img 
                      src={`https://via.placeholder.com/200?text=${product}`} 
                      className="card-img-top" 
                      alt={product} 
                    />
                    <div className="card-body">
                      <h5 className="card-title">{product}</h5>
                      <p className="card-text">
                        Personaliza tus {product.toLowerCase()} con el diseño que más te guste.
                      </p>
                      <Link 
                        to={`/${product.toLowerCase()}personalizar`} 
                        className="btn btn-primary"
                      >
                        Personalizar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Secciones de prendas */}
        {renderPrendas(remeras, 'Remeras')}
        {renderPrendas(pantalones, 'Pantalones')}
        {renderPrendas(camperas, 'Camperas')}
        {renderPrendas(zapatos, 'Zapatos')}
      </main>
    </div>
  );
};

export default HomeForm;
