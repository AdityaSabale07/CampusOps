import axios from "../api/axiosConfig";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminNav from "./AdminNav";

const AdminDiscountAnalytics = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {

    try {
      setLoading(true);

      const resp = await axios.get("/api/discounts/analytics");

      setData(resp.data || []);

    } catch {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ===== KPIs =====

  const totalUsage =
    data.reduce((s, d) => s + (d.usageCount || 0), 0);

  const totalDiscount =
    data.reduce((s, d) => s + (d.totalDiscount || 0), 0);

  const totalRevenue =
    data.reduce((s, d) => s + (d.totalRevenue || 0), 0);

  const best =
    [...data].sort(
      (a, b) => b.totalRevenue - a.totalRevenue
    )[0];

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

          <h4 className="fw-bold mb-3">
            📊 Discount Analytics Dashboard
          </h4>

          {/* KPI CARDS */}
          <div className="row mb-3">

            <Card title="Total Usage" value={totalUsage} icon="🎟️" color="#1976d2"/>
            <Card title="Total Discount" value={`₹ ${totalDiscount}`} icon="🎁" color="#6a1b9a"/>
            <Card title="Revenue" value={`₹ ${totalRevenue}`} icon="💰" color="#2e7d32"/>
            <Card title="Best Discount" value={best?.discountName || "-"} icon="🏆" color="#ef6c00"/>

          </div>

          {/* TABLE */}
          <div style={{
            background:"rgba(255,255,255,0.9)",
            padding:"20px",
            borderRadius:"20px"
          }}>

            {loading ? (
              <h5>Loading...</h5>
            ) : (

              <table className="table align-middle">

                <thead>
                  <tr className="text-secondary">
                    <th>Discount</th>
                    <th>Type</th>
                    <th>Usage</th>
                    <th>Total Discount</th>
                    <th>Revenue</th>
                  </tr>
                </thead>

                <tbody>
                  {data.map(d => (
                    <tr key={d.discountName}>
                      <td>
                        {d.discountName}
                        {best?.discountName === d.discountName &&
                          <span className="badge bg-success ms-2">
                            BEST
                          </span>}
                      </td>
                      <td>{d.discountType}</td>
                      <td>{d.usageCount}</td>
                      <td>₹ {d.totalDiscount}</td>
                      <td>₹ {d.totalRevenue}</td>
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

const Card = ({title,value,icon,color}) => (
  <div className="col-md-3 mb-3">
    <div style={{
      background:color,
      color:"white",
      padding:"15px",
      borderRadius:"15px",
      textAlign:"center"
    }}>
      <div>{icon} {title}</div>
      <h5 className="mt-2 mb-0">{value}</h5>
    </div>
  </div>
);

export default AdminDiscountAnalytics;