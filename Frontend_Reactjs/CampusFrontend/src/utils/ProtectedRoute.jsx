// ProtectedRoute.js
// ENTERPRISE LEVEL ROUTE SECURITY

import React from "react";
import { Route, Redirect } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ component: Component, role, ...rest }) => {

  return (
    <Route
      {...rest}
      render={(props) => {

        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role");

        // ================= NO TOKEN =================
        if (!token) {
          return <Redirect to="/" />;
        }

        // ================= TOKEN VALIDATION =================
        try {

          const decoded = jwtDecode(token);

          // token expired
          if (decoded.exp * 1000 < Date.now()) {
            localStorage.clear();
            sessionStorage.clear();
            return <Redirect to="/" />;
          }

        } catch {
          localStorage.clear();
          sessionStorage.clear();
          return <Redirect to="/" />;
        }

        // ================= ROLE CHECK (FIXED) =================
        if (role && userRole !== role) {
          return <Redirect to="/" />;
        }

        // ================= ALLOW ACCESS =================
        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;