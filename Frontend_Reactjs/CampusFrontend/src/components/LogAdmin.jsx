import axios from "../api/axiosConfig";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AdminNav from "./AdminNav";

const LogAdmin = () => {

  const adminId = localStorage.getItem("userid");

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedLog, setSelectedLog] = useState(null);
  const [remarkBox, setRemarkBox] = useState(null);
  const [remarkText, setRemarkText] = useState("");

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const resp = await axios.get("/api/logs");
      setData(resp.data);
    } catch {
      toast.error("Failed to load logs");
    }
  };

  const approve = async (id) => {
    try {
      await axios.put(`/api/logs/approve/${id}/${adminId}`);
      toast.success("Approved Successfully");
      loadLogs();
    } catch (err) {
      toast.error(err.response?.data || "Approve failed");
    }
  };

  const reject = async (id) => {
    if (!remarkText.trim()) {
      toast.error("Remark required");
      return;
    }

    try {
      await axios.put(
        `/api/logs/reject/admin/${id}/${adminId}`,
        { remark: remarkText }
      );
      toast.success("Rejected Successfully");
      setRemarkBox(null);
      setRemarkText("");
      loadLogs();
    } catch (err) {
      toast.error(err.response?.data || "Reject failed");
    }
  };

  // ================= FILTER + SEARCH =================

  const filteredLogs = data
    .filter((x) =>
      statusFilter === "ALL" ? true : x.status === statusFilter
    )
    .filter((x) =>
      x.staff?.uname?.toLowerCase().includes(search.toLowerCase()) ||
      x.course?.coursename?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <>
      {/* ===== BLUR BACKGROUND ===== */}
      <div
        style={{
          filter: selectedLog ? "blur(6px)" : "none",
          pointerEvents: selectedLog ? "none" : "auto",
          transition: "0.3s ease"
        }}
      >
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

              {/* ===== HEADER ===== */}
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
                  <h4 className="fw-bold m-0">📊 Admin Log Dashboard</h4>

                  {/* TOTAL COUNT */}
                  <div
                    style={{
                      background: "linear-gradient(135deg,#4e73df,#224abe)",
                      color: "white",
                      padding: "8px 20px",
                      borderRadius: "30px",
                      fontWeight: "600",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
                    }}
                  >
                    Total: {filteredLogs.length}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-2">
                    <input
                      type="text"
                      placeholder="🔍 Search by staff or course..."
                      className="form-control"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6 d-flex gap-2 flex-wrap">
                    {["ALL", "PENDING", "VERIFIED", "APPROVED", "REJECTED"].map(
                      (type) => (
                        <button
                          key={type}
                          onClick={() => setStatusFilter(type)}
                          className={`btn btn-sm ${
                            statusFilter === type
                              ? "btn-primary"
                              : "btn-outline-secondary"
                          }`}
                        >
                          {type}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* ===== TABLE ===== */}
              <div
                style={{
                  background: "white",
                  padding: "25px",
                  borderRadius: "20px",
                  boxShadow: "0 15px 40px rgba(0,0,0,0.08)"
                }}
              >
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Staff</th>
                      <th>Course</th>
                      <th>Date</th>
                      <th>View Data</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredLogs.map((x, index) => (
                      <tr key={x.id}>
                        <td>{index + 1}</td>
                        <td>{x.staff?.uname}</td>
                        <td>{x.course?.coursename}</td>
                        <td>{x.date}</td>

                        {/* VIEW BUTTON */}
                        <td>
                          <button
                            onClick={() => setSelectedLog(x)}
                            style={{
                              background:
                                "linear-gradient(135deg,#ff9966,#ff5e62)",
                              border: "none",
                              color: "white",
                              padding: "6px 18px",
                              borderRadius: "30px",
                              fontSize: "13px",
                              fontWeight: "600",
                              boxShadow:
                                "0 10px 25px rgba(0,0,0,0.15)"
                            }}
                          >
                            📄 Details
                          </button>
                        </td>

                        {/* STATUS */}
                        <td>
                          <span className={`badge ${
                            x.status === "APPROVED"
                              ? "bg-success"
                              : x.status === "REJECTED"
                              ? "bg-danger"
                              : x.status === "VERIFIED"
                              ? "bg-info"
                              : "bg-warning text-dark"
                          }`}>
                            {x.status}
                          </span>
                        </td>

                        {/* ACTION */}
                        <td style={{ position: "relative" }}>
                          {x.status === "VERIFIED" && (
                            <>
                              <button
                                className="btn btn-success btn-sm me-2"
                                onClick={() => approve(x.id)}
                              >
                                Approve
                              </button>

                              <button
                                className="btn btn-warning btn-sm"
                                onClick={() => setRemarkBox(x.id)}
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {remarkBox === x.id && (
                            <div
                              style={{
                                position: "absolute",
                                top: "40px",
                                right: 0,
                                background: "white",
                                padding: "15px",
                                borderRadius: "15px",
                                width: "260px",
                                boxShadow:
                                  "0 20px 40px rgba(0,0,0,0.2)",
                                zIndex: 999
                              }}
                            >
                              <textarea
                                className="form-control mb-2"
                                rows="3"
                                placeholder="Enter rejection reason..."
                                value={remarkText}
                                onChange={(e) =>
                                  setRemarkText(e.target.value)
                                }
                              />

                              <button
                                className="btn btn-danger btn-sm w-100"
                                onClick={() => reject(x.id)}
                              >
                                Confirm Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}

                    {filteredLogs.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center text-muted">
                          No logs found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ===== PREMIUM POPUP ===== */}
      {selectedLog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
          }}
        >
          <div
            style={{
              background: "linear-gradient(145deg,#ffffff,#f5f7fa)",
              padding: "35px",
              borderRadius: "25px",
              width: "700px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
              position: "relative"
            }}
          >
            <button
              onClick={() => setSelectedLog(null)}
              style={{
                position: "absolute",
                top: "20px",
                right: "25px",
                border: "none",
                background: "none",
                fontSize: "22px",
                cursor: "pointer"
              }}
            >
              ✖
            </button>

            <h4 className="fw-bold mb-4">📄 Log Full Details</h4>

            <div className="row">
              <div className="col-md-6 mb-2"><b>Staff:</b> {selectedLog.staff?.uname}</div>
              <div className="col-md-6 mb-2"><b>Course:</b> {selectedLog.course?.coursename}</div>
              <div className="col-md-6 mb-2"><b>Module:</b> {selectedLog.module?.description}</div>
              <div className="col-md-6 mb-2"><b>Group:</b> {selectedLog.group_name}</div>
              <div className="col-md-6 mb-2"><b>Date:</b> {selectedLog.date}</div>
              <div className="col-md-6 mb-2"><b>Start:</b> {selectedLog.startTime}</div>
              <div className="col-md-6 mb-2"><b>End:</b> {selectedLog.endTime}</div>
              <div className="col-md-12 mb-2"><b>Student Progress:</b> {selectedLog.studentProgress}</div>
              <div className="col-md-12 mb-2"><b>Assignment Given:</b> {selectedLog.assignmentGiven}</div>
              <div className="col-md-12"><b>Status:</b> {selectedLog.status}</div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default LogAdmin;
