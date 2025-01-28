import React, { forwardRef } from 'react';

const ProductViewer = forwardRef(({ color, uploadedImage, imagePosition, selectedSleeve, selectedNeckline }, ref) => {
  const isBackView = imagePosition === 'Espalda';

  const getImageStyle = () => {
    const baseStyle = { maxWidth: '35%', maxHeight: '35%', position: 'absolute', zIndex: 3 };
    switch (imagePosition) {
      case 'Pecho centro':
        return { ...baseStyle, top: '40%', left: '50%', transform: 'translate(-50%, -50%)' };
      case 'Pecho izquierda':
        return { ...baseStyle, maxWidth: '15%', maxHeight: '15%', top: '30%', left: '38%', transform: 'translate(-50%, -50%)' };
      case 'Pecho derecha':
        return { ...baseStyle, maxWidth: '15%', maxHeight: '15%', top: '30%', right: '38%', transform: 'translate(50%, -50%)' };
      case 'Espalda':
        return { ...baseStyle, top: '35%', left: '50%', transform: 'translate(-50%, -50%)' };
      default:
        return baseStyle;
    }
  };

  const getTshirtImage = () => {
    const sleeveType = selectedSleeve === 'Larga' ? 'mangalarga' : 'mangacorta';
    const neckType = selectedNeckline === 'Alto' ? 'cuellocircular' : 'cuelloenv';
    const view = isBackView ? 'atras' : 'adelante';

    return `https://raw.githubusercontent.com/Calvo-Bautista/imagenes/refs/heads/main/${sleeveType}${neckType}${view}.png`;
  };

  return (
    <div
  className="product-viewer"
  ref={ref}
  style={{
    minHeight: '500px',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  }}
>
  <div
    style={{
      position: 'relative',
      width: '450px',
      height: '450px',
    }}
  >
    {/* Base colored t-shirt */}
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: `#${color}`,
        clipPath: 'inset(0)',
        zIndex: 1,
      }}
    />

    {/* T-shirt outline */}
    <img
      src={getTshirtImage()}
      alt="T-shirt"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: 2,
      }}
    />
        {/* Uploaded design */}
        {uploadedImage && (
          <img
            src={uploadedImage}
            alt="Uploaded Design"
            style={getImageStyle()}
          />
        )}
      </div>
    </div>
  );
});

export default ProductViewer;
