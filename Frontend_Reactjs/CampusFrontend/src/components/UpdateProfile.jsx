import axios from "../api/axiosConfig";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import StaffNav from "./StaffNav";

const UpdateProfile = () => {

  const history = useHistory();

  const [user, setUser] = useState({
    userid: "",
    email: "",
    uname: "",
    phone: "",
    gender: "",
    address: "",
    staffid: "",
    bloodGroup: "",   // ✅ Added for layout balance (UI only)
    pwd: "",
    cpwd: ""
  });

  useEffect(() => {
    const userid = localStorage.getItem("userid");

    if (!userid) {
      toast.error("Session expired. Please login again.");
      history.push("/");
      return;
    }

    loadUser(userid);
  }, []);

  const loadUser = async (userid) => {
    try {
      const resp = await axios.get(`/api/users/${userid}`);
      setUser(prev => ({
        ...prev,
        ...resp.data,
        bloodGroup: "", // not from backend
        pwd: "",
        cpwd: ""
      }));
    } catch {
      toast.error("Failed to load profile");
    }
  };

  const handleInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.pwd && user.pwd !== user.cpwd) {
      toast.error("Passwords do not match");
      return;
    }

    try {

      // 🚫 bloodGroup NOT included intentionally
      const payload = {
        uname: user.uname,
        phone: user.phone,
        gender: user.gender,
        address: user.address,
        staffid: user.staffid,
        email: user.email
      };

      if (user.pwd) payload.pwd = user.pwd;

      await axios.put(`/api/users/${user.userid}`, payload);

      toast.success("Profile updated successfully");
      history.push("/staffdashboard");

    } catch {
      toast.error("Failed to update profile");
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
        `}
      </style>

      <div className="row g-0">

        <div className="col-md-2">
          <StaffNav />
        </div>

        <div className="col-md-10 d-flex justify-content-center p-4">

          <div
            style={{
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(15px)",
              padding: "30px",
              borderRadius: "20px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
              width: "100%",
              maxWidth: "900px"
            }}
          >

            <h4 className="fw-bold text-center mb-4">
              👤 Update Profile
            </h4>

            <form onSubmit={handleSubmit}>

              <div className="row">

                {/* Row 1 */}
                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">User ID</label>
                  <input
                    type="number"
                    value={user.userid}
                    className="form-control"
                    readOnly
                    style={{
                      backgroundColor: "#f1f3f5",
                      cursor: "not-allowed",
                      fontWeight: "500"
                    }}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    className="form-control"
                    readOnly
                    style={{
                      backgroundColor: "#f1f3f5",
                      cursor: "not-allowed",
                      fontWeight: "500"
                    }}
                  />
                </div>

                {/* Row 2 */}
                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Full Name</label>
                  <input
                    type="text"
                    name="uname"
                    value={user.uname}
                    onChange={handleInput}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={user.phone}
                    onChange={handleInput}
                    className="form-control"
                    required
                  />
                </div>

                {/* Row 3 */}
                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Gender</label>
                  <select
                    name="gender"
                    value={user.gender}
                    onChange={handleInput}
                    className="form-control"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Blood Group (Optional)</label>
                  <input
                    type="text"
                    name="bloodGroup"
                    value={user.bloodGroup}
                    onChange={handleInput}
                    placeholder="e.g. O+, A-, B+"
                    className="form-control"
                  />
                </div>

                {/* Row 4 */}
                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={user.address}
                    onChange={handleInput}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Staff ID</label>
                  <input
                    type="number"
                    value={user.staffid}
                    className="form-control"
                    readOnly
                    style={{
                      backgroundColor: "#f1f3f5",
                      cursor: "not-allowed",
                      fontWeight: "500"
                    }}
                  />
                </div>

              </div>

              {/* Password Section */}
              <div className="row mt-3">

                <div className="col-md-6">
                  <input
                    type="password"
                    name="pwd"
                    value={user.pwd}
                    onChange={handleInput}
                    placeholder="New Password (Optional)"
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <input
                    type="password"
                    name="cpwd"
                    value={user.cpwd}
                    onChange={handleInput}
                    placeholder="Confirm Password"
                    className="form-control"
                  />
                </div>

              </div>

              <button
                type="submit"
                className="btn w-100 mt-4"
                style={{
                  background: "linear-gradient(90deg,#4e73df,#1cc88a)",
                  color: "white",
                  borderRadius: "30px",
                  padding: "10px",
                  fontWeight: "600",
                  border: "none"
                }}
              >
                Update Profile
              </button>

            </form>

          </div>

        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
