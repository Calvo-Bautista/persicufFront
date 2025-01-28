import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '../../helpers/autenticacion/validationSchemas';
import { useNavigate } from 'react-router-dom';
import { registrarUsuario } from '../../helpers/usuarios/loginRegisterLogout';
import '../../styles/loginForm.css' 

const RegisterForm = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm({
        resolver: yupResolver(registerSchema),
    });

    const onSubmit = async (data) => {
        try {
            await registrarUsuario(data); 
            navigate('/login'); 
        } catch (error) {
            console.error('Error al registrar:', error);
            setError('nombreUsuario', { message: 'El nombre de usuario ya está en uso' });
        }
    };

    const handleCancel = () => {
        navigate(-1); 
      };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <h2 className="text-center mb-4">Registrarse</h2>
            <div className="mb-3">
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
                <label className="form-label">Nombre</label>
                <input
                type="text"
                className="form-control"
                id="nombre"
                {...register('nombre')}
                />
                {errors.nombre && <p className="text-danger">{errors.nombre.message}</p>}
            </div>

            <div className="mb-3">
                <label className="form-label">Apellido</label>
                <input
                type="text"
                className="form-control"
                id="apellido"
                {...register('apellido')}
                />
                {errors.apellido && <p className="text-danger">{errors.apellido.message}</p>}
            </div>

            <div className="mb-3">
                <label className="form-label">Correo</label>
                <input
                type="email"
                className="form-control"
                id="correo"
                {...register('correo')}
                />
                {errors.correo && <p className="text-danger">{errors.correo.message}</p>}
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

            <div className="mb-3">
                <label className="form-label">Confirmar Contraseña</label>
                <input
                type="password"
                className="form-control"
                id="claveConfirmada"
                {...register('claveConfirmada')}
                />
                {errors.claveConfirmada && <p className="text-danger">{errors.claveConfirmada.message}</p>}
            </div>

            <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">Registrarse</button>
                <button type="button" className="btn btn-primary" onClick={handleCancel}>
                    Cancelar
                </button>
            </div>
            </form>
        </div>
    );
};

export default RegisterForm;
