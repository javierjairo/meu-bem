import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Profiles from './pages/Profiles';
import Gallery from './pages/Gallery';
import Pets from './pages/Pets';
import ParaNos from './pages/ParaNos';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/perfis" replace />} />
          <Route path="perfis" element={<Profiles />} />
          <Route path="galeria" element={<Gallery />} />
          <Route path="pets" element={<Pets />} />
          <Route path="para-nos" element={<ParaNos />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App;
