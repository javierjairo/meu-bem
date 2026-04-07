import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './components/AuthProvider';
import Layout from './components/Layout';
import Profiles from './pages/Profiles';
import Gallery from './pages/Gallery';
import Pets from './pages/Pets';
import ParaNos from './pages/ParaNos';
import Trofeus from './pages/Trofeus';

function App() {
  return (
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
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}

export default App;
