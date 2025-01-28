import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar el CSS de Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Importar el JS de Bootstrap
import LoginForm from './routes/components/login';
import LogoutForm from './routes/components/logout';
import RegisterForm from './routes/components/register';
import HomeForm from './routes/components/home';
import HeaderForm from './routes/components/header';
import PersonalizacionRemeras from './routes/components/PersonalizacionRemeras';
import PersonalizacionPantalones from './routes/components/PersonalizacionPantalones';
import PersonalizacionCamperas from './routes/components/PersonalizacionCamperas';
import PersonalizacionZapatos from './routes/components/PersonalizacionZapatos';
import AdminPanel from './routes/dashboard';
import ResultadosBusqueda from './routes/components/ResultadosBusqueda';
import MisPrendas from './routes/components/misprendas';
import MisPedidos from './routes/components/MisPedidos';
import Footer from './routes/components/footer';
import Unauthorized from './routes/components/Unauthorized';
import ProtectedRoute from './routes/components/ProtectedRoute'; 
import { AuthProvider } from './context/AuthContext';
import VerMasRemeras from './routes/components/remeras';
import VerMasCamperas from './routes/components/camperas';
import VerMasPantalones from './routes/components/pantalones';
import VerMasZapatos from './routes/components/zapatos';
import Prenda from './routes/components/Prenda'

const HomePage = () => (
  <div>
    <HeaderForm />
    <HomeForm />
    <Footer />
  </div>
);




const CustomRemeraPage = () => (
  <div>
    <HeaderForm />
    <PersonalizacionRemeras />
    <Footer />
  </div>
);

const CustomCamperaPage = () => (
  <div>
    <HeaderForm />
    <PersonalizacionCamperas />
    <Footer />
  </div>
);

const CustomPantalonPage = () => (
  <div>
    <HeaderForm />
    <PersonalizacionPantalones />
    <Footer />
  </div>
);

const CustomZapatoPage = () => (
  <div>
    <HeaderForm />
    <PersonalizacionZapatos />
    <Footer />
  </div>
);

const ResultadoBusquedaPage = () => (
  <div>
    <HeaderForm />
    <ResultadosBusqueda />
    <Footer />
  </div>
);

const MisPrendasPage = () => (
  <div>
    <HeaderForm />
    <MisPrendas />
    <Footer />
  </div>
);

const MisPedidosPage = () => (
  <div>
    <HeaderForm />
    <MisPedidos />
    <Footer />
  </div>
);

const VerMasRemerasPage = () => (
  <div>
    <HeaderForm />
    <VerMasRemeras />
    <Footer />
  </div>
);

const VerMasPantalonesPage = () => (
  <div>
    <HeaderForm />
    <VerMasPantalones />
    <Footer />
  </div>
);

const VerMasCamperasPage = () => (
  <div>
    <HeaderForm />
    <VerMasCamperas />
    <Footer />
  </div>
);

const VerMasZapatosPage = () => (
  <div>
    <HeaderForm />
    <VerMasZapatos />
    <Footer />
  </div>
);

const PrendaPage = () => (
  <div>
    <HeaderForm/>
    <Prenda/>
    <Footer/>
  </div>
);

function App() {
  return (
    
    <AuthProvider>
      <BrowserRouter>
        <Navigation />

        <Routes>
          <Route path="/logout" element={<LogoutForm />} />

          <Route path="/login" element={<LoginForm />} />

          <Route path="/register" element={<RegisterForm />} />

          <Route path="/home" element={<HomePage />} />

          <Route path="/remeraspersonalizar" element={<CustomRemeraPage />} />

          <Route path="/pantalonespersonalizar" element={<CustomPantalonPage />} />

          <Route path="/camperaspersonalizar" element={<CustomCamperaPage />} />

          <Route path="/zapatospersonalizar" element={<CustomZapatoPage />} />

          {/* Ruta protegida */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="Admin">
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          <Route index element={<HomePage />} />

          <Route path="/buscar" element={<ResultadoBusquedaPage />} />

          <Route path="/mis-prendas" element={<MisPrendasPage />} />

          <Route path="/mis-pedidos" element={<MisPedidosPage />} />

          {/* Pagina de acceso denegado */}
          <Route path="/unauthorized" element={<Unauthorized  />} />

          <Route path="/remeras" element={<VerMasRemerasPage/>} /> 

          <Route path="/pantalones" element={<VerMasPantalonesPage/>} /> 

          <Route path="/camperas" element={<VerMasCamperasPage/>} /> 

          <Route path="/zapatos" element={<VerMasZapatosPage/>} /> 

          <Route path="/prenda/:id" element={<PrendaPage />} />
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function Navigation() {
  return 
}

export default App;