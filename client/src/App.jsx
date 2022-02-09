import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import Home from "./routes/Home";
import UpdatePage from "./routes/UpdatePage";
import RestaurantDetailPage from "./routes/RestaurantDetailPage";
import { RestaurantsContextProvider } from "./context/RestaurantsContext";
import Login from "./routes/Login";
import Register from "./routes/Register";
import LoginPage from "./components/LoginPage";
//import "react-toastify/dist/ReactToastify.css";
const App = () => {
  //connecting the urls to the corresponding react pages
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  return (
    <RestaurantsContextProvider>
      <div className="container-fluid">
        <Router>
          <Routes>
            {/* home page route*/}
            {/* <Route element={<PrivateRoute />}>
                        <Route path="/home" element={<Home/>} />
                    </Route> */}

            {/* Update Page Route */}
            {/* <Route element={<PrivateRoute />}>
                        <Route path="/restaurants/:id/update" element={<UpdatePage/>} />
                    </Route> */}

            {/* Restaurant Detail Page Route */}
            {/* <Route element={<PrivateRoute />}>
                        <Route path="/restaurants/:id" element={<RestaurantDetailPage/>} />
                    </Route> */}

            {/* Login Page Route */}
            {/* <Route exact path = "/login"  element ={<Login/>} /> */}

            {/* Register Page Route */}
            {/* <Route exact path = "/register"  element ={<Register/>} /> */}

            <Route
              path="/home"
              element={
                isAuthenticated ? (
                  <Home setAuth={setAuth} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/restaurants/:id/update"
              element={
                isAuthenticated ? (
                  <UpdatePage setAuth={setAuth} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/restaurants/:id"
              element={
                isAuthenticated ? (
                  <RestaurantDetailPage setAuth={setAuth} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/login"
              element={
                !isAuthenticated ? (
                  <LoginPage setAuth={setAuth} />
                ) : (
                  <Navigate to="/home" />
                )
              }
            />
            <Route
              path="/register"
              element={
                !isAuthenticated ? (
                  <Register setAuth={setAuth} />
                ) : (
                  <Navigate to="/home" />
                )
              }
            />
          </Routes>
        </Router>
      </div>
    </RestaurantsContextProvider>
  );
};

export default App;
