import React from "react";

export default function Alert({ type, message }) {

  return (
    <div className={`alert alert-${type} alert-dismissible`} role="alert">
        <div>{message}</div>
    </div>
  );
}
