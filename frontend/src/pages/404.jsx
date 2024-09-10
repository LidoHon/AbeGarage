import React from "react";
import { useNavigate } from "react-router-dom";
import { BsFillExclamationOctagonFill } from "react-icons/bs";
const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-dark text-center text-white">
      <BsFillExclamationOctagonFill size={50} />
      <h1 className="display-1">404</h1>
      <h2 className="mb-4">Oops! Page Not Found</h2>
      <p className="mb-5">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button className="btn btn-primary" onClick={handleGoHome}>
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
