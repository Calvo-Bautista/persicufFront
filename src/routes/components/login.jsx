import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../helpers/autenticacion/validationSchemas';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/loginForm.css' 

const LoginForm = () => {
  const { iniciarSesion, error } = useContext(AuthContext); 
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const success = await iniciarSesion(data);
    if (success) {
        navigate('/');
    }}

  const handleRegister = () => {
    navigate('/register'); 
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <h2 className="text-center mb-4">Iniciar Sesión</h2>

        <div className="mb-1">
          <label className="form-label">Usuario</label>
          <input
            type="text"
            className="form-control"
            id="nombreUsuario"
            {...register('nombreUsuario')}
          />
          {errors.nombreUsuario && <p className="text-danger">{errors.nombreUsuario.message}</p>}
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            id="clave"
            {...register('clave')}
          />
          {errors.clave && <p className="text-danger">{errors.clave.message}</p>}
        </div>

        {error && <p className="text-danger">{error}</p>}

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
          <button type="button" className="btn btn-primary" onClick={handleRegister}>
            Registrate
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
