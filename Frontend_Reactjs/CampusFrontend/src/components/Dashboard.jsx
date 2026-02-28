import AdminNav from "./AdminNav";
import CardView from "./CardView";
import { useState, useEffect, useRef } from "react";

const Dashboard = () => {

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const username = localStorage.getItem("uname");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ⭐⭐⭐ FIXED LOGOUT (SESSION SAFE) ⭐⭐⭐
  const logout = () => {

    // clear all stored login data
    localStorage.clear();
    sessionStorage.clear();

    // force full reload to destroy React session
    window.location.href = "/";
  };

  return (
    <div
      className="container-fluid p-0"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(-45deg,#e3f2fd,#b2dfdb,#e1f5fe,#dcedc8)",
        backgroundSize: "400% 400%",
        animation: "gradientMove 12s ease infinite"
      }}
    >
      <div className="row g-0">

        {/* SIDEBAR */}
        <div className="col-md-2">
          <AdminNav />
        </div>

        {/* CONTENT */}
        <div className="col-md-10 p-4">

          {/* HEADER */}
          <div
            style={{
              background: "rgba(255,255,255,0.8)",
              padding: "20px 30px",
              borderRadius: "20px",
              marginBottom: "30px",
              display: "flex",
              justifyContent: "space-between",
              boxShadow: "0 15px 35px rgba(0,0,0,0.08)"
            }}
          >
            <h3 className="fw-bold m-0">📊 Admin Dashboard</h3>

            <div ref={dropdownRef} style={{ position: "relative" }}>
              <div
                onClick={() => setOpen(!open)}
                style={{
                  background: "white",
                  padding: "10px 20px",
                  borderRadius: "30px",
                  cursor: "pointer"
                }}
              >
                👤 {username} ▼
              </div>

              {open && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "55px",
                    background: "white",
                    padding: "12px",
                    borderRadius: "15px",
                    boxShadow: "0 15px 40px rgba(0,0,0,0.2)"
                  }}
                >
                  <button
                    className="btn btn-danger btn-sm w-100"
                    onClick={logout}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* CARDS */}
          <CardView />

        </div>
      </div>
    </div>
  );
};

export default Dashboard;