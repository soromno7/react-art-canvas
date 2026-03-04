import { Navigate } from "react-router-dom";
import LoaderComponent from "../LoaderComponent/LoaderComponent";
import { useAuth } from "../../supabase/useAuth";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoaderComponent />;
  }

  return !user ? <>{children}</> : <Navigate to="/" />;
};

export default PublicRoute;
