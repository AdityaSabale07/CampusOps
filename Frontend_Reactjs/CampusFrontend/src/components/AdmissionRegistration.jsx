import axios from "../api/axiosConfig";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AdmissionRegistration = () => {

  const [batches, setBatches] = useState([]);

  const [form, setForm] = useState({
    studentName: "",
    email: "",
    phone: "",
    batchId: ""
  });

  // ================= LOAD BATCHES =================

  const loadBatches = async () => {
    try {
      const resp = await axios.get("/api/batches");
      setBatches(resp.data);
    } catch (err) {
      toast.error("Failed to load batches");
    }
  };

  useEffect(() => {
    loadBatches();
  }, []);

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ================= SUBMIT =================

  const submit = async (e) => {

    e.preventDefault();

    if (!form.batchId) {
      toast.error("Please select batch");
      return;
    }

    try {

      await axios.post(
        "/api/modular-registration",
        form
      );

      toast.success("🎉 Admission submitted successfully!");

      setForm({
        studentName: "",
        email: "",
        phone: "",
        batchId: ""
      });

    } catch (err) {
      toast.error("Registration failed");
    }
  };

  // ================= UI =================

  return (

    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-6">

          <div className="card shadow">

            <div className="card-body">

              <h3 className="text-center mb-4">
                🎓 Admission Registration
              </h3>

              <form onSubmit={submit}>

                <div className="mb-3">
                  <label>Name</label>
                  <input
                    type="text"
                    name="studentName"
                    value={form.studentName}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label>Select Batch</label>

                  <select
                    name="batchId"
                    value={form.batchId}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">
                      -- Select Batch --
                    </option>

                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.batchName}
                      </option>
                    ))}

                  </select>
                </div>

                <button
                  className="btn btn-primary w-100"
                  type="submit"
                >
                  🚀 Submit Admission
                </button>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdmissionRegistration;