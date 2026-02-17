import { Navigate } from "react-router-dom";
import { useAuthState } from "../../firebase/useAuthState";
import LoaderComponent from "../LoaderComponent/LoaderComponent";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, loading } = useAuthState();

  if (loading) {
    return <LoaderComponent />;
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
