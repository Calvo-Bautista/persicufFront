import React from 'react';

function ProductViewer({ color, hasMetalToe },ref) {
  const getShoeImage = () => {
    return `https://raw.githubusercontent.com/Calvo-Bautista/imagenes/refs/heads/main/zapatilla.png`;
  };

  return (
    <div className="product-viewer" 
      ref={ref}
      style={{ 
      minHeight: '400px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        width: '400px',
        height: '150px',
        backgroundColor: color ? `#${color}` : '#000000',
        position: 'relative',
        borderRadius: '0 50px 0 0',
        // boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
      }}>
        <img
          src={getShoeImage()}
          alt="Shoe"
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
        {/* Punta metÃ¡lica */}
        {hasMetalToe && (
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '80px',
            height: '60px',
            backgroundColor: '#C0C0C0',
            borderRadius: '0 50px 0 20px',
          }}></div>
        )}
      </div>
    </div>
  );
}

export default ProductViewer;