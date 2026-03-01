import axios from "../api/axiosConfig";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const StudentAdmissionRegistration = () => {

  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [offers, setOffers] = useState([]);

  const [selectedBatchFee, setSelectedBatchFee] = useState(0);

  // ⭐ GROUP MESSAGE FLAG
  const [hasGroupDiscount, setHasGroupDiscount] = useState(false);

  const [form, setForm] = useState({
    studentName: "",
    email: "",
    phone: "",
    courseId: "",
    batchId: ""
  });

  // ================= LOAD =================

  const loadCourses = async () => {
    try {
      const resp = await axios.get("/api/courses/modular");
      setCourses(resp.data);
    } catch {
      toast.error("Failed to load courses");
    }
  };

  const loadBatches = async (courseId) => {
    try {
      const resp = await axios.get(`/api/batches/course/${courseId}`);
      setBatches(resp.data);
    } catch {
      toast.error("Failed to load batches");
    }
  };

  const loadOffers = async (batchId, email) => {
    try {
      const resp = await axios.get(
        `/api/discounts/batch/${batchId}?email=${email || ""}`
      );
      setOffers(resp.data || []);
    } catch {
      toast.error("Failed to load offers");
    }
  };

  // ⭐ CHECK GROUP DISCOUNT (ADMIN VIEW API)
  const checkGroupDiscount = async (batchId) => {
    try {
      const resp = await axios.get(
        `/api/discounts/batch/admin/${batchId}`
      );

      const exists =
        (resp.data || []).some(
          d => d.type?.toUpperCase() === "GROUP"
        );

      setHasGroupDiscount(exists);
    } catch {
      setHasGroupDiscount(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  // ================= DATE FORMAT =================

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "courseId") {
      setForm(prev => ({
        ...prev,
        courseId: value,
        batchId: ""
      }));

      setOffers([]);
      setSelectedBatchFee(0);
      setHasGroupDiscount(false);

      if (value) loadBatches(value);
      else setBatches([]);

      return;
    }

    if (name === "batchId") {

      const batch = batches.find(
        b => b.id === Number(value)
      );

      setSelectedBatchFee(batch?.fee || 0);

      setForm(prev => ({
        ...prev,
        batchId: value
      }));

      if (value) {

        // ⭐ only load offers if email exists
        if (form.email) {
          loadOffers(value, form.email);
        } else {
          setOffers([]);
        }

        checkGroupDiscount(value);
      }

      return;
    }

    if (name === "email") {

      setForm(prev => ({
        ...prev,
        email: value
      }));

      if (form.batchId) {
        loadOffers(form.batchId, value);
      }

      return;
    }

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await axios.post("/api/modular-registration", {
        studentName: form.studentName,
        email: form.email,
        phone: form.phone,
        batchId: form.batchId,
        discountId: null   // ADMIN WILL APPLY
      });

      toast.success("Admission registered successfully 🎓");

      setForm({
        studentName: "",
        email: "",
        phone: "",
        courseId: "",
        batchId: ""
      });

      setOffers([]);
      setBatches([]);
      setSelectedBatchFee(0);
      setHasGroupDiscount(false);

    } catch {
      toast.error("Registration failed");
    }
  };

  // ================= HELPERS =================

  // ⭐ SAFE MODE CHECK (FIXED)
  const isPercentage = (o) =>
    o?.mode === "PERCENTAGE" ||
    o?.type === "PERCENTAGE";

  const getOfferLabel = (o) =>
    isPercentage(o)
      ? `${o.value}% OFF`
      : `₹ ${o.value} OFF`;

  const bestOffer =
    offers.length > 0
      ? [...offers].sort((a, b) => {

          const aVal =
            isPercentage(a)
              ? (selectedBatchFee * a.value) / 100
              : a.value;

          const bVal =
            isPercentage(b)
              ? (selectedBatchFee * b.value) / 100
              : b.value;

          return bVal - aVal;
        })[0]
      : null;

  // ================= UI =================

  return (

    <div className="container py-4">

      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
          background: "white",
          padding: "28px",
          borderRadius: "18px",
          boxShadow: "0 15px 35px rgba(0,0,0,0.08)"
        }}
      >

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-3">

          <div>
            <h4 className="fw-bold m-0">🎓 Admission Registration</h4>
            <small className="text-muted">
              Modular Batch Admission Form
            </small>
          </div>

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => window.history.back()}
          >
            ⬅ Back
          </button>

        </div>

        <hr />

        {/* GROUP INFO */}
        {form.batchId && (
          <div className={`alert ${hasGroupDiscount ? "alert-info" : "alert-secondary"}`}>
            {hasGroupDiscount ? (
              <>
                👥 <strong>Group Discount Available!</strong>
                <br />
                Contact admin if you are registering with a group.
              </>
            ) : (
              <>
                ℹ️ Group discount is not available for this batch.
              </>
            )}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          <div className="row g-3">

            <div className="col-md-6">
              <label className="fw-bold">Student Name</label>
              <input className="form-control"
                name="studentName"
                value={form.studentName}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="fw-bold">Email</label>
              <input className="form-control"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="fw-bold">Phone</label>
              <input className="form-control"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="fw-bold">Course</label>
              <select className="form-control"
                name="courseId"
                value={form.courseId}
                onChange={handleChange}>
                <option value="">Choose Course</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.coursename}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="fw-bold">Batch</label>
              <select
                className="form-control"
                name="batchId"
                value={form.batchId}
                onChange={handleChange}
                disabled={!form.courseId}
              >
                <option value="">Choose Batch</option>
                {batches.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.batchName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="fw-bold">Course Fee</label>
              <input
                className="form-control"
                value={`₹ ${selectedBatchFee}`}
                disabled
              />
            </div>

          </div>

          {/* OFFERS INFO */}
          <div style={{
            marginTop: "20px",
            padding: "15px",
            borderRadius: "12px",
            background: "#f4faff"
          }}>

            <h6 className="fw-bold mb-2">
              🎁 Available Offers ({offers.length})
            </h6>

            {bestOffer && (
              <div className="alert alert-success py-2">
                ⭐ Best Available Offer: {bestOffer.type}
                {" • "}
                {getOfferLabel(bestOffer)}
                <div className="small mt-1">
                  Valid: {formatDate(bestOffer.startDate)}
                  {" → "}
                  {formatDate(bestOffer.endDate)}
                </div>
              </div>
            )}

            <small className="text-muted">
              Discounts will be applied by admin after verification.
            </small>

          </div>

          <button className="btn btn-primary w-100 mt-4">
            🚀 Submit Admission
          </button>

        </form>

      </div>
    </div>
  );
};

export default StudentAdmissionRegistration;