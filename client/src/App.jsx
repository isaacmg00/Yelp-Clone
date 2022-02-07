import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import UpdatePage from "./routes/UpdatePage";
import RestaurantDetailPage from "./routes/RestaurantDetailPage";
import { RestaurantsContextProvider } from "./context/RestaurantsContext";
import Login from "./routes/Login";
import PrivateRoute from "./routes/PrivateRoute";
import Register from "./routes/Register";

const App = () => {
  return (
    <RestaurantsContextProvider>
      <div className="container-fluid">
        <Router>
          <Routes>
            {/* home page route*/}
            <Route element={<PrivateRoute />}>
              <Route path="/home" element={<Home />} />
            </Route>

            {/* Update Page Route */}
            <Route element={<PrivateRoute />}>
              <Route path="/restaurants/:id/update" element={<UpdatePage />} />
            </Route>

            {/* Restaurant Detail Page Route */}
            <Route element={<PrivateRoute />}>
              <Route
                path="/restaurants/:id"
                element={<RestaurantDetailPage />}
              />
            </Route>

            {/* Login Page Route */}
            <Route exact path="/login" element={<Login />} />

            {/* Register Page Route */}
            <Route exact path="/register" element={<Register />} />
          </Routes>
        </Router>
      </div>
    </RestaurantsContextProvider>
  );
};

export default App;
