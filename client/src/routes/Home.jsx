import React from "react";
import Header from "../components/Header";
import AddRestaurant from "../components/AddRestaurant";
import RestaurantList from "../components/RestaurantList";

const Home = ({ setAuth }) => {
  return (
    <div>
      <div>
        <h1 className="font-weight-light display-1 text-center">
          Restaurant Finder
        </h1>
        <button onClick={() => setAuth(false)}>Log Out</button>
      </div>
      <AddRestaurant />
      <RestaurantList />
    </div>
  );
};

export default Home;
