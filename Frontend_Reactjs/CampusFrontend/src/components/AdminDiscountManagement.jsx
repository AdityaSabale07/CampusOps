import axios from "../api/axiosConfig";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminNav from "./AdminNav";

const AdminDiscountManagement = () => {

  const [data, setData] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);

  // ===== FORM STATE =====
  const [name, setName] = useState("");
  const [type, setType] = useState("FLAT");
  const [value, setValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [batchId, setBatchId] = useState("");
  const [studentEmail, setStudentEmail] = useState("");

  // ================= LOAD =================

  const loadDiscounts = async () => {
    try {
      const resp = await axios.get("/api/discounts");
      setData(resp.data || []);
    } catch {
      toast.error("Failed to load discounts");
    }
  };

  const loadBatches = async () => {
    try {
      const resp = await axios.get("/api/batches");
      setBatches(resp.data || []);
    } catch {}
  };

  useEffect(() => {
    loadDiscounts();
    loadBatches();
  }, []);

  // ================= CREATE =================

  const createDiscount = async () => {

    if (!name || !value) {
      toast.error("Please fill required fields");
      return;
    }

    try {

      setLoading(true);

      await axios.post(
        `/api/discounts${batchId ? `?batchId=${batchId}` : ""}`,
        {
          name,
          type,
          value,
          startDate: startDate || null,
          endDate: endDate || null,
          studentEmail: studentEmail || null
        }
      );

      toast.success("Discount created");

      setName("");
      setValue("");
      setStartDate("");
      setEndDate("");
      setBatchId("");
      setStudentEmail("");

      loadDiscounts();

    } catch {
      toast.error("Failed to create discount");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================

  const deleteDiscount = async (id) => {
    try {
      await axios.delete(`/api/discounts/${id}`);
      toast.success("Discount removed");
      loadDiscounts();
    } catch {
      toast.error("Delete failed");
    }
  };

  // ================= UI =================

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

      <div className="row g-0">

        <div className="col-md-2">
          <AdminNav />
        </div>

        <div className="col-md-10 p-4">

          {/* ===== HEADER ===== */}
          <div
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(15px)",
              padding: "25px",
              borderRadius: "20px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
              marginBottom: "15px"
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="fw-bold m-0">🎁 Discount Management</h4>

              <div
                style={{
                  background: "#4caf50",
                  color: "white",
                  padding: "8px 18px",
                  borderRadius: "30px",
                  fontWeight: "600"
                }}
              >
                Total Discounts: {data.length}
              </div>
            </div>
          </div>

          <div className="row">

            {/* ===== FORM CARD ===== */}
            <div className="col-md-4">

              <div
                style={{
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(15px)",
                  padding: "25px",
                  borderRadius: "20px",
                  boxShadow: "0 15px 40px rgba(0,0,0,0.08)"
                }}
              >

                <h5 className="fw-bold mb-3">➕ Create Discount</h5>

                <label className="fw-bold">Name</label>
                <input className="form-control mb-2"
                  value={name}
                  onChange={e => setName(e.target.value)} />

                <label className="fw-bold">Type</label>
                <select className="form-control mb-2"
                  value={type}
                  onChange={e => setType(e.target.value)}>

                  <option value="FLAT">FLAT</option>
                  <option value="PERCENTAGE">PERCENTAGE</option>
                  <option value="EARLY_BIRD">EARLY_BIRD</option>
                  <option value="LOYALTY">LOYALTY</option>
                  <option value="INDIVIDUAL">INDIVIDUAL</option>
                  <option value="GROUP">GROUP</option>
                  <option value="COMBO">COMBO</option>
                </select>

                <label className="fw-bold">Value</label>
                <input type="number"
                  className="form-control mb-2"
                  value={value}
                  onChange={e => setValue(e.target.value)} />

                <label className="fw-bold">Assign Batch (optional)</label>
                <select className="form-control mb-2"
                  value={batchId}
                  onChange={e => setBatchId(e.target.value)}>
                  <option value="">All Batches</option>
                  {batches.map(b =>
                    <option key={b.id} value={b.id}>
                      {b.batchName}
                    </option>
                  )}
                </select>

                {type === "INDIVIDUAL" && (
                  <>
                    <label className="fw-bold">Student Email</label>
                    <input
                      className="form-control mb-2"
                      value={studentEmail}
                      onChange={e => setStudentEmail(e.target.value)}
                    />
                  </>
                )}

                <label className="fw-bold">Start Date</label>
                <input type="date"
                  className="form-control mb-2"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)} />

                <label className="fw-bold">End Date</label>
                <input type="date"
                  className="form-control mb-3"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)} />

                <button
                  className="btn btn-primary w-100"
                  onClick={createDiscount}
                  disabled={loading}>
                  {loading ? "Creating..." : "Create Discount"}
                </button>

              </div>
            </div>

            {/* ===== TABLE CARD ===== */}
            <div className="col-md-8">

              <div
                style={{
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(15px)",
                  padding: "25px",
                  borderRadius: "20px",
                  boxShadow: "0 15px 40px rgba(0,0,0,0.08)"
                }}
              >

                <h5 className="fw-bold mb-3">📋 All Discounts</h5>

                {data.length === 0 ? (
                  <h6 className="text-muted">No discounts found</h6>
                ) : (

                  <table className="table align-middle">
                    <thead>
                      <tr className="text-secondary">
                        <th>Name</th>
                        <th>Type</th>
                        <th>Value</th>
                        <th>Batch</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {data.map(d => (
                        <tr key={d.id}>
                          <td>{d.name}</td>
                          <td>
                            <span className="badge bg-primary">
                              {d.type}
                            </span>
                          </td>
                          <td>
                            {d.type === "PERCENTAGE"
                              ? `${d.value}%`
                              : `₹ ${d.value}`}
                          </td>
                          <td>{d.batch?.batchName || "ALL"}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => deleteDiscount(d.id)}>
                              🗑 Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                )}

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDiscountManagement;