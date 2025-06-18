
import React,{JSX} from 'react';
import { Navigate } from 'react-router-dom';
import { parseJwt } from '../hooks/parseJwt';

interface ProtectedProps {
  children: JSX.Element;
  roles?: string[]; // roles permitidos, opcional: si no se pasa, solo chequea autenticación
}


const ProtectedRoute: React.FC<ProtectedProps> = ({ children, roles }) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/auth?mode=login" replace />;
  }
  if (roles && roles.length > 0) {
    const payload: any = parseJwt(token);
    const userRole = payload?.role;
    if (!userRole || !roles.includes(userRole)) {
      // usuario sin rol adecuado
      return <Navigate to="/" replace />;
    }
  }
  return children;
};

export default ProtectedRoute;