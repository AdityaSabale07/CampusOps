import axios from "../api/axiosConfig";
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import StaffNav from "./StaffNav";

const EditLog = () => {

  const { id } = useParams();
  const history = useHistory();

  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);

  const [product, setProduct] = useState({
    course_id: "",
    module_id: "",
    date: "",
    group_name: "",
    startTime: "",
    endTime: "",
    assignmentGiven: "",
    studentProgress: ""
  });

  useEffect(() => {
    loadLog();
    loadCourses();
    loadModules();
  }, []);

  const loadCourses = async () => {
    try {
      const resp = await axios.get("/api/courses");
      setCourses(resp.data);
    } catch {
      toast.error("Failed to load courses");
    }
  };

  const loadModules = async () => {
    try {
      const resp = await axios.get("/api/modules");
      setModules(resp.data);
    } catch {
      toast.error("Failed to load modules");
    }
  };

  const loadLog = async () => {
    try {
      const resp = await axios.get(`/api/logs/${id}`);
      const log = resp.data;

      setProduct({
        course_id: log.course?.id,
        module_id: log.module?.id,
        date: log.date,
        group_name: log.group_name,
        startTime: log.startTime,
        endTime: log.endTime,
        assignmentGiven: log.assignmentGiven,
        studentProgress: log.studentProgress
      });

    } catch {
      toast.error("Failed to load log");
    }
  };

  const handleInput = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`/api/logs/update/${id}`, product);
      toast.success("Log updated & sent for verification");
      history.push("/logs");
    } catch (err) {
      toast.error(err.response?.data || "Update failed");
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
      <div className="row g-0">

        <div className="col-md-2">
          <StaffNav />
        </div>

        <div className="col-md-10 p-4">

          <div
            style={{
              background: "rgba(255,255,255,0.9)",
              padding: "30px",
              borderRadius: "20px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.1)"
            }}
          >
            <h4 className="fw-bold mb-4">✏ Edit Log Entry</h4>

            <form onSubmit={handleSubmit}>
              <div className="row">

                <div className="col-md-6 mb-3">
                  <label>Course</label>
                  <select
                    name="course_id"
                    value={product.course_id}
                    onChange={handleInput}
                    className="form-control"
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.coursename}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label>Module</label>
                  <select
                    name="module_id"
                    value={product.module_id}
                    onChange={handleInput}
                    className="form-control"
                    required
                  >
                    <option value="">Select Module</option>
                    {modules.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label>Group Name</label>
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
                  <label>Date</label>
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
                  <label>Start Time</label>
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
                  <label>End Time</label>
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
                  <label>Assignment Given</label>
                  <input
                    type="text"
                    name="assignmentGiven"
                    value={product.assignmentGiven}
                    onChange={handleInput}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Student Progress</label>
                  <input
                    type="text"
                    name="studentProgress"
                    value={product.studentProgress}
                    onChange={handleInput}
                    className="form-control"
                  />
                </div>

              </div>

              <button className="btn btn-success w-100">
                Update & Resubmit
              </button>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EditLog;
