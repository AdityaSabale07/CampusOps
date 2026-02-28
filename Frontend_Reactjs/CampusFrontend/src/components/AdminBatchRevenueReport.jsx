import axios from "../api/axiosConfig";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminNav from "./AdminNav";

const AdminBatchRevenueReport = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= LOAD =================

  const loadReport = async () => {

    try {

      setLoading(true);

      const resp = await axios.get(
        "/api/modular-registration/report/batch"
      );

      setData(Array.isArray(resp.data) ? resp.data : []);

    } catch {
      toast.error("Failed to load batch revenue report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  // ================= TOTAL REVENUE =================

  const totalRevenue = data.reduce(
    (sum, b) => sum + Number(b.totalRevenue || 0),
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

        {/* SIDEBAR */}
        <div className="col-md-2">
          <AdminNav />
        </div>

        {/* CONTENT */}
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

            <div className="d-flex justify-content-between align-items-center">

              <h4 className="fw-bold m-0">
                🧾 Batch Revenue Report
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
                Total Revenue: ₹ {totalRevenue}
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
              <h5>Loading batch report...</h5>
            ) : data.length === 0 ? (
              <h5>No data found</h5>
            ) : (

              <table className="table align-middle">

                <thead>
                  <tr className="text-secondary">
                    <th>Batch</th>
                    <th>Course</th>
                    <th>Total Registrations</th>
                    <th>Total Revenue</th>
                  </tr>
                </thead>

                <tbody>
                  {data.map((b) => (
                    <tr key={b.batchName}>
                      <td>{b.batchName || "-"}</td>
                      <td>{b.courseName || "-"}</td>
                      <td>{b.totalRegistrations || 0}</td>
                      <td>₹ {b.totalRevenue || 0}</td>
                    </tr>
                  ))}
                </tbody>

              </table>

            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminBatchRevenueReport;