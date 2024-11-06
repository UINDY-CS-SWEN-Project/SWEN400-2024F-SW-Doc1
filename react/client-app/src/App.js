import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext';
import LoginHome from './pages/LoginHome';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import DocumentSearch from './pages/DocumentSearch';
import Signup from './pages/Register';
import PrivateRoutes from './utils/PrivateRoutes';
import { useAuth } from './contexts/authContext';
import { Navigate } from 'react-router-dom';
import Template from './pages/Template';
import TeamsPage from './pages/TeamsPage';
// import CssBaseline from '@mui/material';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={currentUser ? <Navigate to="/home" replace /> : <Login />} 
          />
          <Route path="/register" element={<Register />} />

          <Route element={<PrivateRoutes />}>
            <Route path="/home" element={<Home />} />
            <Route path="/main" element={<Home />} />
            <Route path="/documentsearch" element={<DocumentSearch />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/template" element={<Template />} />
          </Route>

          <Route 
            path="/" 
            element={currentUser ? <Navigate to="/home" /> : <Navigate to="/login" />} 
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
