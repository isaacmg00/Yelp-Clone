import React from "react";

const Header = ({ setAuth }) => {
  return (
    <div>
      <h1 className="font-weight-light display-1 text-center">
        Restaurant Finder
      </h1>
      <button onClick={() => setAuth(false)}>Log Out</button>
    </div>
  );
};

export default Header;
