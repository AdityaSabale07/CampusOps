import axios from "../api/axiosConfig";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import AdminNav from "./AdminNav";

const Tasks = () => {

  const [data, setData] = useState([]);
  const [course, setCourse] = useState([]);
  const [module, setModule] = useState([]);
  const [staff, setStaff] = useState([]);

  const [search, setSearch] = useState("");
  const [openAction, setOpenAction] = useState(null);

  const dropdownRef = useRef();

  const [product, setProduct] = useState({
    course_id: "",
    module_id: "",
    staff_id: "",
    startDate: "",
    endDate: ""
  });

  // ================= LOAD =================
  useEffect(() => {

    loadTasks();
    axios.get("/api/courses").then(resp => setCourse(resp.data));
    axios.get("/api/users/staff").then(resp => setStaff(resp.data));

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenAction(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, []);

  const loadTasks = async () => {
    try {
      const resp = await axios.get("/api/tasks");
      setData(resp.data);
    } catch {
      toast.error("Failed to load tasks");
    }
  };

  // ================= INPUT =================
  const handleInput = async (e) => {

    const { name, value } = e.target;

    setProduct({ ...product, [name]: value });

    // 🔥 Load modules according to selected course
    if (name === "course_id") {

      if (!value) {
        setModule([]);
        return;
      }

      try {
        const resp = await axios.get(`/api/modules/course/${value}`);
        setModule(resp.data);

        // reset module selection
        setProduct(prev => ({
          ...prev,
          course_id: value,
          module_id: ""
        }));

      } catch {
        toast.error("Failed to load modules");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await axios.delete(`/api/tasks/${id}`);
      toast.success("Task deleted");
      loadTasks();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/tasks/validate", product);
      toast.success("Task saved");

      setProduct({
        course_id: "",
        module_id: "",
        staff_id: "",
        startDate: "",
        endDate: ""
      });

      setModule([]); // 🔥 clear modules after save

      loadTasks();
    } catch {
      toast.error("Failed to save task");
    }
  };

  // 🔍 Search Filter
  const filteredData = data.filter((x) =>
    x.course?.coursename.toLowerCase().includes(search.toLowerCase()) ||
    x.module?.description.toLowerCase().includes(search.toLowerCase()) ||
    x.staff?.uname.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="container-fluid p-0"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(-45deg,#e3f2fd,#b2dfdb,#e1f5fe,#dcedc8)",
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
          <AdminNav />
        </div>

        {/* Main */}
        <div className="col-md-10 p-4">

          {/* HEADER CARD */}
          <div
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(15px)",
              padding: "25px",
              borderRadius: "20px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
              marginBottom: "20px"
            }}
          >

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold m-0">📌 Task Management</h4>

              <div
                style={{
                  background: "#1cc88a",
                  color: "white",
                  padding: "8px 18px",
                  borderRadius: "30px",
                  fontWeight: "600"
                }}
              >
                Total: {filteredData.length}
              </div>
            </div>

            <input
              type="text"
              placeholder="🔍 Search by course, module or staff..."
              className="form-control mb-4"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ borderRadius: "12px" }}
            />
          </div>

          <div className="row">

            {/* TABLE */}
            <div className="col-md-8">
              <div
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "20px",
                  boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
                  overflow: "visible",
                  position: "relative"
                }}
              >
                <table className="table align-middle">
                  <thead>
                    <tr className="text-secondary">
                      <th>SR NO</th>
                      <th>Course</th>
                      <th>Module</th>
                      <th>Staff</th>
                      <th>Start</th>
                      <th>End</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredData.map((x, index) => (
                      <tr key={x.id}>
                        <td>{index + 1}</td>
                        <td>{x.course?.coursename}</td>
                        <td>{x.module?.description}</td>
                        <td>{x.staff?.uname}</td>
                        <td>{x.startDate}</td>
                        <td>{x.endDate}</td>

                        <td className="text-center" style={{ position: "relative" }}>
                          <button
                            className="btn btn-light btn-sm shadow-sm"
                            onClick={() =>
                              setOpenAction(openAction === x.id ? null : x.id)
                            }
                          >
                            ⋮
                          </button>

                          {openAction === x.id && (
                            <div
                              ref={dropdownRef}
                              style={{
                                position: "absolute",
                                right: "10px",
                                top: "35px",
                                background: "white",
                                padding: "12px",
                                borderRadius: "12px",
                                width: "130px",
                                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                                zIndex: 9999,
                                animation: "fadeIn 0.2s ease"
                              }}
                            >
                              <button
                                className="btn btn-danger btn-sm w-100"
                                onClick={() => handleDelete(x.id)}
                              >
                                🗑 Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}

                    {filteredData.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center text-muted">
                          No tasks found
                        </td>
                      </tr>
                    )}

                  </tbody>
                </table>
              </div>
            </div>

            {/* ADD TASK FORM */}
            <div className="col-md-4">
              <div
                style={{
                  background: "white",
                  padding: "25px",
                  borderRadius: "20px",
                  boxShadow: "0 15px 40px rgba(0,0,0,0.08)"
                }}
              >
                <h5 className="fw-bold mb-3">➕ Add Task</h5>

                <form onSubmit={handleSubmit}>

                  <select
                    name="course_id"
                    value={product.course_id}
                    onChange={handleInput}
                    className="form-control mb-3"
                    required
                  >
                    <option value="">Select Course</option>
                    {course.map(x => (
                      <option key={x.id} value={x.id}>
                        {x.coursename}
                      </option>
                    ))}
                  </select>

                  <select
                    name="module_id"
                    value={product.module_id}
                    onChange={handleInput}
                    className="form-control mb-3"
                    required
                  >
                    <option value="">Select Module</option>
                    {module.map(x => (
                      <option key={x.id} value={x.id}>
                        {x.description}
                      </option>
                    ))}
                  </select>

                  <select
                    name="staff_id"
                    value={product.staff_id}
                    onChange={handleInput}
                    className="form-control mb-3"
                    required
                  >
                    <option value="">Select Staff</option>
                    {staff.map(x => (
                      <option key={x.userid} value={x.userid}>
                        {x.uname}
                      </option>
                    ))}
                  </select>

                  <input
                    type="date"
                    name="startDate"
                    value={product.startDate}
                    onChange={handleInput}
                    className="form-control mb-3"
                    required
                  />

                  <input
                    type="date"
                    name="endDate"
                    value={product.endDate}
                    onChange={handleInput}
                    className="form-control mb-3"
                    required
                  />

                  <button className="btn btn-success w-100">
                    Save Task
                  </button>

                </form>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Tasks;
