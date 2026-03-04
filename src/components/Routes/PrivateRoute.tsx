import { Navigate } from "react-router-dom";
import LoaderComponent from "../LoaderComponent/LoaderComponent";
import { useAuth } from "../../supabase/useAuth";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoaderComponent />;
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
