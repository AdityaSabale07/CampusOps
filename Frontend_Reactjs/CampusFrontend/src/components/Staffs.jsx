import axios from "../api/axiosConfig";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import AdminNav from "./AdminNav";

const Staffs = () => {

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [openAction, setOpenAction] = useState(null);

  const dropdownRef = useRef();

  useEffect(() => {
    fetchData();

    // 🔥 CLOSE DROPDOWN ON OUTSIDE CLICK
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpenAction(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);

  }, []);

  const fetchData = async () => {
    try {
      const resp = await axios.get("/api/users/staff");
      setData(resp.data);
    } catch {
      toast.error("Failed to load staff");
    }
  };

  const deleteStaff = async (userid) => {
    if (!window.confirm("Delete this staff?")) return;

    try {
      await axios.delete(`/api/users/${userid}`);
      toast.success("Staff deleted");

      setData(data.filter((x) => x.userid !== userid));

      // 🔥 CLOSE DROPDOWN AFTER DELETE
      setOpenAction(null);

    } catch {
      toast.error("Delete failed");
    }
  };

  // SEARCH FILTER
  const filteredData = data.filter((x) =>
    x.uname?.toLowerCase().includes(search.toLowerCase()) ||
    x.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="container-fluid p-0"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(-45deg, #e3f2fd, #b2dfdb, #e1f5fe, #dcedc8)",
        backgroundSize: "400% 400%",
        animation: "gradientMove 12s ease infinite"
      }}
    >

      <style>
        {`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        `}
      </style>

      <div className="row g-0">

        {/* Sidebar */}
        <div className="col-md-2">
          <AdminNav />
        </div>

        {/* Main */}
        <div className="col-md-10 p-4">

          {/* ===== HEADER CARD (SEPARATE DIV) ===== */}
          <div
            style={{
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(15px)",
              padding: "25px",
              borderRadius: "20px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
              marginBottom: "15px"
            }}
          >

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold m-0">👨‍🏫 Staff Management</h4>

              <div
                style={{
                  background: "#4caf50",
                  color: "white",
                  padding: "8px 18px",
                  borderRadius: "30px",
                  fontWeight: "600"
                }}
              >
                Total: {filteredData.length}
              </div>
            </div>

            <input
              type="text"
              placeholder="🔍 Search by name or email..."
              className="form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ borderRadius: "12px" }}
            />

          </div>

          {/* ===== TABLE CARD (SEPARATE DIV) ===== */}
          <div
            style={{
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(15px)",
              padding: "25px",
              borderRadius: "20px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.1)"
            }}
          >

            <table className="table align-middle">
              <thead>
                <tr className="text-secondary">
                  <th>#</th>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Gender</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Staff ID</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((x, index) => (
                  <tr key={x.userid}>
                    <td>{index + 1}</td>
                    <td>{x.email}</td>
                    <td>{x.uname}</td>
                    <td>{x.course?.coursename || "-"}</td>
                    <td>{x.gender}</td>
                    <td>{x.address}</td>
                    <td>{x.phone}</td>
                    <td>{x.staffid}</td>

                    <td
                      className="text-center"
                      style={{ position: "relative" }}
                    >
                      <button
                        className="btn btn-light btn-sm"
                        onClick={() =>
                          setOpenAction(
                            openAction === x.userid ? null : x.userid
                          )
                        }
                      >
                        ⋮
                      </button>

                      {openAction === x.userid && (
                        <div
                          ref={dropdownRef}
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "35px",
                            background: "white",
                            borderRadius: "12px",
                            padding: "10px",
                            minWidth: "140px",
                            boxShadow:
                              "0 15px 35px rgba(0,0,0,0.15)",
                            zIndex: 9999,
                            animation: "fadeIn 0.2s ease"
                          }}
                        >
                          <button
                            className="btn btn-danger btn-sm w-100"
                            onClick={() =>
                              deleteStaff(x.userid)
                            }
                          >
                            🗑 Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center text-muted">
                      No staff found
                    </td>
                  </tr>
                )}

              </tbody>
            </table>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Staffs;
