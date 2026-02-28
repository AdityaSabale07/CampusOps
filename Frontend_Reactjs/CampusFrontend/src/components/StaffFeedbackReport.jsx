import axios from "../api/axiosConfig";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import StaffNav from "./StaffNav";

const StaffFeedbackReport = () => {

  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const resp = await axios.get(
        `/api/feedback/staff/report/final/${id}`
      );
      setReport(resp.data);
    } catch {
      toast.error("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  const getRatingLevel = (avg) => {
    if (avg >= 3.5) return "Excellent";
    if (avg >= 2.5) return "Good";
    if (avg >= 1.5) return "Satisfactory";
    return "Poor";
  };

  const getBadgeColor = (avg) => {
    if (avg >= 3.5) return "bg-success";
    if (avg >= 2.5) return "bg-primary";
    if (avg >= 1.5) return "bg-warning text-dark";
    return "bg-danger";
  };

  // 🔥 Smooth Loading Screen (No Flick)
  if (loading) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg,#eef2f3,#dbe9f4)"
      }}>
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (!report) return null;

  return (
    <div
      className="container-fluid p-0"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#eef2f3,#dbe9f4)"
      }}
    >
      <div className="row g-0">
        <div className="col-md-2">
          <StaffNav />
        </div>

        <div className="col-md-10 p-4">

          <div className="report-card fade-in">

            {/* ===== TEMPLATE TITLE ===== */}
            <div className="report-header">
              <h3 className="fw-bold mb-1">
                {report.templateName}
              </h3>
              <small className="text-muted">
                Feedback Summary Report
              </small>
            </div>

            {/* ===== META INFO ===== */}
            <div className="meta-grid">

              <div><strong>Staff:</strong> {report.staffName}</div>
              <div><strong>Course:</strong> {report.courseName}</div>
              <div><strong>Module:</strong> {report.moduleName}</div>

              <div><strong>Total Responses:</strong> {report.totalFeedback}</div>
              <div>
                <strong>Overall Avg:</strong>{" "}
                {report.finalAverage?.toFixed(2)}
              </div>
              <div>
                <strong>Overall Rating:</strong>{" "}
                <span className={`badge ${getBadgeColor(report.finalAverage)}`}>
                  {getRatingLevel(report.finalAverage)}
                </span>
              </div>

            </div>

            {/* ===== TABLE ===== */}
            <div className="table-responsive">

              <table className="table table-bordered text-center align-middle">

                <thead className="table-light">
                  <tr>
                    <th className="text-start">Question</th>
                    <th>Excellent</th>
                    <th>Good</th>
                    <th>Satisfactory</th>
                    <th>Poor</th>
                    <th>Avg</th>
                    <th>Rating</th>
                  </tr>
                </thead>

                <tbody>

                  {report.questions?.map((q) => (
                    <tr key={q.questionId}>
                      <td className="text-start">
                        {q.questionText}
                      </td>

                      <td>{q.excellent}</td>
                      <td>{q.good}</td>
                      <td>{q.satisfactory}</td>
                      <td>{q.poor}</td>

                      <td>{q.average?.toFixed(2)}</td>

                      <td>
                        <span className={`badge ${getBadgeColor(q.average)}`}>
                          {getRatingLevel(q.average)}
                        </span>
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>

            {/* ===== FOOTER SUMMARY ===== */}
            <div className="overall-box">

              Average Satisfaction Level ={" "}
              <strong>{report.finalAverage?.toFixed(2)}</strong>{" "}
              ({getRatingLevel(report.finalAverage)})

            </div>

          </div>

        </div>
      </div>

      <style>
        {`
          .report-card {
            background: white;
            padding: 25px;
            border-radius: 18px;
            box-shadow: 0 15px 50px rgba(0,0,0,0.08);
          }

          .report-header {
            text-align: center;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }

          .meta-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px 25px;
            margin-bottom: 18px;
            font-size: 14px;
          }

          .overall-box {
            background: #e3f2fd;
            padding: 10px;
            border-radius: 10px;
            text-align: center;
            margin-top: 15px;
            font-weight: 500;
          }

          table {
            font-size: 13px;
          }

          .fade-in {
            animation: fadeIn 0.4s ease-in;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

    </div>
  );
};

export default StaffFeedbackReport;
