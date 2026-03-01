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
  const [type, setType] = useState("EARLY_BIRD");
  const [mode, setMode] = useState("FLAT");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [batchId, setBatchId] = useState("");
  const [studentEmail, setStudentEmail] = useState("");

  // ===== GROUP EMAILS =====
  const [groupEmails, setGroupEmails] = useState([]);
  const [emailInput, setEmailInput] = useState("");

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

  // ================= GROUP EMAIL HELPERS =================

  const addEmail = () => {
    if (!emailInput.trim()) return;

    const email = emailInput.trim();

    if (groupEmails.includes(email)) {
      toast.error("Email already added");
      return;
    }

    setGroupEmails([...groupEmails, email]);
    setEmailInput("");
  };

  const removeEmail = (email) => {
    setGroupEmails(groupEmails.filter(e => e !== email));
  };

  // ================= CREATE =================

  const createDiscount = async () => {

    if (!name || !value) {
      toast.error("Please fill required fields");
      return;
    }

    try {

      setLoading(true);

      // ⭐ IMPORTANT FIX
      // GROUP without emails = NULL (public group offer)
      const finalStudentEmail =
        type === "GROUP"
          ? (groupEmails.length > 0
              ? groupEmails.join(",")
              : null)
          : (studentEmail || null);

      await axios.post(
        `/api/discounts${batchId ? `?batchId=${batchId}` : ""}`,
        {
          name,
          type,
          mode,
          description,
          value,
          startDate: startDate || null,
          endDate: endDate || null,
          studentEmail: finalStudentEmail
        }
      );

      toast.success("Discount created");

      setName("");
      setValue("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setBatchId("");
      setStudentEmail("");
      setGroupEmails([]);
      setEmailInput("");

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

  // ================= FORM =================

  const renderForm = () => (
    <div
      style={{
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(15px)",
        padding: "25px",
        borderRadius: "20px",
        boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
        maxHeight: "70vh",
        overflowY: "auto"
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
        <option value="EARLY_BIRD">EARLY_BIRD</option>
        <option value="LOYALTY">LOYALTY</option>
        <option value="INDIVIDUAL">INDIVIDUAL</option>
        <option value="GROUP">GROUP</option>
        <option value="COMBO">COMBO</option>
        <option value="SUPER_OFFER">SUPER_OFFER</option>
      </select>

      <label className="fw-bold">Mode</label>
      <select className="form-control mb-2"
        value={mode}
        onChange={e => setMode(e.target.value)}>
        <option value="FLAT">FLAT (₹)</option>
        <option value="PERCENTAGE">PERCENTAGE (%)</option>
      </select>

      <label className="fw-bold">Description</label>
      <input
        className="form-control mb-2"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

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

      {(type === "INDIVIDUAL" || type === "GROUP") && (
        <>
          <label className="fw-bold">
            {type === "GROUP"
              ? "Group Emails (optional)"
              : "Student Email"}
          </label>

          {type === "INDIVIDUAL" ? (
            <input
              className="form-control mb-2"
              value={studentEmail}
              onChange={e => setStudentEmail(e.target.value)}
            />
          ) : (
            <>
              <div className="d-flex mb-2">
                <input
                  className="form-control me-2"
                  placeholder="Enter email"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={addEmail}>
                  Add
                </button>
              </div>

              <small className="text-muted d-block mb-2">
                Leave empty = Group offer visible to all students.
              </small>

              <div>
                {groupEmails.map(email => (
                  <span
                    key={email}
                    className="badge bg-primary me-2 mb-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => removeEmail(email)}
                  >
                    {email} ❌
                  </span>
                ))}
              </div>
            </>
          )}
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
  );

  // ================= TABLE =================

  const renderTable = () => (
    <div style={{
      background: "rgba(255,255,255,0.9)",
      padding: "25px",
      borderRadius: "20px",
      boxShadow: "0 15px 40px rgba(0,0,0,0.08)"
    }}>
      <h5 className="fw-bold mb-3">📋 All Discounts</h5>
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Name</th><th>Type</th><th>Value</th><th>Batch</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map(d => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{d.type}</td>
              <td>{d.mode==="PERCENTAGE"?`${d.value}%`:`₹ ${d.value}`}</td>
              <td>{d.batch?.batchName || "ALL"}</td>
              <td>
                <button className="btn btn-danger btn-sm"
                  onClick={()=>deleteDiscount(d.id)}>
                  🗑 Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

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

          <div style={{
            background:"rgba(255,255,255,0.85)",
            padding:"25px",
            borderRadius:"20px",
            marginBottom:"15px"
          }}>
            <div className="d-flex justify-content-between">
              <h4 className="fw-bold m-0">🎁 Discount Management</h4>
              <div className="badge bg-success p-2">
                Total Discounts: {data.length}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">{renderForm()}</div>
            <div className="col-md-8">{renderTable()}</div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDiscountManagement;