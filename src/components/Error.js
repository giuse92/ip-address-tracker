import React from "react";
import "./Error.css";

const Error = ({ message }) => {
  return <span className="error">Error: {message}</span>;
};

export default Error;
