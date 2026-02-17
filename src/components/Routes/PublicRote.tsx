import { Navigate } from "react-router-dom";
import { useAuthState } from "../../firebase/useAuthState";
import LoaderComponent from "../LoaderComponent/LoaderComponent";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { user, loading } = useAuthState();

  if (loading) {
    return <LoaderComponent />;
  }

  return !user ? <>{children}</> : <Navigate to="/" />;
};

export default PublicRoute;
