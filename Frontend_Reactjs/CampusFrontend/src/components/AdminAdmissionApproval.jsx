import axios from "../api/axiosConfig";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminNav from "./AdminNav";

const AdminAdmissionApproval = () => {

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [discountMap, setDiscountMap] = useState({});
  const [selectedDiscount, setSelectedDiscount] = useState({});

  // ⭐ PAGINATION (RESTORED)
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  // ================= LOAD DATA =================

  const loadData = async () => {
    try {
      const resp = await axios.get("/api/modular-registration");

      const sorted = [...resp.data].sort((a, b) => b.id - a.id);
      setData(sorted);

      const temp = {};

      for (let r of sorted) {

        const batchId = r.batch?.id;
        const email = r.email;

        if (!batchId || !email) continue;

        const key = `${batchId}_${email}`;

        if (temp[key]) continue;

        try {
          const d = await axios.get(
            `/api/discounts/batch/${batchId}?email=${email}`
          );

          temp[key] = d.data || [];
        } catch {
          temp[key] = [];
        }
      }

      setDiscountMap(temp);

      const sel = {};

      sorted.forEach(r => {

        const key = `${r.batch?.id}_${r.email}`;
        const discounts = temp[key] || [];

        const match = discounts.find(d =>
          d.name === r.discountName ||
          d.type === r.discountType
        );

        sel[r.id] = match ? match.id : "";
      });

      setSelectedDiscount(sel);

    } catch {
      toast.error("Failed to load registrations");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ================= ACTIONS =================

  const approve = async (id) => {
    try {

      const discountId =
        selectedDiscount[id] || "";

      const url = discountId
        ? `/api/modular-registration/approve/${id}?discountId=${discountId}`
        : `/api/modular-registration/approve/${id}`;

      await axios.put(url);

      toast.success("Admission approved");
      loadData();

    } catch {
      toast.error("Approve failed");
    }
  };

  const reject = async (id) => {
    try {
      await axios.put(`/api/modular-registration/reject/${id}`);
      toast.success("Admission rejected");
      loadData();
    } catch {
      toast.error("Reject failed");
    }
  };

  const badge = (status) => {
    if (status === "APPROVED") return "badge bg-success";
    if (status === "REJECTED") return "badge bg-danger";
    return "badge bg-warning text-dark";
  };

  // ================= FILTER =================

  const filtered = data
    .filter(r =>
      statusFilter === "ALL"
        ? true
        : r.status === statusFilter
    )
    .filter((r) =>
      r.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.batch?.batchName?.toLowerCase().includes(search.toLowerCase())
    );

  // ================= PAGINATION =================

  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  const startIndex =
    (currentPage - 1) * rowsPerPage;

  const currentData =
    filtered.slice(startIndex, startIndex + rowsPerPage);

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

          {/* HEADER */}
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

            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold m-0">🎓 Admission Approval Panel</h4>

              <div
                style={{
                  background: "#4caf50",
                  color: "white",
                  padding: "8px 18px",
                  borderRadius: "30px",
                  fontWeight: "600"
                }}
              >
                Total: {filtered.length}
              </div>
            </div>

            <div className="row">

              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  placeholder="🔍 Search student / email / batch..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{ borderRadius: "12px" }}
                />
              </div>

              <div className="col-md-4">
                <select
                  className="form-control"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{ borderRadius: "12px" }}
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

            </div>

          </div>

          {/* TABLE */}
          <div
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(15px)",
              padding: "25px",
              borderRadius: "20px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.08)"
            }}
          >

            <table className="table align-middle">

              <thead>
                <tr className="text-secondary">
                  <th>SR NO</th>
                  <th>👤 Student</th>
                  <th>📧 Email</th>
                  <th>📚 Batch</th>
                  <th>💰 Fee</th>
                  <th>🎁 Discount</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {currentData.map((r, index) => {

                  const key = `${r.batch?.id}_${r.email}`;
                  const discounts = discountMap[key] || [];

                  const hasCombo =
                    discounts.some(d => d.type === "COMBO");

                  const finalDiscounts =
                    hasCombo
                      ? discounts.filter(d => d.type !== "GROUP")
                      : discounts;

                  return (
                    <tr key={r.id}>
                      <td>{startIndex + index + 1}</td>
                      <td>{r.studentName}</td>
                      <td>{r.email}</td>
                      <td>{r.batch?.batchName}</td>
                      <td>₹ {r.finalAmount}</td>

                      <td>
                        <select
                          className="form-control form-control-sm"
                          disabled={r.status !== "PENDING"}
                          value={selectedDiscount[r.id] || ""}
                          onChange={(e) =>
                            setSelectedDiscount(prev => ({
                              ...prev,
                              [r.id]: e.target.value
                            }))
                          }
                        >
                          <option value="">None</option>
                          {finalDiscounts.map(d => (
                            <option key={d.id} value={d.id}>
                              {d.type}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <span className={badge(r.status)}>
                          {r.status}
                        </span>
                      </td>

                      <td className="text-center">
                        {r.status === "PENDING" ? (
                          <>
                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={() => approve(r.id)}
                            >
                              ✔ Approve
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => reject(r.id)}
                            >
                              ✖ Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-muted">Completed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>

            {/* ⭐ PAGINATION RESTORED */}
            <div className="d-flex justify-content-center mt-3">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`btn btn-sm mx-1 ${
                    currentPage === i + 1
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminAdmissionApproval;