import React, { Fragment } from "react";

const LoginPage = ({ setAuth }) => {
  return (
    <Fragment>
      <h1>Login</h1>
      <button onClick={() => console.log("Hello")}>Authenticate</button>
    </Fragment>
  );
};

export default LoginPage;
