import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ReactFlowProvider } from '@xyflow/react';
import NotFound from './components/404';
import Dashboard from './components/Dashboard';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <ReactFlowProvider>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/404" element={<NotFound />} />
          </Routes>
        </ReactFlowProvider>
      </div>
    </Router>
  );
}

export default App;
