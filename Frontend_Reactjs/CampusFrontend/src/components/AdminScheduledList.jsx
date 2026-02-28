import axios from "../api/axiosConfig";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import AdminNav from "./AdminNav";

const AdminScheduledList = () => {

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [openAction, setOpenAction] = useState(null);
  const dropdownRef = useRef();
  const history = useHistory();

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
      const resp = await axios.get("/api/feedback/admin/schedules");
      setData(resp.data);
    } catch {
      toast.error("Failed to load schedules");
    }
  };

  const handleClose = async (id) => {
    try {
      await axios.put(`/api/feedback/admin/close/${id}`);
      toast.success("Session closed");
      loadData();
    } catch {
      toast.error("Close failed");
    }
  };

  const handleSend = async (id) => {
    try {
      await axios.put(`/api/feedback/admin/send/${id}`);
      toast.success("Sent to staff");
      loadData();
    } catch {
      toast.error("Send failed");
    }
  };

  const filtered = data.filter((x) =>
    x.staff?.uname?.toLowerCase().includes(search.toLowerCase()) ||
    x.module?.description?.toLowerCase().includes(search.toLowerCase())
  );

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

        .status-badge {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: white;
        }
        `}
      </style>

      <div className="row g-0">

        <div className="col-md-2">
          <AdminNav />
        </div>

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
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="fw-bold m-0">📊 Scheduled Feedback</h4>
              <div
                style={{
                  background: "#4caf50",
                  color: "white",
                  padding: "8px 18px",
                  borderRadius: "30px",
                  fontWeight: "600"
                }}
              >
                Total: {filtered.length}
              </div>
            </div>

            <input
              type="text"
              placeholder="🔍 Search by staff or module..."
              className="form-control mt-4"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ borderRadius: "12px" }}
            />
          </div>

          {/* TABLE */}
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
                  <th>ID</th>
                  <th>Template</th>
                  <th>Staff</th>
                  <th>Course</th>
                  <th>Module</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((x) => (
                  <tr key={x.id}>
                    <td>{x.id}</td>
                    <td>{x.template?.name}</td>
                    <td>{x.staff?.uname}</td>
                    <td>{x.course?.coursename}</td>
                    <td>{x.module?.description}</td>
                    <td>{x.startDate}</td>
                    <td>{x.endDate}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{
                          background:
                            x.status === "OPEN"
                              ? "#4caf50"
                              : x.status === "CLOSED"
                              ? "#ff9800"
                              : "#2196f3"
                        }}
                      >
                        {x.status}
                      </span>
                    </td>

                    <td className="text-center" style={{ position: "relative" }}>
                      <button
                        className="btn btn-light btn-sm"
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
                            width: "180px",
                            boxShadow:
                              "0 15px 35px rgba(0,0,0,0.15)",
                            zIndex: 9999
                          }}
                        >
                          {x.status === "OPEN" && (
                            <button
                              className="btn btn-warning btn-sm w-100 mb-2"
                              onClick={() => handleClose(x.id)}
                            >
                              🔒 Close
                            </button>
                          )}

                          {x.status === "CLOSED" && (
                            <button
                              className="btn btn-primary btn-sm w-100 mb-2"
                              onClick={() => handleSend(x.id)}
                            >
                              📤 Send to Staff
                            </button>
                          )}

                          <button
                            className="btn btn-info btn-sm w-100"
                            onClick={() =>
                              history.push({
                                pathname: `/admin/report/${x.id}`,
                                state: { status: x.status } // ⭐ ADDED ONLY THIS
                              })
                            }
                          >
                            📊 View Report
                          </button>

                        </div>
                      )}
                    </td>

                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center text-muted">
                      No scheduled sessions found
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminScheduledList;
