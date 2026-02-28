import axios from "../api/axiosConfig";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import StaffNav from "./StaffNav";

const RouterLogs = () => {

  const routerId = localStorage.getItem("userid");

  const [data, setData] = useState([]);
  const [remarkBox, setRemarkBox] = useState(null);
  const [remarkText, setRemarkText] = useState("");

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const resp = await axios.get(`/api/logs/router/${routerId}`);
      setData(resp.data);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("You are not authorized as router");
      } else {
        toast.error("Failed to load router logs");
      }
    }
  };

  const verifyLog = async (id) => {
    try {
      await axios.put(`/api/logs/verify/${id}/${routerId}`);
      toast.success("Log Verified Successfully");
      loadLogs();
    } catch (err) {
      toast.error(err.response?.data || "Verification failed");
    }
  };

  const rejectLog = async (id) => {

    if (!remarkText.trim()) {
      toast.error("Please enter rejection reason");
      return;
    }

    try {
      await axios.put(
        `/api/logs/reject/router/${id}/${routerId}`,
        { remark: remarkText }
      );

      toast.success("Log Rejected");
      setRemarkBox(null);
      setRemarkText("");
      loadLogs();

    } catch (err) {
      toast.error(err.response?.data || "Rejection failed");
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

        {/* Sidebar */}
        <div className="col-md-2">
          <StaffNav />
        </div>

        {/* Main */}
        <div className="col-md-10 p-4">

          {/* Header */}
          <div
            style={{
              background: "rgba(255,255,255,0.9)",
              padding: "25px",
              borderRadius: "20px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
              marginBottom: "25px"
            }}
          >
            <h4 className="fw-bold m-0">🧑‍💼 Router Verification Panel</h4>
            <div className="mt-2 text-muted">
              Pending Logs: {data.length}
            </div>
          </div>

          {/* Table */}
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
                  <th>Module</th>
                  <th>Date</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Progress</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {data.map((x, index) => (
                  <tr key={x.id}>
                    <td>{index + 1}</td>
                    <td>{x.staff?.uname}</td>
                    <td>{x.course?.coursename}</td>
                    <td>{x.module?.description}</td>
                    <td>{x.date}</td>
                    <td>{x.startTime}</td>
                    <td>{x.endTime}</td>
                    <td>{x.studentProgress}</td>

                    <td className="text-center">

                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => verifyLog(x.id)}
                      >
                        ✔ Verify
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setRemarkBox(x.id)}
                      >
                        ✖ Reject
                      </button>

                      {/* Remark Popup */}
                      {remarkBox === x.id && (
                        <div
                          style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            background: "white",
                            padding: "25px",
                            borderRadius: "15px",
                            width: "350px",
                            boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
                            zIndex: 9999
                          }}
                        >
                          <h6 className="mb-3">Rejection Reason</h6>

                          <textarea
                            className="form-control mb-3"
                            rows="4"
                            value={remarkText}
                            onChange={(e) =>
                              setRemarkText(e.target.value)
                            }
                          />

                          <button
                            className="btn btn-danger w-100 mb-2"
                            onClick={() => rejectLog(x.id)}
                          >
                            Confirm Reject
                          </button>

                          <button
                            className="btn btn-secondary w-100"
                            onClick={() => {
                              setRemarkBox(null);
                              setRemarkText("");
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      )}

                    </td>
                  </tr>
                ))}

                {data.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center text-muted">
                      No pending logs
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

export default RouterLogs;
