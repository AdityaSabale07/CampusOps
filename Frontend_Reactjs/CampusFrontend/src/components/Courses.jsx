import axios from "../api/axiosConfig";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import AdminNav from "./AdminNav";

const Courses = () => {

  const [data, setData] = useState([]);
  const [course, setCourse] = useState("");
  const [courseType, setCourseType] = useState("FULL_TIME");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [openAction, setOpenAction] = useState(null);

  const dropdownRef = useRef();

  useEffect(() => {
    loadData();

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenAction(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, []);

  const loadData = async () => {
    try {
      const resp = await axios.get("/api/courses");
      setData(resp.data);
    } catch {
      toast.error("Failed to load courses");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;

    try {
      await axios.delete(`/api/courses/${id}`);
      toast.success("Course deleted");
      loadData();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!course.trim()) {
      toast.error("Enter course name");
      return;
    }

    try {
      await axios.post("/api/courses", {
        coursename: course,
        courseType: courseType
      });

      toast.success("Course added");

      setCourse("");
      setCourseType("FULL_TIME");
      loadData();

    } catch {
      toast.error("Failed to add course");
    }
  };

  // ================= FILTER =================

  const filteredData = data
    .filter(x =>
      x.coursename?.toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter(x =>
      filterType === "ALL"
        ? true
        : x.courseType === filterType
    );

  // ================= BADGE =================

  const typeBadge = (type) => {

    if (type === "MODULAR")
      return "badge bg-success";

    return "badge bg-primary";
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
          <AdminNav />
        </div>

        <div className="col-md-10 p-4">

          {/* HEADER */}
          <div
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(15px)",
              padding: "25px",
              borderRadius: "20px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
              marginBottom: "15px"
            }}
          >

            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold m-0">📚 Course Management</h4>

              <div
                style={{
                  background: "#4caf50",
                  color: "white",
                  padding: "8px 18px",
                  borderRadius: "30px",
                  fontWeight: "600"
                }}
              >
                Total: {filteredData.length}
              </div>
            </div>

            <div className="row">

              <div className="col-md-8">
                <input
                  type="text"
                  placeholder="🔍 Search course..."
                  className="form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ borderRadius: "12px" }}
                />
              </div>

              <div className="col-md-4">
                <select
                  className="form-control"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  style={{ borderRadius: "12px" }}
                >
                  <option value="ALL">All Courses</option>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="MODULAR">Modular</option>
                </select>
              </div>

            </div>

          </div>

          <div className="row">

            {/* TABLE */}
            <div className="col-md-8">

              <div
                style={{
                  background: "rgba(255,255,255,0.85)",
                  backdropFilter: "blur(15px)",
                  padding: "25px",
                  borderRadius: "20px",
                  boxShadow: "0 15px 40px rgba(0,0,0,0.08)"
                }}
              >

                <table className="table align-middle">

                  <thead>
                    <tr className="text-secondary">
                      <th>SR NO</th>
                      <th>Course Name</th>
                      <th>Type</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredData.map((x, index) => (
                      <tr key={x.id}>
                        <td>{index + 1}</td>
                        <td>{x.coursename}</td>

                        <td>
                          <span className={typeBadge(x.courseType)}>
                            {x.courseType}
                          </span>
                        </td>

                        <td className="text-center">
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(x.id)}
                          >
                            🗑 Delete
                          </button>
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>

              </div>
            </div>

            {/* ADD COURSE */}
            <div className="col-md-4">

              <div
                style={{
                  background: "white",
                  padding: "25px",
                  borderRadius: "20px",
                  boxShadow: "0 15px 40px rgba(0,0,0,0.08)"
                }}
              >

                <h5 className="fw-bold mb-3">➕ Add Course</h5>

                <form onSubmit={handleSubmit}>

                  <input
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="form-control mb-3"
                    placeholder="Enter course name"
                  />

                  {/* COURSE TYPE */}
                  <select
                    className="form-control mb-3"
                    value={courseType}
                    onChange={(e) =>
                      setCourseType(e.target.value)}
                  >
                    <option value="FULL_TIME">FULL TIME</option>
                    <option value="MODULAR">MODULAR</option>
                  </select>

                  <button className="btn btn-primary w-100">
                    Save Course
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

export default Courses;