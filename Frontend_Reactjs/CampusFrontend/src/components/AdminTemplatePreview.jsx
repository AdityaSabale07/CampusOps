import axios from "../api/axiosConfig";
import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import AdminNav from "./AdminNav";

const AdminTemplatePreview = () => {

  const { id } = useParams();
  const history = useHistory();

  const [template, setTemplate] = useState(null);

  useEffect(() => {
    loadTemplate();
  }, []);

  const loadTemplate = async () => {
    try {
      const resp = await axios.get(`/api/feedback/template/${id}`);
      setTemplate(resp.data);
    } catch {
      toast.error("Failed to load template");
    }
  };

  if (!template) return null;

  const questionCount = template.questions?.length || 0;
  const canSchedule = questionCount >= 5;

  return (
    <div className="container-fluid p-0"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(-45deg,#e3f2fd,#b2dfdb,#e1f5fe,#dcedc8)"
      }}>

      <div className="row g-0">
        <div className="col-md-2">
          <AdminNav />
        </div>

        <div className="col-md-10 p-4">

          <div className="premium-card">

            <h4 className="fw-bold mb-4">📋 Template Preview</h4>

            <h5>{template.name}</h5>

            <p>
              Status:{" "}
              {template.locked
                ? <span className="text-danger locked-animate">🔒 Locked</span>
                : <span className="text-success">Editable</span>}
            </p>

            <p>
              Questions Count:{" "}
              <span className="badge bg-primary">{questionCount}</span>
            </p>

            <hr />

            <ol>
              {template.questions?.map((q) => (
                <li key={q.id} className="mb-2">
                  {q.questionText}
                </li>
              ))}
            </ol>

            {!canSchedule && (
              <div className="alert alert-warning mt-3">
                ⚠ Minimum 5 questions required to schedule feedback
              </div>
            )}

            <div className="mt-4 d-flex gap-3">

              {!template.locked && (
                <button
                  className="btn btn-warning"
                  onClick={() =>
                    history.push(`/admin/template/${id}/questions`)
                  }>
                  ✏ Edit Questions
                </button>
              )}

              <button
                className={`btn ${canSchedule ? "btn-success" : "btn-secondary"}`}
                disabled={!canSchedule}
                onClick={() => history.push("/adminschedulefeedback")}>
                📅 Schedule Feedback
              </button>

            </div>

          </div>

        </div>
      </div>

      <style>
        {`
          .premium-card {
            background: rgba(255,255,255,0.9);
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.08);
          }

          .locked-animate {
            animation: pulseLock 1s ease-in-out;
          }

          @keyframes pulseLock {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}
      </style>

    </div>
  );
};

export default AdminTemplatePreview;
