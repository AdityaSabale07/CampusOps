import axios from "../api/axiosConfig";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import AdminNav from "./AdminNav";

const Register = () => {

  const history = useHistory();

  const [courses, setCourses] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // ⭐ confirmPassword ONLY FRONTEND
  const [user, setUser] = useState({
    email: "",
    uname: "",
    pwd: "",
    confirmPassword: "",
    phone: "",
    gender: "",
    address: "",
    staffid: "",
    courseId: "",
    role: "STAFF"
  });

  useEffect(() => {
    axios.get("/api/courses")
      .then(resp => setCourses(resp.data))
      .catch(() => toast.error("Failed to load courses"));
  }, []);

  const handleInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.uname || !user.pwd || !user.email) {
      toast.error("Please fill required fields");
      return;
    }

    // ⭐ PASSWORD MATCH VALIDATION
    if (user.pwd !== user.confirmPassword) {
      toast.error("Password and Confirm Password must match");
      return;
    }

    try {

      // ⭐ confirmPassword NOT SENT
      const payload = {
        email: user.email,
        uname: user.uname,
        pwd: user.pwd,
        phone: user.phone,
        gender: user.gender,
        address: user.address,
        staffid: user.role === "STAFF"
          ? parseInt(user.staffid || 0)
          : 0,
        courseId: user.role !== "ADMIN"
          ? parseInt(user.courseId || 0)
          : null,
        role: user.role
      };

      await axios.post("/api/users/admin/create", payload);

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        history.push("/dashboard");
      }, 2000);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error creating user"
      );
    }
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

        @keyframes fadeScale {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        `}
      </style>

      <div className="row g-0">

        <div className="col-md-2">
          <AdminNav />
        </div>

        <div className="col-md-10 p-4">

          <div
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(15px)",
              padding: "30px",
              borderRadius: "25px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.08)"
            }}
          >
            <h3 className="fw-bold mb-4">👤 Create New User</h3>

            <form onSubmit={handleSubmit}>

              <div className="row">

                {/* ROW 1 */}
                <div className="col-md-6 mb-3">
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={user.email}
                    onChange={handleInput}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    name="uname"
                    value={user.uname}
                    onChange={handleInput}
                    className="form-control"
                    required
                  />
                </div>

                {/* ROW 2 */}
                <div className="col-md-6 mb-3">
                  <input
                    type="password"
                    placeholder="Password"
                    name="pwd"
                    value={user.pwd}
                    onChange={handleInput}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={user.confirmPassword}
                    onChange={handleInput}
                    className="form-control"
                    required
                  />
                </div>

                {/* ROW 3 */}
                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    placeholder="Phone"
                    name="phone"
                    value={user.phone}
                    onChange={handleInput}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <select
                    name="gender"
                    value={user.gender}
                    onChange={handleInput}
                    className="form-control"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* ROW 4 */}
                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    placeholder="Address"
                    name="address"
                    value={user.address}
                    onChange={handleInput}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <input
                    type="number"
                    placeholder="Staff ID"
                    name="staffid"
                    value={user.staffid}
                    onChange={handleInput}
                    className="form-control"
                    style={{
                      opacity: user.role === "STAFF" ? "1" : "0.4",
                      pointerEvents: user.role === "STAFF" ? "auto" : "none",
                      transition: "all 0.3s ease"
                    }}
                  />
                </div>

                {/* ROW 5 */}
                <div className="col-md-6 mb-3">
                  <select
                    name="courseId"
                    value={user.courseId}
                    onChange={handleInput}
                    className="form-control"
                    style={{
                      opacity: user.role !== "ADMIN" ? "1" : "0.4",
                      pointerEvents: user.role !== "ADMIN" ? "auto" : "none",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <option value="">Select Course</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.coursename}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-4">
                  <select
                    name="role"
                    value={user.role}
                    onChange={handleInput}
                    className="form-control"
                  >
                    <option value="STAFF">STAFF</option>
                    <option value="STUDENT">STUDENT</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

              </div>

              <button type="submit" className="btn btn-success w-100">
                🚀 Create User
              </button>

            </form>
          </div>

        </div>
      </div>

      {showSuccess && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
          }}
        >
          <div
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "20px",
              textAlign: "center",
              animation: "fadeScale 0.3s ease"
            }}
          >
            <h3 className="text-success">✅ User Created!</h3>
          </div>
        </div>
      )}

    </div>
  );
};

export default Register;