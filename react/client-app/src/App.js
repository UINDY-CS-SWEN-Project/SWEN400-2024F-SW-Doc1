// import './App.css';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import LoginHome from './pages/LoginHome'
// import Home from './pages/Home'
// import Products from './pages/Products'
// import Login from './pages/Login'
// import DocumentSearch from './pages/DocumentSearch'
// import Signup from './pages/Signup'
// import Template from './pages/Template'
// import PrivateRoutes from './utils/PrivateRoutes'
// import { useEffect } from 'react';

// function App() {
//   useEffect(() => {
//     // GET request using fetch inside useEffect React hook
//     fetch('/api/db')
//         .then((data) => {console.log(data)});
//   }, []);
//   return (
//     <div className="App">
//       <Router>
//           <Routes>
//             <Route element={<PrivateRoutes />}>
//                 <Route element={<LoginHome/>} path="/home" exact/>
//                 <Route element={<Products/>} path="/products"/>
//             </Route>
//             <Route path="/" element={<Home />} />
//             <Route element={<Login/>} path="/login"/>
//             <Route element={<Signup/>} path="/signup"/>
//             <Route path="/template" element={<Template/>} />
//             <Route element={<DocumentSearch/>} path="/documentsearch"/>
//           </Routes>
//       </Router>
//     </div>
//   );
// }


// export default App;

import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginHome from './pages/LoginHome';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import DocumentSearch from './pages/DocumentSearch';
import Signup from './pages/Signup';
import Template from './pages/Template';
import PrivateRoutes from './utils/PrivateRoutes';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // GET request using fetch inside useEffect React hook
    const fetchData = async () => {
      try {
        const response = await fetch('/api/db');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data); // Log the fetched data
      } catch (error) {
        console.error('Fetch error:', error); // Handle errors appropriately
      }
    };
    fetchData();
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/home" element={<LoginHome />} />
            <Route path="/products" element={<Products />} />
          </Route>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/template" element={<Template />} />
          <Route path="/documentsearch" element={<DocumentSearch />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
