import axios from "../api/axiosConfig";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import StudentNav from "./StudentNav";

const StudentEditProfile = () => {

  const history = useHistory();

  const [user, setUser] = useState({
    userid: "",
    email: "",          // ✅ Added
    uname: "",
    phone: "",
    gender: "",
    address: "",
    pwd: "",
    cpwd: ""
  });

  useEffect(() => {
    const userid = localStorage.getItem("userid");

    if (!userid) {
      toast.error("Session expired.");
      history.push("/");
      return;
    }

    loadUser(userid);
  }, []);

  const loadUser = async (userid) => {
    const resp = await axios.get(`/api/users/${userid}`);
    setUser(prev => ({ ...prev, ...resp.data, pwd: "", cpwd: "" }));
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

    const payload = {
      uname: user.uname,
      phone: user.phone,
      gender: user.gender,
      address: user.address
    };

    if (user.pwd) payload.pwd = user.pwd;

    await axios.put(`/api/users/${user.userid}`, payload);

    toast.success("Profile updated!");
    history.push("/studentdashboard");
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

        <div className="col-md-2">
          <StudentNav />
        </div>

        <div className="col-md-10 p-4">

          <div
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(15px)",
              padding: "30px",
              borderRadius: "20px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
              maxWidth: "800px",
              margin: "auto"
            }}
          >
            <h4 className="fw-bold mb-4 text-center">
              ✏ Update Profile
            </h4>

            <form onSubmit={handleSubmit}>

              <div className="row">

                {/* Row 1 */}
                <div className="col-md-6 mb-3">
                  <label>Full Name</label>
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
                  <label>User ID</label>
                  <input
                    type="text"
                    value={user.userid}
                    className="form-control"
                    readOnly
                    style={{ background: "#f1f3f5" }}
                  />
                </div>

                {/* Row 2 */}
                <div className="col-md-6 mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    value={user.email}
                    className="form-control"
                    readOnly
                    style={{ background: "#f1f3f5" }}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Phone</label>
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
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={user.gender}
                    onChange={handleInput}
                    className="form-control"
                    required
                  >
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={user.address}
                    onChange={handleInput}
                    className="form-control"
                    required
                  />
                </div>

                {/* Row 4 */}
                <div className="col-md-6 mb-3">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="pwd"
                    value={user.pwd}
                    onChange={handleInput}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6 mb-4">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="cpwd"
                    value={user.cpwd}
                    onChange={handleInput}
                    className="form-control"
                  />
                </div>

              </div>

              <button className="btn btn-primary w-100">
                Update Profile
              </button>

            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentEditProfile;
