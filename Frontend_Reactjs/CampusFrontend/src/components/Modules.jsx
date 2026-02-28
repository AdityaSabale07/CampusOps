import axios from "../api/axiosConfig";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import AdminNav from "./AdminNav";

const Modules = () => {

  const [data, setData] = useState([]);
  const [course, setCourse] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [openAction, setOpenAction] = useState(null);

  const dropdownRef = useRef();

  const [product, setProduct] = useState({
    description: "",
    course_id: "",
    theoryhr: "",
    practicalhr: ""
  });

  useEffect(() => {
    loadModules();
    loadCourses();

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenAction(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, []);

  const loadModules = async () => {
    try {
      const resp = await axios.get("/api/modules");
      setData(resp.data);
    } catch {
      toast.error("Failed to load modules");
    }
  };

  const loadCourses = async () => {
    try {
      const resp = await axios.get("/api/courses");
      setCourse(resp.data);
    } catch {
      toast.error("Failed to load courses");
    }
  };

  const handleInput = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this module?")) return;

    try {
      await axios.delete(`/api/modules/${id}`);
      toast.success("Module deleted");
      loadModules();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/modules", product);
      toast.success("Module added successfully");
      setProduct({
        description: "",
        course_id: "",
        theoryhr: "",
        practicalhr: ""
      });
      loadModules();
    } catch {
      toast.error("Failed to save module");
    }
  };

  // 🔥 SEARCH + COURSE FILTER
  const filteredData = data.filter((x) => {
    const matchSearch =
      x.description?.toLowerCase().includes(search.toLowerCase());

    const matchCourse =
      selectedCourse === "" ||
      x.course?.id === Number(selectedCourse);

    return matchSearch && matchCourse;
  });

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
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        `}
      </style>

      <div className="row g-0">

        <div className="col-md-2">
          <AdminNav />
        </div>

        <div className="col-md-10 p-4">

          {/* HEADER */}
          <div
            style={{
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(15px)",
              padding: "25px 30px",
              borderRadius: "20px",
              marginBottom: "25px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.1)"
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="fw-bold m-0">📚 Module Management</h4>

              <div
                style={{
                  background: "#4caf50",
                  color: "white",
                  padding: "8px 20px",
                  borderRadius: "30px",
                  fontWeight: "600"
                }}
              >
                Total: {filteredData.length}
              </div>
            </div>

            {/* 🔥 SEARCH + FILTER SIDE BY SIDE */}
            <div className="row mt-3">

              <div className="col-md-6">
                <input
                  type="text"
                  placeholder="🔍 Search module..."
                  className="form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ borderRadius: "12px" }}
                />
              </div>

              <div className="col-md-6">
                <select
                  className="form-control"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  style={{ borderRadius: "12px" }}
                >
                  <option value="">📚 All Courses</option>
                  {course.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.coursename}
                    </option>
                  ))}
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
                  boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
                  position: "relative",
                  overflow: "visible"
                }}
              >
                <table className="table align-middle">
                  <thead>
                    <tr className="text-secondary">
                      <th>SR NO</th>
                      <th>Module</th>
                      <th>Course</th>
                      <th>Theory</th>
                      <th>Practical</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredData.map((x, index) => (
                      <tr key={x.id}>
                        <td>{index + 1}</td>
                        <td>{x.description}</td>
                        <td>{x.course?.coursename}</td>
                        <td>{x.theoryhr}</td>
                        <td>{x.practicalhr}</td>

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
                                width: "140px",
                                boxShadow:
                                  "0 15px 35px rgba(0,0,0,0.15)",
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
                        <td colSpan="6" className="text-center text-muted">
                          No modules found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* FORM */}
            <div className="col-md-4">
              <div
                style={{
                  background: "white",
                  padding: "25px",
                  borderRadius: "20px",
                  boxShadow: "0 15px 40px rgba(0,0,0,0.08)"
                }}
              >
                <h5 className="fw-bold mb-3">➕ Add Module</h5>

                <form onSubmit={handleSubmit}>

                  <input
                    type="text"
                    name="description"
                    value={product.description}
                    onChange={handleInput}
                    placeholder="Module Name"
                    className="form-control mb-3"
                    required
                  />

                  <input
                    type="number"
                    name="theoryhr"
                    value={product.theoryhr}
                    onChange={handleInput}
                    placeholder="Theory Hours"
                    className="form-control mb-3"
                    required
                  />

                  <input
                    type="number"
                    name="practicalhr"
                    value={product.practicalhr}
                    onChange={handleInput}
                    placeholder="Practical Hours"
                    className="form-control mb-3"
                    required
                  />

                  <select
                    name="course_id"
                    value={product.course_id}
                    onChange={handleInput}
                    className="form-control mb-3"
                    required
                  >
                    <option value="">Select Course ▼</option>
                    {course.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.coursename}
                      </option>
                    ))}
                  </select>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    style={{ borderRadius: "25px" }}
                  >
                    Save Module
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

export default Modules;
