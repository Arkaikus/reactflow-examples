import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import NotFound from './components/404';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="*" element={<Navigate to="/404" />} />
          <Route path="/404" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
