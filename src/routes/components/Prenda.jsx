import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Importamos useNavigate para redirección
import 'bootstrap/dist/css/bootstrap.min.css';
import { getPrendaPorID } from '../../helpers/prendasService';
import { buscarColorPorID } from '../../helpers/coloresService';
import { buscarRubroPorID } from '../../helpers/rubroService';
import { buscarMaterialPorID } from '../../helpers/materialService';
import { buscarUsuario } from '../../helpers/usuarios/usuariosService';

const Prenda = () => {
  const { id } = useParams();
  const navigate = useNavigate();  // Usamos navigate para redirigir a otras páginas
  const [prenda, setPrenda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [color, setColor] = useState('');
  const [rubro, setRubro] = useState('');
  const [material, setMaterial] = useState('');
  const [usuario, setUsuario] = useState('');

  useEffect(() => {
    const fetchPrenda = async () => {
      try {
        setLoading(true);
        const data = await getPrendaPorID(id); // Llama a tu servicio para obtener los detalles de la prenda
        console.log("Datos de la prenda:", data); // Verifica que los datos de la prenda están bien
        setPrenda(data);

        // Obtener los nombres de los atributos usando las APIs
        const colorData = await buscarColorPorID(data.datos.colorID);  
        const rubroData = await buscarRubroPorID(data.datos.rubroID);  
        const materialData = await buscarMaterialPorID(data.datos.materialID);  
        const usuarioData = await buscarUsuario(data.datos.usuarioID);
        
        console.log("Datos de usuario:", usuarioData); // Verifica que los datos de usuario están bien

        if (usuarioData && usuarioData.data && usuarioData.data.datos && usuarioData.data.datos.nombreUsuario) {
          setUsuario(usuarioData.data.datos.nombreUsuario); // Accede correctamente a nombreUsuario
        } else {
          console.error('No se encontró nombreUsuario en los datos de usuario');
          setUsuario('Usuario no encontrado');
        }

        setColor(colorData.nombre);  
        setRubro(rubroData.descripcion);  
        setMaterial(materialData.descripcion);  

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Error al cargar los detalles de la prenda.');
        setLoading(false);
      }
    };

    fetchPrenda();
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!prenda) return <div>No se encontró la prenda.</div>;

  const { nombre, precio, descripcion, image } = prenda.datos;

  // Función para redirigir a la página de personalización
  const handlePersonalizarClick = () => {
    // Aquí se redirige a una página de personalización
    // Cambia '/personalizar' por la ruta correspondiente de tu página
    navigate(`/personalizar/${id}`);
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-5">
          <img
            src={image}
            alt={nombre}
            className="img-fluid rounded"
          />
        </div>

        <div className="col-md-7">
          <h1 className="h2">{nombre}</h1>
          <p><strong>Precio:</strong> {precio} USD</p>
          <p>{descripcion}</p>

          {/* Mostrar los nombres en lugar de los IDs */}
          <p><strong>Color:</strong> {color}</p>
          <p><strong>Rubro:</strong> {rubro}</p>
          <p><strong>Material:</strong> {material}</p>
          <p><strong>Usuario:</strong> {usuario}</p>

          {/* Botón para personalizar la prenda */}
          <button className="btn btn-secondary mt-4" onClick={handlePersonalizarClick}>
            Personalizar prenda
          </button>

          <button className="btn btn-primary mt-4">Comprar ahora</button>
        </div>
      </div>
    </div>
  );
};

export default Prenda;
