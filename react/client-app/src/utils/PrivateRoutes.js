// import { Outlet, Navigate } from 'react-router-dom'

// const PrivateRoutes = () => {
//     let auth = {'token':false} //token = true means that private route will not be blocked
//     return(
//         auth.token ? <Outlet/> : <Navigate to="/login"/>
//     )
// }

// export default PrivateRoutes


// utils/PrivateRoutes.js
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const PrivateRoutes = () => {
  const { currentUser } = useAuth();
  
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;