import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginHome from './pages/LoginHome'
import Home from './pages/Home'
import Products from './pages/Products'
import Login from './pages/Login'
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
          </Routes>
      </Router>
    </div>
  );
}

export default App;

