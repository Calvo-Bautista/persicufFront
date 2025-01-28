import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutForm = () => {
  const { cerrarSesion } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    handleSubmit,
    formState: { errors },
  } = useForm(); 

  const onSubmit = async () => {
    await cerrarSesion();  
    navigate('/');  
  };

  const handleCancel = () => {
    navigate(-1); 
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
        <p>¿Estás seguro de que deseas cerrar sesión?</p>
      </div>

      <button type="submit" className="btn btn-danger">Cerrar Sesión</button>
      <button type="button" className="btn btn-secondary" onClick={handleCancel}>
        Cancelar
      </button>
    </form>
  );
};

export default LogoutForm;

