import { Navigate, Outlet } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { toast } from "react-toastify";

const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const token = localStorage.getItem("authToken") || "";

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded: any = jwtDecode(token);
    if (allowedRoles.includes(decoded.role)) {
      return <Outlet />;
    } else {
      toast.error('Unauthorized, please login')
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error("Invalid Token", error);
    localStorage.removeItem('authToken');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
