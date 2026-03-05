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

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  // ================= LOAD DATA =================

  const loadData = async () => {

    try {

      const resp = await axios.get("/api/modular-registration");

      const sorted = [...resp.data].sort((a, b) => b.id - a.id);
      setData(sorted);

      const tempDiscountMap = {};
      const tempSelected = {};

      for (let r of sorted) {

        const batchId = r.batch?.id;
        const email = r.email;

        if (!batchId || !email) continue;

        const key = `${batchId}_${email}`;

        if (!tempDiscountMap[key]) {

          const d = await axios.get(
            `/api/discounts/batch/${batchId}?email=${email}`
          );

          tempDiscountMap[key] = d.data || [];
        }

        if (r.discountType !== "AUTO_APPLIED") {

          const discounts = tempDiscountMap[key] || [];

          const match = discounts.find(
            d => d.name === r.discountName
          );

          tempSelected[r.id] = match ? match.id : "";

        } else {

          tempSelected[r.id] = "";

        }

      }

      setDiscountMap(tempDiscountMap);
      setSelectedDiscount(tempSelected);

    } catch {

      toast.error("Failed to load registrations");

    }

  };

  useEffect(() => {
    loadData();
  }, []);

  // ================= APPROVE =================

  const approve = async (r) => {

    try {

      const discountId = selectedDiscount[r.id] || "";

      const key = `${r.batch?.id}_${r.email}`;
      const discounts = discountMap[key] || [];

      const selected = discounts.find(
        d => d.id == discountId
      );

      // ⚠ WARNING IF DISCOUNT MAY BE INVALID
      if (selected && (selected.type === "GROUP" || selected.type === "COMBO")) {

        const confirmApply = window.confirm(
          `⚠ ${selected.type} discount may not be valid for this student.\n\nApply anyway?`
        );

        if (!confirmApply) return;

      }

      const url = discountId
        ? `/api/modular-registration/approve/${r.id}?discountId=${discountId}`
        : `/api/modular-registration/approve/${r.id}`;

      await axios.put(url);

      toast.success("Admission approved");

      loadData();

    } catch {

      toast.error("Approve failed");

    }

  };

  // ================= REJECT =================

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

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;

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

          <div className="bg-white p-4 rounded-4 shadow-sm mb-3">

            <div className="d-flex justify-content-between align-items-center mb-3">

              <h4 className="fw-bold m-0">
                🎓 Admission Approval Panel
              </h4>

              <div className="badge bg-success fs-6 px-3 py-2">
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

          <div className="bg-white p-4 rounded-4 shadow-sm">

            <table className="table align-middle">

              <thead>

                <tr>
                  <th>SR</th>
                  <th>Student</th>
                  <th>Batch</th>
                  <th>Original Fee</th>
                  <th>Final Fee</th>
                  <th>Applied Discount</th>
                  <th>Valid Discounts</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {currentData.map((r, index) => {

                  const key = `${r.batch?.id}_${r.email}`;
                  const discounts = discountMap[key] || [];

                  return (

                    <tr key={r.id}>

                      <td>{startIndex + index + 1}</td>

                      <td>
                        <b>{r.studentName}</b>
                        <br />
                        <small>{r.email}</small>
                      </td>

                      <td>{r.batch?.batchName}</td>

                      <td>₹ {r.originalFee}</td>

                      <td>₹ {r.finalAmount}</td>

  <td className="text-center">

  {r.discountType === "AUTO_APPLIED" ? (
    <span
      className="badge bg-primary"
      style={{
        minWidth: "120px",
        padding: "6px 12px"
      }}
    >
      AUTO
    </span>

  ) : r.discountType ? (

    <span
      className="badge bg-info"
      style={{
        minWidth: "120px",
        padding: "6px 12px"
      }}
    >
      {r.discountType}
    </span>

  ) : (

    <span
      className="badge bg-secondary"
      style={{
        minWidth: "120px",
        padding: "6px 12px"
      }}
    >
      NOT APPLICABLE
    </span>

  )}

</td>

                      <td>

                       <select
  className="form-select form-select-sm"
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

  {discounts.map((d, index) => {

    const isAuto =
      r.discountType === "AUTO_APPLIED" && index === 0;

    return (
      <option key={d.id} value={d.id}>
        
        {d.type} - {d.name}
        {isAuto ? " (AUTO)" : ""}
      </option>
    );

  })}

</select>

                      </td>

                      <td>
                        <span className={badge(r.status)}>
                          {r.status}
                        </span>
                      </td>

                      {/* PREMIUM ACTION MENU */}

                      <td>

                        {r.status === "PENDING" ? (

                          <div className="dropdown">

                            <button
                              className="btn btn-light border rounded-circle"
                              data-bs-toggle="dropdown"
                            >
                              ⋮
                            </button>

                            <ul className="dropdown-menu">

                              <li>

                                <button
                                  className="dropdown-item text-success"
                                  onClick={() => approve(r)}
                                >
                                  ✔ Approve
                                </button>

                              </li>

                              <li>

                                <button
                                  className="dropdown-item text-danger"
                                  onClick={() => reject(r.id)}
                                >
                                  ✖ Reject
                                </button>

                              </li>

                            </ul>

                          </div>

                        ) : (

                          <span className="text-muted">
                            Completed
                          </span>

                        )}

                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

            {/* PAGINATION */}

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