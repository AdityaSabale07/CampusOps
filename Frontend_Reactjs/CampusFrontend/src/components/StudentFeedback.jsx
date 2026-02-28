import axios from "../api/axiosConfig";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import StudentNav from "./StudentNav";

const StudentFeedback = () => {

  const [schedules, setSchedules] = useState([]);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState({});
  const [comments, setComments] = useState("");

  const courseId = localStorage.getItem("courseId");
  const studentId = localStorage.getItem("userid");

  useEffect(() => {
    if (courseId && courseId !== "null") {
      loadActiveFeedback();
    }
  }, []);

  const loadActiveFeedback = async () => {
    try {
      const resp = await axios.get(
        `/api/feedback/student/course/${courseId}`
      );
      setSchedules(resp.data);
    } catch (err) {
      console.log(err.response);
      toast.error("Failed to load feedback");
    }
  };

  const handleRating = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selected) return;

    if (Object.keys(answers).length !== selected.template.questions.length) {
      toast.error("Please answer all questions");
      return;
    }

    const payload = {
      studentId: parseInt(studentId),
      comments: comments,
      answers: answers
    };

    try {
      await axios.post(
        `/api/feedback/student/submit/${selected.id}`,
        payload
      );

      toast.success("Feedback submitted successfully");

      // 🔥 Remove submitted schedule from list
      setSchedules(prev =>
        prev.filter(s => s.id !== selected.id)
      );

      // Reset form
      setSelected(null);
      setAnswers({});
      setComments("");

    } catch (err) {
      console.log(err.response);
      toast.error(err.response?.data || "Submission failed");
    }
  };

  return (
    <div className="container-fluid p-0"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(-45deg,#e3f2fd,#b2dfdb,#e1f5fe,#dcedc8)"
      }}>

      <div className="row g-0">

        <div className="col-md-2">
          <StudentNav/>
        </div>

        <div className="col-md-10 p-4">

          {/* ===== FEEDBACK LIST ===== */}
          {!selected && (
            <div className="premium-card">

              <h4 className="mb-4">📝 Active Feedback</h4>

              {schedules.length === 0 && (
                <p className="text-muted">
                  No active feedback available.
                </p>
              )}

              {schedules.map((s) => (
                <div
                  key={s.id}
                  className="feedback-card mb-3"
                >
                  <h5>{s.template.name}</h5>
                  <p>
                    Module: {s.module?.description}
                  </p>
                  <p>
                    Staff: {s.staff?.uname}
                  </p>

                  <button
                    className="btn btn-primary"
                    onClick={() => setSelected(s)}
                  >
                    Give Feedback
                  </button>
                </div>
              ))}

            </div>
          )}

          {/* ===== FEEDBACK FORM ===== */}
          {selected && (
            <div className="premium-card">

              <h4 className="mb-3">
                Feedback - {selected.template.name}
              </h4>

              <form onSubmit={handleSubmit}>

                {selected.template.questions.map((q) => (
                  <div key={q.id} className="mb-4">

                    <p className="fw-bold">
                      {q.questionText}
                    </p>

                    <div className="d-flex gap-3">

                      {[4,3,2,1].map(val => (
                        <label key={val}>
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            value={val}
                            onChange={() =>
                              handleRating(q.id, val)
                            }
                          />{" "}
                          {val === 4 && "Excellent"}
                          {val === 3 && "Good"}
                          {val === 2 && "Satisfactory"}
                          {val === 1 && "Poor"}
                        </label>
                      ))}

                    </div>
                  </div>
                ))}

                <div className="mb-3">
                  <textarea
                    className="form-control"
                    placeholder="Additional comments (optional)"
                    value={comments}
                    onChange={(e) =>
                      setComments(e.target.value)
                    }
                  />
                </div>

                <button className="btn btn-success w-100">
                  Submit Feedback
                </button>

              </form>

            </div>
          )}

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

          .feedback-card {
            background: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.05);
          }
        `}
      </style>

    </div>
  );
};

export default StudentFeedback;
