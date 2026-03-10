import axios from "../api/axiosConfig";
import { useState } from "react";
import { toast } from "react-toastify";

const StudentAdmissionStatus = () => {

  const [email, setEmail] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

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

      setData(resp.data || []);

    } catch {

      toast.error("No admission found");
      setData([]);

    } finally {

      setLoading(false);

    }

  };

  const badge = (status) => {

    if (status === "APPROVED")
      return "badge bg-success px-4 py-2";

    if (status === "REJECTED")
      return "badge bg-danger px-4 py-2";

    return "badge bg-warning text-dark px-4 py-2";

  };

  return (

    <div
      className="d-flex justify-content-center align-items-start"
      style={{
        minHeight: "100vh",
        paddingTop: "60px",
        paddingBottom: "60px",
        background:
          "linear-gradient(-45deg,#e3f2fd,#b2dfdb,#e1f5fe,#dcedc8)",
        backgroundSize: "400% 400%",
        animation: "gradientMove 12s ease infinite"
      }}
    >

      <div
        style={{
          width: "100%",
          maxWidth: "820px",
          background: "white",
          borderRadius: "18px",
          padding: "32px",
          border: "1px solid #e6e9ef",
          boxShadow: "0 18px 45px rgba(0,0,0,0.08)"
        }}
      >

        {/* HEADER */}

        <div className="text-center mb-3">

          <h4 className="fw-bold m-0">📊 Admission Status</h4>

          <small className="text-muted">
            Check your admission & payment details
          </small>

        </div>

        {/* EMAIL INPUT */}

        <div className="row align-items-end mb-3">

          <div className="col-md-8">

            <label className="fw-bold mb-1">
              📧 Registered Email
            </label>

            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                borderRadius: "8px",
                border: "1px solid #dfe3e8"
              }}
            />

          </div>

          <div className="col-md-4 d-grid">

            <button
              className="btn btn-primary"
              onClick={checkStatus}
              disabled={loading}
              style={{
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,123,255,0.25)"
              }}
            >
              {loading ? "Checking..." : "🔍 Check Status"}
            </button>

          </div>

        </div>

        {/* BACK */}

        <div className="text-center mb-4">

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => window.location.href = "/admission"}
          >
            ⬅ Back
          </button>

        </div>

        {/* MULTIPLE ADMISSIONS */}

        {data.map((d, index) => (

          <div
            key={index}
            className="mb-4 p-3"
            style={{
              border: "1px solid #e6e9ef",
              borderRadius: "14px",
              background: "#fafbfc"
            }}
          >

            {/* STATUS */}

            <div className="text-center mb-3">

              <span className={badge(d.status)}>
                {d.status}
              </span>

            </div>

            {/* DETAILS */}

            <div className="row g-3">

              <div className="col-md-6">

                <div
                  className="p-3"
                  style={{
                    border: "1px solid #e6e9ef",
                    borderRadius: "12px",
                    background: "white"
                  }}
                >

                  <h6 className="fw-bold mb-2">
                    🎓 Admission Info
                  </h6>

                  <div><b>👤 Name:</b> {d.studentName}</div>
                  <div><b>📧 Email:</b> {d.email}</div>
                  <div><b>🆔 Reg ID:</b> {d.registrationId}</div>
                  <div><b>📚 Course:</b> {d.courseName}</div>
                  <div><b>🎓 Batch:</b> {d.batchName}</div>

                </div>

              </div>

              <div className="col-md-6">

                <div
                  className="p-3"
                  style={{
                    border: "1px solid #e6e9ef",
                    borderRadius: "12px",
                    background: "white"
                  }}
                >

                  <h6 className="fw-bold mb-2">
                    💰 Fee Details
                  </h6>

                  <div><b>Original:</b> ₹ {d.originalFee}</div>

                  <div><b>Discount:</b> ₹ {d.discountAmount}</div>

                  <div><b>Final Fee:</b> ₹ {d.finalAmount}</div>

                  {d.discountName && (
                    <div>
                      <b>🎁 Type:</b> {d.discountName} ({d.discountType})
                    </div>
                  )}

                </div>

              </div>

            </div>

            {/* PAYMENT */}

            <div className="mt-3">

              <h6 className="fw-bold mb-2">
                💳 Payment Info
              </h6>

              <div><b>Status:</b> {d.paymentStatus || "-"}</div>

              {d.paymentDueDate && (
                <div>
                  <b>Due:</b> {formatDate(d.paymentDueDate)}
                </div>
              )}

              {d.status === "APPROVED" &&
                d.paymentStatus === "PENDING" && (

                  <button
                    className="btn btn-primary btn-sm mt-2"
                    onClick={() =>
                      window.location.href = `/fake-payment/${d.id}`
                    }
                  >
                    💰 Pay Now
                  </button>

                )}

              {d.status === "APPROVED" &&
                d.paymentStatus === "PAID" && (

                  <div className="alert alert-success mt-2 mb-0">

                    🎉 Payment Completed

                    <div>
                      <b>Email:</b> {d.email}
                    </div>

                    <div>
                      <b>Password:</b> {d.tempPassword || "welcome123"}
                    </div>

                    <button
                      className="btn btn-success btn-sm mt-2"
                      onClick={() => window.location.href = "/"}
                    >
                      🔐 Login
                    </button>

                  </div>

                )}

            </div>

          </div>

        ))}

      </div>

      <style>
        {`
        @keyframes gradientMove {
          0% {background-position: 0% 50%;}
          50% {background-position: 100% 50%;}
          100% {background-position: 0% 50%;}
        }
        `}
      </style>

    </div>

  );

};

export default StudentAdmissionStatus;