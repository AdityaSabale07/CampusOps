import axios from "../api/axiosConfig";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import StudentNav from "./StudentNav";
import { useHistory } from "react-router-dom";

const StudentProfile = () => {

  const history = useHistory();
  const [student, setStudent] = useState(null);

  useEffect(() => {

    const userid = localStorage.getItem("userid");

    if (!userid) {
      toast.error("Session expired. Please login again.");
      return;
    }

    loadStudent(userid);

  }, []);

  const loadStudent = async (userid) => {
    try {
      const resp = await axios.get(`/api/users/${userid}`);
      setStudent(resp.data);
    } catch {
      toast.error("Failed to load profile");
    }
  };

  if (!student) {
    return (
      <div className="text-center mt-5 fw-bold">
        Loading Profile...
      </div>
    );
  }

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
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        `}
      </style>

      <div className="row g-0">

        {/* Sidebar */}
        <div className="col-md-2">
          <StudentNav />
        </div>

        {/* Profile Content */}
        <div className="col-md-10 d-flex justify-content-center align-items-center p-4">

          <div
            style={{
              width: "80%",
              maxWidth: "700px",
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(15px)",
              borderRadius: "25px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
              overflow: "hidden",
              animation: "fadeIn 0.4s ease"
            }}
          >

            {/* Top Gradient Banner */}
            <div
              style={{
                background: "linear-gradient(135deg,#4e73df,#1cc88a)",
                height: "100px"
              }}
            />

            <div className="text-center position-relative px-4 pb-4">

              {/* Profile Avatar */}
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                alt="Profile"
                className="rounded-circle shadow"
                style={{
                  width: "140px",
                  height: "140px",
                  objectFit: "cover",
                  marginTop: "-70px",
                  border: "6px solid white"
                }}
              />

              <h3 className="mt-3 fw-bold">{student.uname}</h3>
              <p className="text-muted mb-4">Student</p>

              <div className="row g-4 text-start px-3">

                {/* Row 1 */}
                <div className="col-md-6">
                  <div className="p-3 rounded-4 bg-light shadow-sm h-100">
                    <h6 className="text-muted mb-1">User ID</h6>
                    <h5>{student.userid}</h5>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-3 rounded-4 bg-light shadow-sm h-100">
                    <h6 className="text-muted mb-1">Email</h6>
                    <h5>{student.email}</h5>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="col-md-6">
                  <div className="p-3 rounded-4 bg-light shadow-sm h-100">
                    <h6 className="text-muted mb-1">Phone</h6>
                    <h5>{student.phone}</h5>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-3 rounded-4 bg-light shadow-sm h-100">
                    <h6 className="text-muted mb-1">Gender</h6>
                    <h5>{student.gender}</h5>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="col-md-6">
                  <div className="p-3 rounded-4 bg-light shadow-sm h-100">
                    <h6 className="text-muted mb-1">Course</h6>
                    <h5>
                      {student.course
                        ? student.course.coursename
                        : "Not Assigned"}
                    </h5>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-3 rounded-4 bg-light shadow-sm h-100">
                    <h6 className="text-muted mb-1">Address</h6>
                    <h5>{student.address}</h5>
                  </div>
                </div>

              </div>

              {/* Button */}
              <div className="mt-4">
                <button
                  onClick={() => history.push("/studenteditprofile")}
                  className="btn btn-primary px-5"
                  style={{
                    borderRadius: "30px",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
                  }}
                >
                  ✏ Edit Profile
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
