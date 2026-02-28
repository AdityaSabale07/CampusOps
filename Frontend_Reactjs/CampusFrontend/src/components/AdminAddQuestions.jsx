import axios from "../api/axiosConfig";
import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import AdminNav from "./AdminNav";

const AdminAddQuestions = () => {

  const { id } = useParams();
  const history = useHistory();

  const [template, setTemplate] = useState(null);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    loadTemplate();
  }, []);

  const loadTemplate = async () => {
    try {
      const resp = await axios.get(`/api/feedback/template/${id}`);
      setTemplate(resp.data);
      setQuestions(resp.data?.questions || []);
    } catch {
      toast.error("Failed to load template");
    }
  };

  const isLocked = template?.locked;

  const handleChange = (value, index) => {
    const updated = [...questions];
    updated[index].questionText = value;
    setQuestions(updated);
  };

  const addRow = () => {
    if (isLocked) return;
    setQuestions([...questions, { questionText: "" }]);
  };

  const deleteQuestion = async (index) => {

    if (isLocked) return;

    const q = questions[index];

    if (q.id) {
      try {
        await axios.delete(
          `/api/feedback/admin/question/${q.id}`
        );
        toast.success("Question deleted");
        loadTemplate();
      } catch (err) {
        toast.error(err.response?.data || "Delete failed");
      }
    } else {
      const updated = [...questions];
      updated.splice(index, 1);
      setQuestions(updated);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLocked) {
      toast.error("Template is locked. Cannot modify.");
      return;
    }

    try {

      for (let q of questions) {

        if (!q.questionText?.trim()) {
          toast.error("Question cannot be empty");
          return;
        }

        if (q.id) {
          await axios.put(
            `/api/feedback/admin/question/${q.id}`,
            null,
            { params: { text: q.questionText } }
          );
        } else {
          await axios.post(
            "/api/feedback/admin/question",
            null,
            {
              params: {
                templateId: id,
                text: q.questionText
              }
            }
          );
        }
      }

      toast.success("Questions saved successfully");

      setTimeout(() => {
        history.push(`/admin/template/preview/${id}`);
      }, 1000);

    } catch (err) {
      toast.error(err.response?.data || "Operation failed");
    }
  };

  // ⭐ FIXED loading screen
  if (!template) {
    return (
      <div className="text-center mt-5 fw-bold">
        Loading Template...
      </div>
    );
  }

  return (
    <div className="container-fluid p-0"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(-45deg,#e3f2fd,#b2dfdb,#e1f5fe,#dcedc8)"
      }}>

      <div className="row g-0">

        <div className="col-md-2">
          <AdminNav />
        </div>

        <div className="col-md-10 p-4">

          <div className="premium-card">

            <h4 className="mb-3">
              ✏ Manage Questions - {template.name}
            </h4>

            <p>
              Status: {isLocked
                ? <span className="text-danger">🔒 Locked</span>
                : <span className="text-success">Editable</span>}
            </p>

            <form onSubmit={handleSubmit}>

              {questions.map((q, index) => (
                <div className="d-flex mb-3" key={index}>

                  <input
                    type="text"
                    className="form-control me-2"
                    value={q.questionText || ""}
                    onChange={(e) =>
                      handleChange(e.target.value, index)
                    }
                    disabled={isLocked}
                    required
                  />

                  {!isLocked && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => deleteQuestion(index)}
                    >
                      ❌
                    </button>
                  )}

                </div>
              ))}

              {!isLocked && (
                <>
                  <button
                    type="button"
                    className="btn btn-outline-primary mb-3"
                    onClick={addRow}
                  >
                    ➕ Add More
                  </button>

                  <button className="btn btn-success w-100">
                    Save Changes
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary w-100 mt-2"
                    onClick={() =>
                      history.push(`/admin/template/preview/${id}`)
                    }
                  >
                    ⬅ Back to Preview
                  </button>
                </>
              )}

            </form>

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

export default AdminAddQuestions;
