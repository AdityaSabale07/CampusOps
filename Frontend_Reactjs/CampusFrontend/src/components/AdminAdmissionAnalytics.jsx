import axios from "../api/axiosConfig";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminNav from "./AdminNav";

const AdminAdmissionAnalytics = () => {

  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");

  // ================= LOAD =================

  const loadDashboard = async () => {
    try {
      const resp = await axios.get(
        "/api/modular-registration/admin/dashboard"
      );
      setData(resp.data);
    } catch {
      toast.error("Failed to load analytics");
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (!data) {
    return (
      <div className="d-flex" style={{ height: "100vh" }}>
        <div style={{ width: "250px" }}>
          <AdminNav />
        </div>
        <div className="container mt-5">
          <h4>Loading analytics...</h4>
        </div>
      </div>
    );
  }

  // ================= FILTER =================

  const filteredCourses =
    data.courseAnalytics?.filter(c =>
      c.courseName.toLowerCase()
        .includes(search.toLowerCase())
    );

  const filteredBatches =
    data.batchAnalytics?.filter(b =>
      b.batchName.toLowerCase()
        .includes(search.toLowerCase())
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

        {/* SIDEBAR */}
        <div className="col-md-2">
          <AdminNav />
        </div>

        {/* CONTENT */}
        <div className="col-md-10 p-4">

          {/* ===== HEADER CARD ===== */}
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

              <h4 className="fw-bold m-0">
                📊 Admission Analytics Dashboard
              </h4>

              <div
                style={{
                  background: "#4caf50",
                  color: "white",
                  padding: "8px 18px",
                  borderRadius: "30px",
                  fontWeight: "600"
                }}
              >
                Total Registrations: {data.totalRegistrations}
              </div>

            </div>

            <input
              type="text"
              placeholder="🔎 Search course or batch..."
              className="form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ borderRadius: "12px" }}
            />

          </div>

          {/* ===== STATS ===== */}
          <div className="row">

            <StatCard title="Registrations" value={data.totalRegistrations} icon="🎓" color="#1976d2" />
            <StatCard title="Approved" value={data.approved} icon="✅" color="#2e7d32" />
            <StatCard title="Pending" value={data.pending} icon="⏳" color="#f9a825" />
            <StatCard title="Rejected" value={data.rejected} icon="❌" color="#c62828" />
            <StatCard title="Revenue" value={`₹ ${data.totalRevenue}`} icon="💰" color="#0288d1" />
            <StatCard title="Discount" value={`₹ ${data.totalDiscount}`} icon="🎁" color="#6a1b9a" />

          </div>

          {/* ===== TABLES ===== */}
          <div className="row mt-3">

            {/* COURSE TABLE */}
            <div className="col-md-6">
              <GlassTable title="📚 Course Analytics">
                <table className="table align-middle">
                  <thead>
                    <tr className="text-secondary">
                      <th>Course</th>
                      <th>Regs</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses?.map((c, i) => (
                      <tr key={i}>
                        <td>{c.courseName}</td>
                        <td>{c.totalRegistrations}</td>
                        <td>₹ {c.totalRevenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </GlassTable>
            </div>

            {/* BATCH TABLE */}
            <div className="col-md-6">
              <GlassTable title="🕒 Batch Analytics">
                <table className="table align-middle">
                  <thead>
                    <tr className="text-secondary">
                      <th>Batch</th>
                      <th>Regs</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBatches?.map((b, i) => (
                      <tr key={i}>
                        <td>{b.batchName}</td>
                        <td>{b.totalRegistrations}</td>
                        <td>₹ {b.totalRevenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </GlassTable>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};


// ================= SMALL PREMIUM CARD =================

const StatCard = ({ title, value, icon, color }) => (
  <div className="col-md-2 mb-3">
    <div
      style={{
        background: color,
        color: "white",
        padding: "15px",
        borderRadius: "14px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        textAlign: "center"
      }}
    >
      <div style={{ fontSize: "14px", fontWeight: "600" }}>
        {icon} {title}
      </div>
      <h5 className="mt-2 mb-0">{value}</h5>
    </div>
  </div>
);


// ================= GLASS TABLE =================

const GlassTable = ({ title, children }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.85)",
      backdropFilter: "blur(15px)",
      padding: "20px",
      borderRadius: "20px",
      boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
      height: "100%"
    }}
  >
    <h6 className="fw-bold mb-3">{title}</h6>
    {children}
  </div>
);

export default AdminAdmissionAnalytics;