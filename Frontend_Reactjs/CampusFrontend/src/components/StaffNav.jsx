import { Link, useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

const StaffNav = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    const logout = () => {
        dispatch({ type: "LogOut" });
        localStorage.clear();
        history.push("/");
    };

    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <div
            style={{
                height: "100vh",
                background: "linear-gradient(180deg,#0f2027,#203a43,#2c5364)",
                padding: "20px 0px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderRight: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "4px 0 20px rgba(0,0,0,0.3)"
            }}
        >
            <div>

                <div className="text-left">
                    <h4
                        style={{
                            paddingLeft: "10px",
                            color: "white",
                            fontWeight: "400",
                            letterSpacing: "1px"
                        }}
                    >
                        👨‍🏫 Staff Panel
                    </h4>
                </div>

                <Link
                    to="/staffdashboard"
                    className="nav-link"
                    style={navStyle(isActive("/staffdashboard"))}
                >
                    📊 Dashboard
                </Link>

                <Link
                    to="/logs"
                    className="nav-link"
                    style={navStyle(isActive("/logs"))}
                >
                    📑 My Logs
                </Link>

                {/* ✅ NEW ROUTER PAGE */}
                <Link
                    to="/router-logs"
                    className="nav-link"
                    style={navStyle(isActive("/router-logs"))}
                >
                    🛂 Verify Logs
                </Link>

                <Link
                    to="/logHours"
                    className="nav-link"
                    style={navStyle(isActive("/logHours"))}
                >
                    ➕ Add Log
                </Link>

                <Link
                    to="/stafffeedback"
                    className="nav-link"
                    style={navStyle(isActive("/stafffeedback"))}
                >
                    📋 My Feedback
                </Link>

                <Link
                    to="/updateProfile"
                    className="nav-link"
                    style={navStyle(isActive("/updateProfile"))}
                >
                    ✏ Edit Profile
                </Link>

                <hr style={{ borderColor: "rgba(255,255,255,0.2)" }} />

            </div>
        </div>
    );
};

const navStyle = (active) => ({
    paddingLeft: "10px",
    borderRadius: "10px",
    marginBottom: "8px",
    fontSize: "15px",
    background: active
        ? "rgba(255,255,255,0.15)"
        : "transparent",
    color: "white",
    transition: "0.3s",
    fontWeight: "500"
});

export default StaffNav;
