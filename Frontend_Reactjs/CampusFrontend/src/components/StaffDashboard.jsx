import StaffNav from "./StaffNav";
import CardView from "./CardView";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";

const StaffDashboard = () => {

  const history = useHistory();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const username = localStorage.getItem("uname");

  // Auto close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 const logout = () => {
  localStorage.clear();
  window.history.pushState(null, "", "/");
  window.location.replace("/");
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

      <style>
        {`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        `}
      </style>

      <div className="row g-0">

        {/* Sidebar */}
        <div className="col-md-2">
          <StaffNav />
        </div>

        {/* Main Content */}
        <div className="col-md-10 p-4">

          {/* ===== PREMIUM HEADER ===== */}
          <div
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(15px)",
              padding: "20px 30px",
              borderRadius: "25px",
              marginBottom: "30px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
              position: "relative",
              zIndex: 10
            }}
          >
            <h3 className="fw-bold text-dark m-0">
              📊 Staff Dashboard
            </h3>

            {/* Profile Dropdown */}
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <div
                onClick={() => setOpen(!open)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  background: "white",
                  padding: "10px 20px",
                  borderRadius: "30px",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
                }}
              >
                👤 <span className="ms-2 fw-semibold">{username}</span>
                <span className="ms-2">▼</span>
              </div>

              {open && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "60px",
                    background: "white",
                    borderRadius: "15px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    width: "180px",
                    padding: "12px",
                    animation: "fadeIn 0.2s ease",
                    zIndex: 9999
                  }}
                >
                  <button
                    className="btn btn-outline-primary btn-sm w-100 mb-2"
                    onClick={() => history.push("/updateProfile")}
                  >
                    ✏ Edit Profile
                  </button>

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

          {/* ===== CARD SECTION ===== */}
          <CardView />

        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
