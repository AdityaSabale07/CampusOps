import axios from "../api/axiosConfig";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import StudentNav from "./StudentNav";

const StudentFeedback = () => {

  const [data, setData] = useState([]);
  const [answers, setAnswers] = useState({});
  const [comment, setComment] = useState("");

  const userid = localStorage.getItem("userid");
  const courseId = localStorage.getItem("courseId");

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {

      // 🔥 UPDATED API (prevents duplicate submissions)
      const resp = await axios.get(
        `/api/feedback/student/course/${courseId}/${userid}`
      );

      setData(resp.data);

    } catch {
      toast.error("Failed to load feedback");
    }
  };

  const handleRating = (qid, value) => {
    setAnswers({
      ...answers,
      [qid]: value
    });
  };

  const submitFeedback = async (scheduleId, questions) => {

    // validation
    for (let q of questions) {
      if (!answers[q.id]) {
        toast.error("Please answer all questions");
        return;
      }
    }

    try {

      await axios.post(
        `/api/feedback/student/submit/${scheduleId}`,
        {
          studentId: parseInt(userid),
          comments: comment,
          answers: answers
        }
      );

      toast.success("Feedback submitted successfully");

      // 🔥 reload list (submitted one disappears)
      loadFeedback();

      setAnswers({});
      setComment("");

    } catch (err) {
      toast.error(
        err.response?.data || "Already submitted feedback"
      );
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
          <StudentNav />
        </div>

        <div className="col-md-10 p-4">

          <h4 className="fw-bold mb-4">📝 Student Feedback</h4>

          {data.length === 0 && (
            <div className="alert alert-info">
              No active feedback available
            </div>
          )}

          {data.map((f) => (
            <div
              key={f.id}
              className="card p-3 mb-4"
              style={{
                borderRadius: "15px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
              }}
            >

              <h5>{f.template?.name}</h5>
              <p className="text-muted mb-3">
                Staff: {f.staff?.uname}
              </p>

              {f.template?.questions?.map((q) => (
                <div key={q.id} className="mb-3">

                  <label className="fw-semibold">
                    {q.questionText}
                  </label>

                  <select
                    className="form-control"
                    value={answers[q.id] || ""}
                    onChange={(e) =>
                      handleRating(q.id, parseInt(e.target.value))
                    }
                  >
                    <option value="">Select Rating</option>
                    <option value="4">Excellent</option>
                    <option value="3">Good</option>
                    <option value="2">Satisfactory</option>
                    <option value="1">Poor</option>
                  </select>

                </div>
              ))}

              <textarea
                className="form-control mb-3"
                placeholder="Comments (Optional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button
                className="btn btn-success"
                onClick={() =>
                  submitFeedback(
                    f.id,
                    f.template?.questions || []
                  )
                }
              >
                Submit Feedback
              </button>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default StudentFeedback;
