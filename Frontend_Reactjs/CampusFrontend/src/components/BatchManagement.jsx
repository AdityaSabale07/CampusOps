import axios from "../api/axiosConfig";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import AdminNav from "./AdminNav";

const BatchManagement = () => {

  const [data, setData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [openAction, setOpenAction] = useState(null);

  const dropdownRef = useRef();

  const [form, setForm] = useState({
    batchName: "",
    timing: "MORNING",
    mode: "ONLINE",
    capacity: "",
    fee: "",
    courseId: ""
  });

  // ================= LOAD =================

  useEffect(() => {

    loadData();
    loadCourses();

    const handleClickOutside = (e) => {
      if (dropdownRef.current &&
        !dropdownRef.current.contains(e.target)) {
        setOpenAction(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);

  }, []);

  const loadData = async () => {
    try {
      const resp = await axios.get("/api/batches");
      setData(resp.data);
    } catch {
      toast.error("Failed to load batches");
    }
  };

  const loadCourses = async () => {
    try {
      const resp = await axios.get("/api/courses/modular");
      setCourses(resp.data);
    } catch {
      toast.error("Failed to load modular courses");
    }
  };

  // ================= DELETE =================

  const handleDelete = async (id) => {
    if (!window.confirm("Delete batch?")) return;

    try {
      await axios.delete(`/api/batches/${id}`);
      toast.success("Batch deleted");
      loadData();
    } catch {
      toast.error("Delete failed");
    }
  };

  // ================= SAVE =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const payload = {
        batchName: form.batchName,
        timing: form.timing,
        mode: form.mode,
        capacity: Number(form.capacity),
        fee: Number(form.fee),
        course: { id: form.courseId }
      };

      await axios.post("/api/batches", payload);

      toast.success("Batch added");

      setForm({
        batchName: "",
        timing: "MORNING",
        mode: "ONLINE",
        capacity: "",
        fee: "",
        courseId: ""
      });

      loadData();

    } catch {
      toast.error("Failed to add batch");
    }
  };

  // ================= FILTER =================

  const filtered = data.filter(x =>
    x.batchName?.toLowerCase()
      .includes(search.toLowerCase())
  );

  // ================= PROGRESS COLOR =================

  const progressColor = (percent) => {
    if (percent < 60) return "bg-success";
    if (percent < 90) return "bg-warning";
    return "bg-danger";
  };

  // ================= UI =================

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
          <AdminNav />
        </div>

        <div className="col-md-10 p-4">

          {/* HEADER */}
          <div style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(15px)",
            padding: "25px",
            borderRadius: "20px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
            marginBottom: "15px"
          }}>

            <div className="d-flex justify-content-between mb-3">
              <h4 className="fw-bold m-0">🕒 Batch Management</h4>

              <div style={{
                background: "#2196f3",
                color: "white",
                padding: "8px 18px",
                borderRadius: "30px",
                fontWeight: "600"
              }}>
                Total: {filtered.length}
              </div>
            </div>

            <input
              className="form-control"
              placeholder="🔎 Search batch..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

          </div>

          {/* TABLE + FORM */}

          <div className="row">

            <div className="col-md-8">

              <div className="card p-3 shadow border-0 rounded-4">

                <table className="table align-middle">

                  <thead>
                    <tr>
                      <th>SR</th>
                      <th>Batch</th>
                      <th>Course</th>
                      <th>Timing</th>
                      <th>Mode</th>
                      <th>Seats</th>
                      <th>Progress</th>
                      <th>Fee</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>

                    {filtered.map((x, i) => {

                      // ⭐ FIXED FILLED SEATS LOGIC
                      const filled =
                        x.filledSeats ||
                        x.registeredCount ||
                        x.totalRegistrations ||
                        x.registrations?.length ||
                        0;

                      const percent =
                        x.capacity
                          ? Math.round(
                              Math.min(
                                (filled / x.capacity) * 100,
                                100
                              )
                            )
                          : 0;

                      return (
                        <tr key={x.id}>

                          <td>{i + 1}</td>
                          <td>{x.batchName}</td>
                          <td>{x.course?.coursename}</td>
                          <td>{x.timing}</td>
                          <td>{x.mode}</td>

                          <td>
                            {filled}/{x.capacity}
                          </td>

                          {/* ⭐ PROGRESS BAR */}
                          <td style={{ width: "180px" }}>
                            <div className="progress"
                              style={{ height: "10px" }}>
                              <div
                                className={`progress-bar ${progressColor(percent)}`}
                                style={{
                                  width: `${percent}%`
                                }}
                              />
                            </div>
                          </td>

                          <td>₹ {x.fee}</td>

                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                handleDelete(x.id)}
                            >
                              🗑
                            </button>
                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>
            </div>

            {/* FORM */}
            <div className="col-md-4">

              <div className="card p-3 shadow border-0 rounded-4">

                <h5>➕ Add Batch</h5>

                <form onSubmit={handleSubmit}>

                  <input
                    className="form-control mb-2"
                    placeholder="Batch name"
                    value={form.batchName}
                    onChange={e =>
                      setForm({
                        ...form,
                        batchName: e.target.value
                      })
                    }
                  />

                  <select
                    className="form-control mb-2"
                    value={form.courseId}
                    onChange={e =>
                      setForm({
                        ...form,
                        courseId: e.target.value
                      })
                    }
                  >
                    <option value="">Select Course</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.coursename}
                      </option>
                    ))}
                  </select>

                  <select
                    className="form-control mb-2"
                    value={form.timing}
                    onChange={e =>
                      setForm({
                        ...form,
                        timing: e.target.value
                      })
                    }
                  >
                    <option>MORNING</option>
                    <option>AFTERNOON</option>
                    <option>EVENING</option>
                  </select>

                  <select
                    className="form-control mb-2"
                    value={form.mode}
                    onChange={e =>
                      setForm({
                        ...form,
                        mode: e.target.value
                      })
                    }
                  >
                    <option>ONLINE</option>
                    <option>OFFLINE</option>
                  </select>

                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Capacity"
                    value={form.capacity}
                    onChange={e =>
                      setForm({
                        ...form,
                        capacity: e.target.value
                      })
                    }
                  />

                  <input
                    type="number"
                    className="form-control mb-3"
                    placeholder="Fee"
                    value={form.fee}
                    onChange={e =>
                      setForm({
                        ...form,
                        fee: e.target.value
                      })
                    }
                  />

                  <button className="btn btn-primary w-100">
                    Save Batch
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

export default BatchManagement;