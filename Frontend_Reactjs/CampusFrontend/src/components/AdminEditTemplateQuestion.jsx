import axios from "../api/axiosConfig";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AdminNav from "./AdminNav";

const AdminEditTemplateQuestions = () => {

  const { id } = useParams();

  const [template, setTemplate] = useState(null);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    loadTemplate();
  }, []);

  const loadTemplate = async () => {
    try {
      const resp = await axios.get(
        `/api/feedback/template/${id}`
      );
      setTemplate(resp.data);
      setQuestions(resp.data?.questions || []);
    } catch {
      toast.error("Failed to load template");
    }
  };

  const handleChange = (index, value) => {
    const updated = [...questions];
    updated[index].questionText = value;
    setQuestions(updated);
  };

  // ✅ UPDATE QUESTION (FIXED URL)
  const handleUpdate = async (q) => {
    try {
      await axios.put(
        `/api/feedback/admin/question/${q.id}`,
        null,
        {
          params: {
            text: q.questionText
          }
        }
      );
      toast.success("Question updated");
      loadTemplate();
    } catch (err) {
      toast.error(err.response?.data || "Update failed");
    }
  };

  // ✅ DELETE QUESTION (FIXED URL)
  const handleDelete = async (qid) => {
    if (!window.confirm("Delete this question?")) return;

    try {
      await axios.delete(
        `/api/feedback/admin/question/${qid}`
      );
      toast.success("Deleted");
      loadTemplate();
    } catch (err) {
      toast.error(err.response?.data || "Delete failed");
    }
  };

  const handleAdd = () => {
    setQuestions([
      ...questions,
      { id: null, questionText: "" }
    ]);
  };

  // ✅ ADD NEW QUESTION (FIXED URL)
  const handleSaveNew = async (q) => {
    try {
      await axios.post(
        `/api/feedback/admin/question`,
        null,
        {
          params: {
            templateId: id,
            text: q.questionText
          }
        }
      );
      toast.success("Question added");
      loadTemplate();
    } catch (err) {
      toast.error(err.response?.data || "Add failed");
    }
  };

  // ⭐ Loading UI instead of blank page
  if (!template) {
    return (
      <div className="text-center mt-5 fw-bold">
        Loading Template...
      </div>
    );
  }

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
          <AdminNav />
        </div>

        <div className="col-md-10 p-4">

          <div className="premium-card">

            <h4 className="fw-bold mb-3">
              Edit Template: {template.name}
            </h4>

            {template.locked && (
              <div className="alert alert-danger">
                Template is locked. Cannot edit.
              </div>
            )}

            {(questions || []).map((q, index) => (
              <div key={index} className="d-flex mb-3">

                <input
                  type="text"
                  className="form-control me-2"
                  value={q.questionText || ""}
                  disabled={template.locked}
                  onChange={(e) =>
                    handleChange(index, e.target.value)
                  }
                />

                {!template.locked && (
                  <>
                    {q.id ? (
                      <>
                        <button
                          className="btn btn-success me-2"
                          onClick={() => handleUpdate(q)}
                        >
                          💾
                        </button>

                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(q.id)}
                        >
                          ❌
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleSaveNew(q)}
                      >
                        ➕
                      </button>
                    )}
                  </>
                )}

              </div>
            ))}

            {!template.locked && (
              <button
                className="btn btn-outline-primary"
                onClick={handleAdd}
              >
                ➕ Add New Question
              </button>
            )}

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
        `}
      </style>

    </div>
  );
};

export default AdminEditTemplateQuestions;
