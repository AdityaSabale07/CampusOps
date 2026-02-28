import axios from "../api/axiosConfig";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {

  const dispatch = useDispatch();
  const history = useHistory();

  const [user, setUser] = useState({
    email: "",
    pwd: ""
  });

  // 🔥 AUTO REDIRECT + SESSION FIX
  useEffect(() => {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // ⭐ ENTERPRISE SESSION VALIDATION
    if (token) {
      try {

        const decoded = jwtDecode(token);

        // check expiry
        const now = Date.now() / 1000;

        if (decoded.exp && decoded.exp < now) {
          localStorage.clear();
          return;
        }

      } catch {
        // invalid token
        localStorage.clear();
        return;
      }
    }

    if (token && role) {
      if (role === "ADMIN") history.replace("/dashboard");
      if (role === "STAFF") history.replace("/staffdashboard");
      if (role === "STUDENT") history.replace("/studentdashboard");
    }

  }, []);

  const handleInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.email || !user.pwd) {
      toast.error("Please enter Email and Password");
      return;
    }

    try {

      // ⭐ CLEAR OLD SESSION FIRST
      localStorage.clear();

      const resp = await axios.post("/api/auth/login", {
        email: user.email,
        pwd: user.pwd
      });

      const token = resp.data;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);

      const email = decoded.sub;
      const role = decoded.role?.toUpperCase();

      localStorage.setItem("role", role);

      // 🔥 GET PROFILE USING EMAIL
      const profileResp =
        await axios.get(`/api/users/email/${email}`);

      const profile = profileResp.data;

      localStorage.setItem("userid", profile.userid);
      localStorage.setItem("uname", profile.uname);

      if (profile.course && profile.course.id) {
        localStorage.setItem("courseId", profile.course.id);
      } else {
        localStorage.removeItem("courseId");
      }

      dispatch({ type: "IsLoggedIn" });

      toast.success("Login successful");

      if (role === "ADMIN")
        history.replace("/dashboard");
      else if (role === "STAFF")
        history.replace("/staffdashboard");
      else if (role === "STUDENT")
        history.replace("/studentdashboard");
      else
        history.replace("/");

    } catch {
      toast.error("Invalid Email or Password");
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        padding: "40px 0",
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
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes floatAvatar {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }
        `}
      </style>

      <div className="col-md-4">

        <div
          style={{
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(20px)",
            padding: "50px 40px",
            borderRadius: "30px",
            boxShadow: "0 30px 80px rgba(0,0,0,0.15)",
            animation: "fadeIn 0.5s ease",
            textAlign: "center"
          }}
        >

          <div
            style={{
              width: "90px",
              height: "90px",
              margin: "0 auto 20px",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#4e73df,#1cc88a)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "40px",
              color: "white",
              boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
              animation: "floatAvatar 3s ease-in-out infinite"
            }}
          >
            👤
          </div>

          <h3 className="fw-bold mb-2">Welcome Back</h3>
          <p className="text-muted mb-4">Login to continue</p>

          <form onSubmit={handleSubmit}>

            <div className="mb-3 text-start">
              <label className="fw-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleInput}
                className="form-control"
                placeholder="Enter Email"
                required
                style={{ borderRadius: "15px", padding: "10px" }}
              />
            </div>

            <div className="mb-4 text-start">
              <label className="fw-semibold">Password</label>
              <input
                type="password"
                name="pwd"
                value={user.pwd}
                onChange={handleInput}
                className="form-control"
                placeholder="Enter Password"
                required
                style={{ borderRadius: "15px", padding: "10px" }}
              />
            </div>

            <button
              type="submit"
              className="btn w-100"
              style={{
                background: "linear-gradient(90deg,#4e73df,#1cc88a)",
                color: "white",
                padding: "12px",
                borderRadius: "30px",
                fontWeight: "600",
                border: "none",
                boxShadow: "0 15px 35px rgba(0,0,0,0.15)"
              }}
            >
              🚀 Login
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Login;