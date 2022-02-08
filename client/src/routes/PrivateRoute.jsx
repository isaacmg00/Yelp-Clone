import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { RestaurantsContext } from "../context/RestaurantsContext";

const PrivateRoute = () => {
  const { isAuthenticated, setIsAuthenticated } =
    useContext(RestaurantsContext);

  setIsAuthenticated(true);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
