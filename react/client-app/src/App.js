import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginHome from './pages/LoginHome'
import Home from './pages/Home'
import Products from './pages/Products'
import Login from './pages/Login'
import DocumentSearch from './pages/DocumentSearch'
import Register from './pages/Register'
import PrivateRoutes from './utils/PrivateRoutes'
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // GET request using fetch inside useEffect React hook
    fetch('/api/db')
        .then((data) => {console.log(data)});
  }, []);
  return (
    <div className="App">
      <Router>
          <Routes>
            <Route element={<PrivateRoutes />}>
                <Route element={<LoginHome/>} path="/home" exact/>
                <Route element={<Products/>} path="/products"/>
            </Route>
            <Route element={<Home/>} path="/"/>
            <Route element={<Login/>} path="/login"/>
            <Route element={<DocumentSearch/>} path="/documentsearch"/>
            <Route element={<Register/>} path="/register"/>
          </Routes>
      </Router>
    </div>
  );
}

export default App;

