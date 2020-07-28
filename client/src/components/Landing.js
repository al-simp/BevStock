import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="jumbotron mt-5">
      <h1>Welcome to BevStock</h1>
      <p>Sign In to continue</p>
      <Link to="/login" className="btn btn-primary">
        Login
      </Link>
    </div>
  );
};

export default Landing;