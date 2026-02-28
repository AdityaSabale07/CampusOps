import axios from "../api/axiosConfig";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import StaffNav from "./StaffNav";

const StaffFeedbackList = () => {

  const [feedbacks, setFeedbacks] = useState([]);
  const history = useHistory();
  const staffId = localStorage.getItem("userid");

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const resp = await axios.get(
        `/api/feedback/staff/${staffId}`
      );
      setFeedbacks(resp.data);
    } catch {
      toast.error("Failed to load feedback");
    }
  };

  return (
    <div
      className="container-fluid p-0"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(-45deg,#e3f2fd,#b2dfdb,#e1f5fe,#dcedc8)"
      }}
    >

      <div className="row g-0">

        <div className="col-md-2">
          <StaffNav />
        </div>

        <div className="col-md-10 p-4">

          <div className="premium-card">

            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="m-0">📊 My Feedback Reports</h4>
              <span className="badge bg-success fs-6">
                Total: {feedbacks.length}
              </span>
            </div>

            {feedbacks.length === 0 ? (
              <p className="text-muted">
                No feedback reports available yet.
              </p>
            ) : (

              <div className="table-responsive" style={{ maxHeight: "65vh", overflowY: "auto" }}>

                <table className="table align-middle table-hover">

                  <thead className="table-light sticky-top">
                    <tr>
                      <th>#</th>
                      <th>Template</th>
                      <th>Course</th>
                      <th>Module</th>
                      <th>Status</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {feedbacks.map((f, index) => (
                      <tr key={f.id}>

                        <td>{index + 1}</td>

                        <td>
                          <strong>{f.template?.name}</strong>
                        </td>

                        <td>{f.course?.coursename}</td>

                        <td>{f.module?.description}</td>

                        <td>
                          <span className="badge bg-primary">
                            {f.status}
                          </span>
                        </td>

                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                             history.push(`/stafffeedback/report/${f.id}`)

                            }
                          >
                            View
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>
      </div>

      <style>
        {`
          .premium-card {
            background: rgba(255,255,255,0.95);
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.08);
          }

          table {
            font-size: 14px;
          }

          .table-hover tbody tr:hover {
            background: #f1f8ff;
          }
        `}
      </style>

    </div>
  );
};

export default StaffFeedbackList;
