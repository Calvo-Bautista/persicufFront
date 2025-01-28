import React, { useContext, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import '../../styles/styleheader.css';

const HeaderForm = () => {
  const { user } = useContext(AuthContext); // Obtenemos `user` del contexto
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(""); // Estado para manejar el término de búsqueda

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/buscar?query=${encodeURIComponent(searchTerm)}`); // Redirige a /buscar con el término
    }
  };

  const handleLogoutClick = () => {
    navigate("/logout"); // Redirige a la página de LogoutForm
  };

  return (
    <header className="bg-primary text-white py-3">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between">
          {/* Logo a la izquierda */}
          <div className="logo">
            <h1 className="mb-0">
              <NavLink to="/home" className="text-white text-decoration-none">
                Persicuf
              </NavLink>
            </h1>
          </div>

          {/* Barra de búsqueda al centro */}
          <div className="search-bar">
            <form className="d-flex justify-content-center" onSubmit={handleSearch}>
              <input
                type="text"
                className="form-control me-2"
                placeholder="Buscar..."
                aria-label="Buscar"
                style={{ maxWidth: "400px" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el estado
              />
              <button className="btn btn-light" type="submit">
                Buscar
              </button>
            </form>
          </div>

          {/* Navegación a la derecha */}
          <div className="navigation">
            <nav className="nav">
              {user ? (
                <>
                  {/* Mostrar opciones adicionales solo si el usuario está logueado */}
                  <NavLink
                    to="/mis-prendas"
                    className={({ isActive }) =>
                      `nav-link text-white ${isActive ? "active" : ""}`
                    }
                  >
                    Mis Prendas
                  </NavLink>
                  <NavLink
                    to="/mis-pedidos"
                    className={({ isActive }) =>
                      `nav-link text-white ${isActive ? "active" : ""}`
                    }
                  >
                    Mis Pedidos
                  </NavLink>
                  <span className="nav-link text-white">
                    Bienvenido, {user.nombreUsuario}
                  </span>
                  <button
                    className="btn btn-outline-light ms-2"
                    onClick={handleLogoutClick} // Redirige al LogoutForm
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `nav-link text-white ${isActive ? "active" : ""}`
                    }
                  >
                    Registrarse
                  </NavLink>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `nav-link text-white ${isActive ? "active" : ""}`
                    }
                  >
                    Ingresá
                  </NavLink>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderForm;
