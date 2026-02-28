import { useHistory } from "react-router-dom";

const AdmissionLandingPage = () => {

  const history = useHistory();

  return (

    <div
      className="container-fluid p-0"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(-45deg,#e3f2fd,#b2dfdb,#e1f5fe,#dcedc8)",
        backgroundSize: "400% 400%",
        animation: "gradientMove 12s ease infinite",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >

      <div className="container">

        <div className="row justify-content-center">

          <div className="col-md-8">

            <div
              style={{
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(15px)",
                padding: "40px",
                borderRadius: "25px",
                boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
                textAlign: "center"
              }}
            >

              {/* TITLE */}
              <h1 className="fw-bold mb-3">
                🎓 Modular Admission Portal
              </h1>

              <p
                className="text-muted mb-4"
                style={{ fontSize: "17px" }}
              >
                Join our industry-focused training batches.
                Register for admission or check your status.
              </p>

              {/* BUTTONS */}
              <div className="d-flex justify-content-center gap-3 flex-wrap">

                <button
                  className="btn btn-primary btn-lg px-4"
                  style={{ borderRadius: "12px" }}
                  onClick={() =>
                    history.push("/admission/register")
                  }
                >
                  🚀 Admission Registration
                </button>

                <button
                  className="btn btn-success btn-lg px-4"
                  style={{ borderRadius: "12px" }}
                  onClick={() =>
                    history.push("/admission/status")
                  }
                >
                  📊 Check Admission Status
                </button>

              </div>

              {/* FOOTER INFO */}
              <div className="mt-4 text-muted">
                <small>
                  ✔ Morning / Afternoon / Evening Batches  
                  • Online & Offline Available
                </small>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdmissionLandingPage;