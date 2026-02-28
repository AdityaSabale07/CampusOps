import axios from "../api/axiosConfig";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import StaffNav from "./StaffNav";

const LogHours = () => {

  const [course, setCourse] = useState([]);
  const [module, setModule] = useState([]);

  const [product, setProduct] = useState({
    module_id: "",
    course_id: "",
    date: "",
    group_name: "",
    startTime: "",
    endTime: "",
    assignmentGiven: "",
    studentProgress: ""
  });

  const staffId = localStorage.getItem("userid");

  useEffect(() => {
    loadCourses();
    loadModules();
  }, []);

  const loadCourses = async () => {
    try {
      const resp = await axios.get("/api/courses");
      setCourse(resp.data);
    } catch {
      toast.error("Failed to load courses");
    }
  };

  const loadModules = async () => {
    try {
      const resp = await axios.get("/api/modules");
      setModule(resp.data);
    } catch {
      toast.error("Failed to load modules");
    }
  };

  const handleInput = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!staffId) {
      toast.error("Session expired. Please login again.");
      return;
    }

    const payload = {
      ...product,
      staff_id: parseInt(staffId)
    };

    try {
      await axios.post("/api/logs/savelog", payload);
      toast.success("Log saved successfully!");

      setProduct({
        module_id: "",
        course_id: "",
        date: "",
        group_name: "",
        startTime: "",
        endTime: "",
        assignmentGiven: "",
        studentProgress: ""
      });

    } catch {
      toast.error("Failed to save log");
    }
  };

  return (
    <div className="container-fluid p-0"
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
          <StaffNav />
        </div>

        <div className="col-md-10 p-4">

          <div
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(15px)",
              padding: "25px",
              borderRadius: "20px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
              marginBottom: "30px"
            }}
          >
            <h3 className="fw-bold m-0">📝 Add Log Entry</h3>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(15px)",
              padding: "30px",
              borderRadius: "25px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.1)"
            }}
          >

            <form onSubmit={handleSubmit}>
              <div className="row">

                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Course</label>
                  <select
                    name="course_id"
                    value={product.course_id}
                    onChange={handleInput}
                    className="form-control"
                    required
                  >
                    <option value="">Select Course</option>
                    {course.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.coursename}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Module</label>
                  <select
                    name="module_id"
                    value={product.module_id}
                    onChange={handleInput}
                    className="form-control"
                    required
                  >
                    <option value="">Select Module</option>
                    {module.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Group Name</label>
                  <input
                    type="text"
                    name="group_name"
                    value={product.group_name}
                    onChange={handleInput}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={product.date}
                    onChange={handleInput}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={product.startTime}
                    onChange={handleInput}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={product.endTime}
                    onChange={handleInput}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Assignment Given</label>
                  <input
                    type="text"
                    name="assignmentGiven"
                    value={product.assignmentGiven}
                    onChange={handleInput}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6 mb-4">
                  <label className="fw-semibold">Student Progress</label>
                  <input
                    type="text"
                    name="studentProgress"
                    value={product.studentProgress}
                    onChange={handleInput}
                    className="form-control"
                  />
                </div>

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
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                }}
              >
                💾 Save Log
              </button>

            </form>

          </div>

        </div>
      </div>
    </div>
  );
};

export default LogHours;
