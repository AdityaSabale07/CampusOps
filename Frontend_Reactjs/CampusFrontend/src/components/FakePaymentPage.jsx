import axios from "../api/axiosConfig";
import { useParams, useHistory } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

const FakePaymentPage = () => {

  const { id } = useParams();
  const history = useHistory();

  const [name, setName] = useState("");
  const [upi, setUpi] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = async () => {

    if (!name || !upi) {
      toast.error("Fill all details");
      return;
    }

    try {

      setLoading(true);

      // fake processing delay (looks real)
      setTimeout(async () => {

        await axios.post("/api/payment/verify", {
          registrationId: parseInt(id),
          razorpayOrderId: "TEST_ORDER",
          razorpayPaymentId: "TEST_PAYMENT",
          razorpaySignature: "TEST_SIGN"
        });

        setLoading(false);
        setSuccess(true);

        toast.success("Payment Successful 🎉");

        setTimeout(() => {
          history.push("/admission/status");
        }, 2000);

      }, 1800);

    } catch (err) {
      toast.error("Payment failed");
      setLoading(false);
    }
  };

  // ===== SUCCESS SCREEN =====

  if (success) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh", background: "#f5f7fb" }}
      >
        <div className="card p-5 text-center shadow">
          <h2 className="text-success">✔ Payment Success</h2>
          <p className="mt-2">Redirecting to admission status...</p>
        </div>
      </div>
    );
  }

  return (

    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(-45deg,#e3f2fd,#b2dfdb,#e1f5fe,#dcedc8)"
      }}
    >

      <div
        className="card shadow-lg"
        style={{
          width: "420px",
          borderRadius: "18px",
          overflow: "hidden"
        }}
      >

        {/* HEADER */}
        <div
          className="p-3 text-white"
          style={{ background: "#072654" }}
        >
          <h5 className="m-0">💳 Razorpay Secure Payment</h5>
          <small>Demo Gateway</small>
        </div>

        {/* BODY */}
        <div className="p-4 bg-white">

          <div className="mb-3">
            <label className="fw-bold">Name</label>
            <input
              className="form-control"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="fw-bold">UPI / Card</label>
            <input
              className="form-control"
              placeholder="demo@upi"
              value={upi}
              onChange={(e) => setUpi(e.target.value)}
            />
          </div>

          <div className="alert alert-info py-2">
            🔒 256-bit Secure Payment (Demo)
          </div>

          <button
            className="btn btn-primary w-100 fw-bold"
            onClick={handlePay}
            disabled={loading}
          >
            {loading ? "Processing Payment..." : "Pay Now"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default FakePaymentPage;