import React from "react";
import { useNavigate } from "react-router-dom";
import { BsFillSignNoRightTurnFill } from "react-icons/bs";
function Unauthorized() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back one page
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-dark pt-20 pb-30 text-center">
      <BsFillSignNoRightTurnFill size={50} className="text-white" />
      <h1 className="text-danger mb-4">Unauthorized Access</h1>
      <p className="text-secondary mb-5">
        You do not have permission to access this page.
      </p>
      <button className="btn btn-primary" onClick={handleGoBack}>
        Go Back
      </button>
    </div>
  );
}

export default Unauthorized;
