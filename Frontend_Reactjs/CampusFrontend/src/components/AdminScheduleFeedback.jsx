import axios from "../api/axiosConfig";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminNav from "./AdminNav";

const AdminScheduleFeedback = () => {

  const [templates, setTemplates] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);

  const [form, setForm] = useState({
    templateId: "",
    staffUserid: "",
    courseId: "",
    moduleId: "",
    start: "",
    end: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [t, s, c] = await Promise.all([
        axios.get("/api/feedback/admin/template"),
        axios.get("/api/users/staff"),
        axios.get("/api/courses")
      ]);

      setTemplates(t.data);
      setStaffs(s.data);
      setCourses(c.data);
    } catch {
      toast.error("Failed to load initial data");
    }
  };

  const loadModules = async (courseId) => {
    try {
      const resp = await axios.get("/api/modules");
      const filtered = resp.data.filter(
        (m) => m.course?.id === parseInt(courseId)
      );
      setModules(filtered);
    } catch {
      toast.error("Failed to load modules");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    if (name === "courseId") {
      loadModules(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(form).some((v) => !v)) {
      toast.error("All fields are required");
      return;
    }

    if (form.start > form.end) {
      toast.error("End date must be after start date");
      return;
    }

    try {
      await axios.post("/api/feedback/admin/schedule", null, {
        params: form
      });

      toast.success("Feedback scheduled successfully 🎉");

      setForm({
        templateId: "",
        staffUserid: "",
        courseId: "",
        moduleId: "",
        start: "",
        end: ""
      });

      setModules([]);

    } catch (err) {
      toast.error(err.response?.data || "Scheduling failed");
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
          <AdminNav />
        </div>

        <div className="col-md-10 p-4">

          {/* PREMIUM CARD */}
          <div
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(15px)",
              padding: "30px",
              borderRadius: "20px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.08)"
            }}
          >

            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold m-0">📅 Schedule Feedback</h4>
              <div
                style={{
                  background: "#4caf50",
                  color: "white",
                  padding: "8px 18px",
                  borderRadius: "30px",
                  fontWeight: "600"
                }}
              >
                Admin Action
              </div>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="row">

                {/* TEMPLATE */}
                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Template</label>
                  <select
                    name="templateId"
                    value={form.templateId}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">Select Template</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* STAFF */}
                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Staff</label>
                  <select
                    name="staffUserid"
                    value={form.staffUserid}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">Select Staff</option>
                    {staffs.map((s) => (
                      <option key={s.userid} value={s.userid}>
                        {s.uname}
                      </option>
                    ))}
                  </select>
                </div>

                {/* COURSE */}
                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Course</label>
                  <select
                    name="courseId"
                    value={form.courseId}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">Select Course</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.coursename}
                      </option>
                    ))}
                  </select>
                </div>

                {/* MODULE */}
                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Module</label>
                  <select
                    name="moduleId"
                    value={form.moduleId}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">Select Module</option>
                    {modules.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* START DATE */}
                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Start Date</label>
                  <input
                    type="date"
                    name="start"
                    value={form.start}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                {/* END DATE */}
                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">End Date</label>
                  <input
                    type="date"
                    name="end"
                    value={form.end}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

              </div>

              <button
                type="submit"
                className="btn btn-success w-100 mt-3"
                style={{ borderRadius: "25px" }}
              >
                🚀 Schedule Feedback
              </button>

            </form>

          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminScheduleFeedback;
