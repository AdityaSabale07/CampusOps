import axios from "../api/axiosConfig";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import StaffNav from "./StaffNav";
import { useHistory } from "react-router-dom";

const Logs = () => {

  const history = useHistory();
  const userId = localStorage.getItem("userid");

  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [openAction, setOpenAction] = useState(null);
  const [viewData, setViewData] = useState(null);

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
      const resp = await axios.get(`/api/logs/staff/${userId}`);
      setData(resp.data);
    } catch {
      toast.error("Failed to load logs.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this log?")) return;

    try {
      await axios.delete(`/api/logs/${id}`);
      toast.success("Log deleted successfully!");
      loadData();
    } catch (err) {
      toast.error(err.response?.data || "Delete failed.");
    }
  };

  const filteredLogs = data
    .filter((x) => filter === "ALL" ? true : x.status === filter)
    .filter((x) =>
      x.course?.coursename?.toLowerCase().includes(search.toLowerCase())
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

        .blur-bg {
          filter: blur(6px);
          pointer-events: none;
          user-select: none;
        }

        .premium-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          width: 750px;
          max-width: 95%;
          border-radius: 25px;
          padding: 35px;
          box-shadow: 0 30px 70px rgba(0,0,0,0.25);
          z-index: 9999;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -60%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }
        `}
      </style>

      <div className="row g-0">

        <div className="col-md-2">
          <StaffNav />
        </div>

        <div className={`col-md-10 p-4 ${viewData ? "blur-bg" : ""}`}>

          {/* ===== HEADER CARD ===== */}
          <div
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(15px)",
              padding: "30px",
              borderRadius: "25px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
              marginBottom: "30px"
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold m-0">📋 My Logs</h3>
              <div className="badge bg-primary px-4 py-2 fs-6">
                Total: {filteredLogs.length}
              </div>
            </div>

            {/* SEARCH + FILTER */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  placeholder="🔍 Search by course..."
                  className="form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ borderRadius: "12px" }}
                />
              </div>

              <div className="col-md-6 d-flex gap-2 flex-wrap">
                {["ALL", "PENDING", "VERIFIED", "APPROVED", "REJECTED"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`btn btn-sm ${
                      filter === type
                        ? "btn-primary"
                        : "btn-outline-secondary"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ===== TABLE CARD ===== */}
          <div
            style={{
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(15px)",
              padding: "30px",
              borderRadius: "25px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
              overflowX: "auto"
            }}
          >
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Course</th>
                  <th>Module</th>
                  <th>Date</th>
                  <th>View</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredLogs.map((x, index) => (
                  <tr key={x.id}>
                    <td>{index + 1}</td>
                    <td>{x.course?.coursename}</td>
                    <td>{x.module?.description}</td>
                    <td>{x.date}</td>

                    <td>
                      <button
                        className="btn btn-dark btn-sm"
                        onClick={() => setViewData(x)}
                      >
                        View
                      </button>
                    </td>

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

                      {x.status === "REJECTED" && (
                        <div className="small text-danger mt-1">
                          Reason: {x.adminRemark || x.routerRemark}
                        </div>
                      )}
                    </td>

                    <td style={{ position: "relative" }}>
                      {(x.status === "PENDING" || x.status === "REJECTED") && (
                        <>
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
                                right: 0,
                                top: "35px",
                                background: "white",
                                padding: "15px",
                                borderRadius: "15px",
                                width: "180px",
                                boxShadow: "0 15px 35px rgba(0,0,0,0.15)"
                              }}
                            >
                              {x.status === "REJECTED" && (
                                <button
                                  className="btn btn-primary btn-sm w-100 mb-2"
                                  onClick={() =>
                                    history.push(`/editlog/${x.id}`)
                                  }
                                >
                                  ✏ Edit & Resubmit
                                </button>
                              )}

                              <button
                                className="btn btn-danger btn-sm w-100"
                                onClick={() => handleDelete(x.id)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </>
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

      {/* ===== POPUP ===== */}
      {viewData && (
        <div className="premium-modal">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold">📑 Log Details</h4>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => setViewData(null)}
            >
              ✖
            </button>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3"><b>Course:</b> {viewData.course?.coursename}</div>
            <div className="col-md-6 mb-3"><b>Module:</b> {viewData.module?.description}</div>
            <div className="col-md-6 mb-3"><b>Group:</b> {viewData.group_name}</div>
            <div className="col-md-6 mb-3"><b>Date:</b> {viewData.date}</div>
            <div className="col-md-6 mb-3"><b>Start Time:</b> {viewData.startTime}</div>
            <div className="col-md-6 mb-3"><b>End Time:</b> {viewData.endTime}</div>
            <div className="col-md-12 mb-3"><b>Student Progress:</b> {viewData.studentProgress}</div>
            <div className="col-md-12 mb-3"><b>Assignment Given:</b> {viewData.assignmentGiven}</div>
            <div className="col-md-12"><b>Status:</b> {viewData.status}</div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Logs;
