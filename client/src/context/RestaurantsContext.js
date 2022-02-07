import React, { useState, createContext } from "react";

export const RestaurantsContext = createContext();

export const RestaurantsContextProvider = (props) => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState();

  const addRestaurants = (restaurant) => {
    setRestaurants([...restaurants, restaurant]);
  };
  return (
    <RestaurantsContext.Provider
      value={{
        restaurants,
        setRestaurants,
        addRestaurants,
        selectedRestaurant,
        setSelectedRestaurant,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {props.children}
    </RestaurantsContext.Provider>
  );
};
