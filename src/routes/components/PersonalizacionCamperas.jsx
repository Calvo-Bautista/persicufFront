import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import ProductViewer from './persocampera/ProductViewer';
import ColorSelector from './personalizar/ColorSelector';
import ProductOptions from './persocampera/ProductOptions';
import ImageUploader from './persocampera/ImageUploader';
import { createCampera } from '../../helpers/camperasService'
import { getColores } from '../../helpers/coloresService';
import { getTalleAlfabeticoID } from '../../helpers/TAService';
import { getMaterialID, getMateriales } from '../../helpers/materialService';
import { createImagen, getimgID } from "../../helpers/imagenService"
import { getubicacionID } from '../../helpers/ubicacionesService';
import { getRubros } from '../../helpers/rubroService';
import axios from "axios";
import domToImage from 'dom-to-image-more';

const usePersonalizacionCamperas = () => {
  const [selectedColor, setSelectedColor] = useState({ codigoHexa: 'FFFFFF' });
  const [selectedSize, setSelectedSize] = useState(''); 
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePosition, setImagePosition] = useState('Pecho centro');
  const [jacketName, setJacketName] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [colors, setColors] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [price, setPrice] = useState(0);
  const [categoryTypes, setCategoryTypes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(''); 

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const colores = await getColores();
        setColors(colores);

        const materialData = await getMateriales();
        if (materialData?.datos) setMaterialTypes(materialData.datos);

        const categories = await getRubros();
        if (categories?.datos) setCategoryTypes(categories.datos);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchAllData();
  }, []);

  const updatePrice = () => {
    let basePrice = 0;

    const material = materialTypes.find(item => item.descripcion === selectedMaterial);
    if (material) basePrice += material.precio;

    if (uploadedImage) basePrice += 4000;

    setPrice(basePrice);
  };

  useEffect(() => {
    updatePrice();
  }, [selectedMaterial, uploadedImage]);

  const getColorID = () => {
    const color = colors.find(c => c.codigoHexa.toUpperCase() === selectedColor.codigoHexa.toUpperCase());
    return color ? color.id : null;
  };

  const getCategoryID = () => {
    const category = categoryTypes.find(c => c.descripcion === selectedCategory);
    return category ? category.id : null;
  };

  return {
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    uploadedImage,
    setUploadedImage,
    imagePosition,
    setImagePosition,
    jacketName,
    setJacketName,
    selectedMaterial,
    setSelectedMaterial,
    getColorID,
    categoryTypes,
    setCategoryTypes,
    price,
    selectedCategory,
    setSelectedCategory,
    getCategoryID,
  };
};

function PersonalizacionCamperas() {
  const {
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    uploadedImage,
    setUploadedImage,
    imagePosition,
    setImagePosition,
    jacketName,
    setJacketName,
    selectedMaterial,
    setSelectedMaterial,
    getColorID,
    categoryTypes,
    setCategoryTypes,
    price,
    selectedCategory,
    setSelectedCategory,
    getCategoryID,
  } = usePersonalizacionCamperas();

  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSaveJacket = async () => {
    if (!jacketName) {
      alert('Por favor, escribe un nombre para tu campera antes de guardar.');
      return;
    }

    const colorID = getColorID();
    if (!colorID) {
      alert('El color seleccionado no es válido.');
      return;
    }

    const categoryID = getCategoryID();
    if (!categoryID) {
      alert('Por favor, selecciona un rubro.');
      return;
    }

    if (!userId) {
      alert('No se pudo identificar al usuario. Inténtalo nuevamente.');
      return;
    }

    try {
      let estampado = null;
      let renderURL = null;
      let imagen = null; // Inicializa la variable imagen aquí

      if (uploadedImage) {
          const FILESTACK_API_KEY = 'AjII17vhrTW6nlVmqqZ8sz';
          let imageURL = '';
          const formData = new FormData();
          formData.append('fileUpload', uploadedImage);
          try {
              const response = await axios.post(
                  `https://www.filestackapi.com/api/store/S3?key=${FILESTACK_API_KEY}`,
                  formData
              );
              imageURL = response.data.url;
          } catch (error) {
              alert('No se pudo subir la imagen. Inténtalo nuevamente.');
              return;
          }

          const imgData = {
              path: imageURL,
              ubicacionID: await getubicacionID(imagePosition),
          };
          await createImagen(imgData);
          estampado = await getimgID(imageURL);
      }

      if (viewerRef.current) {
          const renderBlob = await domToImage.toBlob(viewerRef.current); // Cambiado a domToImage
          const FILESTACK_API_KEY = 'AjII17vhrTW6nlVmqqZ8sz';
          const formData = new FormData();
          formData.append('fileUpload', renderBlob);
          const response = await axios.post(
              `https://www.filestackapi.com/api/store/S3?key=${FILESTACK_API_KEY}`,
              formData
          );
          renderURL = response.data.url;
          const imgData2 = {
              path: renderURL,
          };
          await createImagen(imgData2);
          imagen = await getimgID(renderURL); // Esto ya no generará el error
      }

      const jacketData = {
        precio: price,
        rubroID: categoryID,
        colorID,
        estampadoID: estampado,
        imagenID: imagen,
        materialID: await getMaterialID(selectedMaterial),
        usuarioID: userId,
        nombre: jacketName,
        talleAlfabeticoID: await getTalleAlfabeticoID(selectedSize),
      };

      await createCampera(jacketData);
      alert(`Tu campera "${jacketName}" ha sido guardada exitosamente.`);

      navigate('/');
    } catch (error) {
      alert('No se pudo guardar la prenda. Inténtalo nuevamente.');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Personaliza tu campera</h1>
      <div className="row">
        <div className="col-md-6">
          <ProductViewer
            color={selectedColor.codigoHexa}
            uploadedImage={uploadedImage}
            imagePosition={imagePosition}
            selectedCategory={selectedCategory}
          />
          <div className="mt-3">
            <h4>Precio: ${price}</h4>
          </div>
        </div>
        <div className="col-md-6">
          <ColorSelector onColorSelect={setSelectedColor} />
          <ImageUploader
            onImageUpload={setUploadedImage}
            onPositionSelect={setImagePosition}
          />
          <div className="mb-3">
            <label htmlFor="jacketName" className="form-label">Nombre de la campera:</label>
            <input
              type="text"
              id="jacketName"
              className="form-control"
              value={jacketName}
              onChange={(e) => setJacketName(e.target.value)}
              placeholder="Ingresa un nombre para tu campera"
            />
          </div>
          <ProductOptions
            onSizeChange={setSelectedSize}
            onCategoryChange={setSelectedCategory}
            onMaterialChange={setSelectedMaterial}
            selectedSize={selectedSize}
            selectedCategory={selectedCategory}
            selectedMaterial={selectedMaterial}
          />
          <button
            className="btn btn-primary mt-3"
            onClick={handleSaveJacket}
          >
            Guardar prenda
          </button>
        </div>
      </div>
    </div>
  );
}

export default PersonalizacionCamperas;
