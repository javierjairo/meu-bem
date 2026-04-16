import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './components/AuthProvider';
import ClimaProvider from './components/ClimaProvider';
import Layout from './components/Layout';
import Profiles from './pages/Profiles';
import Gallery from './pages/Gallery';
import Pets from './pages/Pets';
import ParaNos from './pages/ParaNos';
import Trofeus from './pages/Trofeus';
import Motivos from './pages/Motivos';
import Universo from './pages/Universo';

function App() {
  return (
    <ClimaProvider>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/perfis" replace />} />
              <Route path="perfis" element={<Profiles />} />
              <Route path="galeria" element={<Gallery />} />
              <Route path="pets" element={<Pets />} />
              <Route path="para-nos" element={<ParaNos />} />
              <Route path="trofeus" element={<Trofeus />} />
              <Route path="motivos" element={<Motivos />} />
              <Route path="universo" element={<Universo />} />
            </Route>
          </Routes>
        </HashRouter>
      </AuthProvider>
    </ClimaProvider>
  )
}

export default App;
