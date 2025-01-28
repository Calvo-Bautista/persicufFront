import React, { useState, useRef } from 'react';

function ImageUploader({ onImageUpload, onPositionSelect }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImage, setuploadedImage] = useState(null);
  const [position, setPosition] = useState('Pecho centro');
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setuploadedImage(fileReader.result); // Actualiza la vista previa localmente
        onImageUpload(file); // Envía el archivo al componente padre
      };
      fileReader.readAsDataURL(file);
    } else {
      alert('Por favor, selecciona un archivo de imagen válido.');
    }
  };

  const handlePositionChange = (e) => {
    setPosition(e.target.value);
    onPositionSelect(e.target.value);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setuploadedImage(null);
    onImageUpload(null); // Notifica al componente padre
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Resetea el input de archivo
    }
  };

  return (
    <div className="mb-3">
      <h4>Subir imagen</h4>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="form-control mb-2"
        ref={fileInputRef}
      />
      <select
        className="form-select"
        value={position}
        onChange={handlePositionChange}
      >
        <option value="Pecho centro">Pecho centro</option>
        <option value="Pecho izquierda">Pecho izquierda</option>
        <option value="Pecho derecha">Pecho derecha</option>
        <option value="Espalda">Espalda</option>
      </select>
      {uploadedImage && (
        <div className="mt-3">
          <p>Imagen subida correctamente:</p>
          <a href={uploadedImage} target="_blank" rel="noopener noreferrer">
            <img src={uploadedImage} alt="Uploaded" style={{ maxWidth: '100%' }} />
          </a>
        </div>
      )}
      {selectedFile && (
        <div className="mt-3">
          <button className="btn btn-danger" onClick={handleRemoveImage}>
            Quitar imagen
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;