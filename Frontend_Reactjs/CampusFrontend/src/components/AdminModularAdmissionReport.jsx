import axios from "../api/axiosConfig";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminNav from "./AdminNav";

const ITEMS_PER_PAGE = 10;

const AdminModularAdmissionReport = () => {

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);

  // ================= LOAD REPORT =================

  const loadReport = async () => {
    try {
      setLoading(true);

      const resp = await axios.get("/api/modular-registration");

      const sorted =
        Array.isArray(resp.data)
          ? [...resp.data].reverse()
          : [];

      setData(sorted);

    } catch {
      toast.error("Failed to load admission report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  // ================= BADGE =================

  const badge = (s) => {
    if (s === "APPROVED") return "badge bg-success";
    if (s === "REJECTED") return "badge bg-danger";
    return "badge bg-warning text-dark";
  };

  // ⭐ PAYMENT BADGE (NEW)
  const paymentBadge = (p) => {
    if (p === "PAID")
      return "badge bg-success";

    if (p === "EXPIRED")
      return "badge bg-danger";

    return "badge bg-warning text-dark";
  };

  // ================= FILTER =================

  const filtered = data.filter(r => {

    const matchSearch =
      r.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      status === "ALL" || r.status === status;

    return matchSearch && matchStatus;
  });

  // ================= PAGINATION =================

  const totalPages =
    Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const start =
    (page - 1) * ITEMS_PER_PAGE;

  const paginated =
    filtered.slice(start, start + ITEMS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [search, status]);

  // ================= REVENUE =================

  const totalRevenue = filtered.reduce(
    (sum, r) =>
      r.paymentStatus === "PAID"
        ? sum + Number(r.finalAmount || 0)
        : sum,
    0
  );

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

            <div className="d-flex justify-content-between align-items-center mb-3">

              <h4 className="fw-bold m-0">
                📋 Modular Admission Report
              </h4>

              <div
                style={{
                  background: "#1976d2",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "30px",
                  fontWeight: "600"
                }}
              >
                Paid Revenue: ₹ {totalRevenue}
              </div>

            </div>

            <div className="row">

              <div className="col-md-6">
                <input
                  type="text"
                  placeholder="🔎 Search name or email..."
                  className="form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <select
                  className="form-control"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="ALL">All Status</option>
                  <option value="APPROVED">Approved</option>
                  <option value="PENDING">Pending</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div className="col-md-3">
                <button
                  className="btn btn-secondary w-100"
                  onClick={() => {
                    setSearch("");
                    setStatus("ALL");
                  }}
                >
                  Clear Filters
                </button>
              </div>

            </div>

          </div>

          {/* TABLE */}
          <div
            style={{
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(15px)",
              padding: "20px",
              borderRadius: "20px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.08)"
            }}
          >

            {loading ? (
              <h5>Loading report...</h5>
            ) : paginated.length === 0 ? (
              <h5>No records found</h5>
            ) : (
              <>
                <table className="table align-middle">

                  <thead>
                    <tr className="text-secondary">
                      <th>Reg ID</th>
                      <th>Student</th>
                      <th>Email</th>
                      <th>Course</th>
                      <th>Batch</th>
                      <th>Status</th>
                      <th>Payment</th> {/* ⭐ NEW */}
                      <th>Final Fee</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginated.map((r) => (
                      <tr key={r.id}>
                        <td>{r.registrationId || "-"}</td>
                        <td>{r.studentName || "-"}</td>
                        <td>{r.email || "-"}</td>
                        <td>{r.batch?.course?.coursename || "-"}</td>
                        <td>{r.batch?.batchName || "-"}</td>
                        <td>
                          <span className={badge(r.status)}>
                            {r.status}
                          </span>
                        </td>

                        {/* ⭐ PAYMENT COLUMN */}
                        <td>
                          <span className={paymentBadge(r.paymentStatus)}>
                            {r.paymentStatus || "PENDING"}
                          </span>
                        </td>

                        <td>₹ {r.finalAmount || 0}</td>
                      </tr>
                    ))}
                  </tbody>

                </table>

                <div className="d-flex justify-content-center mt-3 gap-2">

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={`btn ${
                        page === i + 1
                          ? "btn-primary"
                          : "btn-outline-primary"
                      } btn-sm`}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}

                </div>
              </>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminModularAdmissionReport;