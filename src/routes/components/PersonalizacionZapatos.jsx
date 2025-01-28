import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import ProductViewer from './persozapato/ProductViewer';
import ColorSelector from './personalizar/ColorSelector';
import ProductOptions from './persozapato/ProductOptions';
import { createZapato } from '../../helpers/zapatosService'
import { getColores } from '../../helpers/coloresService';
import { getTalleNumericoID } from '../../helpers/TNService';
import { getMaterialID, getMateriales } from '../../helpers/materialService';
import { getRubros } from '../../helpers/rubroService';

const usePersonalizacionZapatos = () => {
  const [selectedColor, setSelectedColor] = useState({ codigoHexa: 'FFFFFF' });
  const [selectedSize, setSelectedSize] = useState(''); 
  const [shoeName, setShoeName] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [colors, setColors] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [price, setPrice] = useState(0);
  const [categoryTypes, setCategoryTypes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(''); 
  const [hasMetalTip, setHasMetalTip] = useState(false);

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
    
    if (!!hasMetalTip) basePrice += 6000;

    setPrice(basePrice);
  };

  useEffect(() => {
    updatePrice();
  }, [hasMetalTip,selectedMaterial]);

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
    shoeName,
    setShoeName,
    selectedMaterial,
    setSelectedMaterial,
    getColorID,
    categoryTypes,
    setCategoryTypes,
    price,
    selectedCategory,
    setSelectedCategory,
    getCategoryID,
    hasMetalTip,
    setHasMetalTip,
  };
};

function PersonalizacionZapatos() {
  const {
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    shoeName,
    setShoeName,
    selectedMaterial,
    setSelectedMaterial,
    getColorID,
    categoryTypes,
    setCategoryTypes,
    price,
    selectedCategory,
    setSelectedCategory,
    getCategoryID,
    hasMetalTip,
    setHasMetalTip,
  } = usePersonalizacionZapatos();

  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSaveShoe = async () => {
    if (!shoeName) {
      alert('Por favor, escribe un nombre para tus zapatos antes de guardar.');
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

      const shoeData = {
        precio: price,
        rubroID: categoryID,
        colorID,
        materialID: await getMaterialID(selectedMaterial),
        usuarioID: userId,
        nombre: shoeName,
        puntaMetal: hasMetalTip,
        talleNumericoID: await getTalleNumericoID(selectedSize),
      };

      await createZapato(shoeData);
      alert(`Tus zapatos "${shoeName}" han sido guardados exitosamente.`);

      navigate('/');
    } catch (error) {
      alert('No se pudo guardar la prenda. Inténtalo nuevamente.');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Personaliza tus zapatos</h1>
      <div className="row">
        <div className="col-md-6">
          <ProductViewer
            color={selectedColor.codigoHexa}
            selectedCategory={selectedCategory}
          />
          <div className="mt-3">
            <h4>Precio: ${price}</h4>
          </div>
        </div>
        <div className="col-md-6">
          <ColorSelector onColorSelect={setSelectedColor} />
          <div className="mb-3">
            <label htmlFor="shoeName" className="form-label">Nombre de los zapatos:</label>
            <input
              type="text"
              id="shoeName"
              className="form-control"
              value={shoeName}
              onChange={(e) => setShoeName(e.target.value)}
              placeholder="Ingresa un nombre para tus zapatos"
            />
          </div>
          <ProductOptions
            onSizeChange={setSelectedSize}
            onCategoryChange={setSelectedCategory}
            onMaterialChange={setSelectedMaterial}
            onMetalTipChange={setHasMetalTip}
            selectedSize={selectedSize}
            selectedCategory={selectedCategory}
            selectedMaterial={selectedMaterial}
            hasMetalTip={hasMetalTip}
          />
          <button
            className="btn btn-primary mt-3"
            onClick={handleSaveShoe}
          >
            Guardar prenda
          </button>
        </div>
      </div>
    </div>
  );
}

export default PersonalizacionZapatos;
