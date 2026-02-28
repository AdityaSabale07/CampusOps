import axios from "../api/axiosConfig";
import { useEffect, useState } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import AdminNav from "./AdminNav";

const AdminReportPage = () => {

  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();

  const [report, setReport] = useState(null);

  // ✅ status comes from previous page
  const status = location.state?.status;

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {

      let url = "";

      // 🔥 AUTO SELECT REPORT TYPE
      if (status === "OPEN") {
        url = `/api/feedback/admin/report/intermediate/${id}`;
      } else {
        url = `/api/feedback/admin/report/final/${id}`;
      }

      const resp = await axios.get(url);
      setReport(resp.data);

    } catch (err) {
      toast.error(
        err.response?.data || "Report not available yet"
      );
      history.goBack();
    }
  };

  if (!report) return null;

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
        `}
      </style>

      <div className="row g-0">

        <div className="col-md-2">
          <AdminNav />
        </div>

        <div className="col-md-10 p-4">

          <div
            style={{
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(15px)",
              padding: "30px",
              borderRadius: "20px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.08)"
            }}
          >

            <h4 className="fw-bold mb-4">
              📊 Feedback Report
            </h4>

            {/* REPORT INFO */}
            <div className="mb-4">
              <p><b>Staff:</b> {report.staffName}</p>
              <p><b>Course:</b> {report.courseName}</p>
              <p><b>Module:</b> {report.moduleName}</p>
              <p><b>Template:</b> {report.templateName}</p>
              <p><b>Total Feedback:</b> {report.totalFeedback}</p>
              <p><b>Final Average:</b> {report.finalAverage?.toFixed(2)}</p>
            </div>

            {/* QUESTIONS TABLE */}
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Excellent</th>
                  <th>Good</th>
                  <th>Satisfactory</th>
                  <th>Poor</th>
                  <th>Average</th>
                </tr>
              </thead>

              <tbody>
                {report.questions?.map((q) => (
                  <tr key={q.questionId}>
                    <td>{q.questionText}</td>
                    <td>{q.excellent}</td>
                    <td>{q.good}</td>
                    <td>{q.satisfactory}</td>
                    <td>{q.poor}</td>
                    <td>{q.average?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              className="btn btn-secondary mt-3"
              onClick={() => history.goBack()}
            >
              ⬅ Back
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminReportPage;
