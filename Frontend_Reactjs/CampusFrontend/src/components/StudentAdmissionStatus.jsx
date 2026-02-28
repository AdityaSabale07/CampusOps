import axios from "../api/axiosConfig";
import { useState } from "react";
import { toast } from "react-toastify";

const StudentAdmissionStatus = () => {

  const [email, setEmail] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // ===== CHECK STATUS =====

  const checkStatus = async () => {

    if (!email.trim()) {
      toast.error("Enter email");
      return;
    }

    try {
      setLoading(true);

      const resp = await axios.get(
        `/api/modular-registration/status/email/${email}`
      );

      setData(resp.data);

    } catch {
      toast.error("No admission found");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // ===== BADGE =====

  const badge = (status) => {
    if (status === "APPROVED") return "badge bg-success";
    if (status === "REJECTED") return "badge bg-danger";
    return "badge bg-warning text-dark";
  };

  // ===== UI =====

  return (

    <div
      className="container-fluid p-0 d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(-45deg,#e3f2fd,#b2dfdb,#e1f5fe,#dcedc8)",
        backgroundSize: "400% 400%",
        animation: "gradientMove 12s ease infinite"
      }}
    >

      <div
        style={{
          width: "100%",
          maxWidth: "650px",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(15px)",
          padding: "25px",
          borderRadius: "20px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.12)"
        }}
      >

        {/* ===== HEADER ===== */}
        <h4 className="fw-bold text-center mb-3">
          📊 Admission Status Checker
        </h4>

        {/* ===== SEARCH ===== */}
        <div className="row align-items-end mb-3">

          <div className="col-md-8">
            <label className="fw-bold mb-1">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ borderRadius: "10px" }}
            />
          </div>

          <div className="col-md-4">
            <button
              className="btn btn-primary w-100"
              onClick={checkStatus}
              disabled={loading}
              style={{ borderRadius: "10px" }}
            >
              {loading ? "Checking..." : "🔍 Check"}
            </button>
          </div>

        </div>

        <div className="text-center mb-3">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => window.location.href = "/admission"}
          >
            ⬅ Back
          </button>
        </div>

        {/* ===== RESULT ===== */}

        {data && (

          <div className="mt-3 border rounded p-3">

            <h6 className="fw-bold mb-3">
              🎓 Admission Details
            </h6>

            {/* ⭐ NEW: REGISTRATION ID */}
            <div><b>Registration ID:</b> {data.registrationId || "-"}</div>

            <div><b>Name:</b> {data.studentName}</div>
            <div><b>Email:</b> {data.email}</div>
            <div><b>Batch:</b> {data.batchName || "-"}</div>
            <div><b>Final Fee:</b> ₹ {data.finalAmount}</div>

            {data.discountName && (
              <div>
                <b>Discount:</b> {data.discountName} ({data.discountType})
              </div>
            )}

            <div className="mt-2">
              <span className={badge(data.status)}>
                {data.status}
              </span>
            </div>

            {/* ===== APPROVED ===== */}
            {data.status === "APPROVED" && (
              <div className="alert alert-success mt-3 mb-0">

                <b>🎉 Admission Approved</b>

                <div className="mt-2">
                  <div><b>Registration ID:</b> {data.registrationId || "-"}</div>
                  <div><b>Login Email:</b> {data.email}</div>
                  <div>
                    <b>Password:</b>{" "}
                    {data.tempPassword || "welcome123"}
                  </div>
                </div>

                <button
                  className="btn btn-success btn-sm mt-3"
                  onClick={() => window.location.href = "/"}
                >
                  🔐 Go to Login
                </button>

              </div>
            )}

            {/* ===== PENDING ===== */}
            {data.status === "PENDING" && (
              <div className="alert alert-warning mt-3 mb-0">
                ⏳ Under Review
                <br />
                <button
                  className="btn btn-warning btn-sm mt-2"
                  onClick={checkStatus}
                >
                  🔄 Refresh
                </button>
              </div>
            )}

            {/* ===== REJECTED ===== */}
            {data.status === "REJECTED" && (
              <div className="alert alert-danger mt-3 mb-0">
                ❌ Admission Rejected
                <br />
                <button
                  className="btn btn-danger btn-sm mt-2"
                  onClick={() =>
                    window.location.href = "/admission/register"}
                >
                  📝 Apply Again
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default StudentAdmissionStatus;