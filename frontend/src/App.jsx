import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import NotFound from './components/404';
import Quickstart from './components/quickstart';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="*" element={<Navigate to="/quickstart" />} />
          <Route path="/quickstart" element={<Quickstart />} />
          <Route path="/404" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
