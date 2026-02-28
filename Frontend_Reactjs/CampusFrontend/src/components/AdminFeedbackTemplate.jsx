import axios from "../api/axiosConfig";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import AdminNav from "./AdminNav";

const AdminFeedbackTemplate = () => {

  const [templates, setTemplates] = useState([]);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [openAction, setOpenAction] = useState(null);

  const dropdownRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
    loadTemplates();

    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpenAction(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const loadTemplates = async () => {
    try {
      const resp = await axios.get(
        "/api/feedback/admin/template"
      );
      setTemplates(resp.data);
    } catch {
      toast.error("Failed to load templates");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Template name required");
      return;
    }

    try {
      await axios.post(
        "/api/feedback/admin/template",
        { title: name.trim() }
      );

      toast.success("Template created successfully");
      setName("");
      loadTemplates();

    } catch (err) {
      toast.error(
        err.response?.data ||
        "Failed to create template"
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete template?")) return;

    try {
      await axios.delete(
        `/api/feedback/admin/template/${id}`
      );

      toast.success("Template deleted");
      loadTemplates();

    } catch {
      toast.error("Delete failed");
    }
  };

  const filtered = templates.filter((t) =>
    t.name?.toLowerCase()
      .includes(search.toLowerCase())
  );

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

        {/* MAIN */}
        <div className="col-md-10 p-4">

          {/* HEADER CARD */}
          <div className="premium-card mb-4">

            <div className="d-flex justify-content-between align-items-center">
              <h4>📝 Feedback Templates</h4>

              <span className="badge bg-success fs-6">
                Total: {filtered.length}
              </span>
            </div>

            <input
              type="text"
              className="form-control mt-3"
              placeholder="🔍 Search template..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <div className="row">

            {/* TABLE */}
            <div className="col-md-8">

              <div className="premium-card">

                <table className="table align-middle">

                  <thead>
                    <tr>
                      <th>SR NO</th> {/* 🔥 CHANGED */}
                      <th>Name</th>
                      <th>Questions</th>
                      <th>Status</th>
                      <th className="text-center">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {filtered.map((t, index) => (

                      <tr key={t.id}>

                        <td>{index + 1}</td> {/* 🔥 SERIAL NUMBER */}

                        <td>{t.name}</td>

                        <td>
                          <span className="badge bg-primary">
                            {t.questions?.length || 0}
                          </span>
                        </td>

                        <td>
                          {t.locked ? (
                            <span className="badge bg-danger">
                              Locked
                            </span>
                          ) : (
                            <span className="badge bg-success">
                              Editable
                            </span>
                          )}
                        </td>

                        <td className="text-center position-relative">

                          <button
                            className="btn btn-light btn-sm"
                            onClick={() =>
                              setOpenAction(
                                openAction === t.id
                                  ? null
                                  : t.id
                              )
                            }
                          >
                            ⋮
                          </button>

                          {openAction === t.id && (

                            <div
                              ref={dropdownRef}
                              className="action-dropdown"
                            >

                              <button
                                className="btn btn-info btn-sm w-100 mb-2"
                                onClick={() =>
                                  history.push(
                                    `/admin/template/preview/${t.id}`
                                  )
                                }
                              >
                                👀 Preview
                              </button>

                              {!t.locked && (
                                <button
                                  className="btn btn-primary btn-sm w-100 mb-2"
                                  onClick={() =>
                                    history.push(
                                      `/admin/template/${t.id}/questions`
                                    )
                                  }
                                >
                                  ➕ Edit Questions
                                </button>
                              )}

                              {!t.locked ? (
                                <button
                                  className="btn btn-danger btn-sm w-100"
                                  onClick={() =>
                                    handleDelete(t.id)
                                  }
                                >
                                  🗑 Delete
                                </button>
                              ) : (
                                <button
                                  className="btn btn-secondary btn-sm w-100"
                                  disabled
                                >
                                  🔒 Locked
                                </button>
                              )}

                            </div>
                          )}

                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

            </div>

            {/* CREATE TEMPLATE */}
            <div className="col-md-4">

              <div className="premium-card">

                <h5>➕ Create Template</h5>

                <form onSubmit={handleSubmit}>

                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Template Name"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                  />

                  <button className="btn btn-primary w-100">
                    Save Template
                  </button>

                </form>

              </div>

            </div>

          </div>

        </div>
      </div>

      <style>
        {`
          .premium-card {
            background: rgba(255,255,255,0.9);
            padding: 25px;
            border-radius: 20px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.08);
            position: relative;
          }

          .action-dropdown {
            position: absolute;
            right: 0;
            top: 35px;
            background: white;
            padding: 12px;
            border-radius: 12px;
            width: 200px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            z-index: 9999;
          }
        `}
      </style>

    </div>
  );
};

export default AdminFeedbackTemplate;
