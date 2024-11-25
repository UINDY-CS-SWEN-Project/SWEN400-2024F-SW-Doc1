import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import DocumentSearch from './pages/DocumentSearch';
import TeamsPage from './pages/TeamsPage';
import TextEditor from './pages/TextEditor';
import PrivateRoutes from './utils/PrivateRoutes';
import { useAuth } from './contexts/authContext';
import { Navigate } from 'react-router-dom';
import Editor from './pages/Editor';

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
          {/* Public routes */}
          <Route
            path="/login"
            element={currentUser ? <Navigate to="/home" replace /> : <Login />}
          />
          <Route path="/register" element={<Register />} />


          {/* Private routes */}
          <Route element={<PrivateRoutes />}>
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<DocumentSearch />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/edit" element={<TextEditor />} /> {/* Create new document */}
            <Route path="/edit" element={<Editor />} />
          </Route>


          {/* Default redirect */}
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
