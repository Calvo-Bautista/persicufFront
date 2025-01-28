import React from 'react';
import './ProductOptions';

const ProductViewer= ({ color, uploadedImage, imagePosition, selectedLarge },ref) => {
  const isBackView = imagePosition === 'Detrás';
  const getImageStyle = () => {
    const baseStyle = { maxWidth: '20%', maxHeight: '20%', position: 'absolute' };
    switch (imagePosition) {
      case 'Bolsillo izquierdo':
        return { ...baseStyle, top: '25%', left: '25%', transform: 'translate(-50%, -50%)' };
      case 'Bolsillo derecho':
        return { ...baseStyle, top: '25%', left: '75%', transform: 'translate(-50%, -50%)' };
      case 'Detrás':
        return { ...baseStyle, top: '25%', left: '50%', transform: 'translate(-50%, -50%) rotateY(180deg)' };
      default:
        return baseStyle;
    }
  };
  const getPantsImage = () => {   //Corta o Larga
    const largeType = selectedLarge === 'Largo' ? 'largo' : 'corto';
    const view = isBackView ? 'atras' : 'adelante';

    return `https://raw.githubusercontent.com/Calvo-Bautista/imagenes/refs/heads/main/pantalon${largeType}${view}.png`;
  };

  return (
    <div className="product-viewer" 
      ref={ref}
      style={{ 
      minHeight: '500px', 
      display: 'flex', 
      alignItems: 'center',
      overflow: 'hidden',
      backgroundColor: '#ffffff'
    }}>
      <div style={{
        position: 'relative',
        width: '450px',
        height: '450px',
      }}>
        {/* Base colored t-shirt */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: `#${color}`,
          clipPath: 'inset(0)',
          zIndex: 1
        }} />

        {/* T-shirt outline */}
        <img
          src={getPantsImage()}  // Asegúrate de que getTshirtImage() devuelve una URL válida
          alt={"T-shirt"}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 2
          }}
        />

        {/* Uploaded design */}
        {uploadedImage && (
          <img 
            src={uploadedImage}
            alt={"Uploaded Design"}
            style={getImageStyle()}
          />
        )}
      </div>
    </div>
  );
};

export default ProductViewer;