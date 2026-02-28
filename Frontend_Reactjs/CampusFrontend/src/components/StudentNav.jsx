import { Link, useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

const StudentNav = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    const logout = () => {
        dispatch({ type: "LogOut" });
        localStorage.clear();
        history.push("/");
    };

    const isActive = (path) => location.pathname === path;

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
                boxShadow: "4px 0 15px rgba(0,0,0,0.2)"
            }}
        >

            {/* ===== TOP SECTION ===== */}
            <div>

                {/* Logo / Title */}
                <div className="text-left">
                    <h4
                        style={{
                             paddingLeft:"10px",
                            color: "white",
                            fontWeight: "400",
                            letterSpacing: "1px"
                        }}
                    >
                        🎓 Student Panel
                    </h4>
                </div>

                {/* Dashboard */}
                <Link
                    to="/studentdashboard"
                    className="nav-link"
                    style={{
                        padding: "10px ",
                        borderRadius: "8px",
                        marginBottom: "8px",
                          fontSize: "15px",
                        background: isActive("/studentdashboard")
                            ? "rgba(255,255,255,0.15)"
                            : "transparent",
                        color: "white",
                        transition: "0.3s"
                    }}
                >
                    📊 Dashboard
                </Link>


                {/* Profile Section */}
                <Link
                    to="/studentprofile"
                    className="nav-link"
                    style={{
                        paddingLeft:"10px",
                        borderRadius: "8px",
                        marginBottom: "8px",
                          fontSize: "15px",
                        background: isActive("/studentprofile")
                            ? "rgba(255,255,255,0.15)"
                            : "transparent",
                        color: "white"
                    }}
                >
                    👤 My Profile
                </Link>

                <Link
                    to="/studenteditprofile"
                    className="nav-link"
                    style={{
                        paddingLeft:"10px",
                        borderRadius: "8px",
                        marginBottom: "8px",
                          fontSize: "15px",
                        background: isActive("/studenteditprofile")
                            ? "rgba(255,255,255,0.15)"
                            : "transparent",
                        color: "white"
                    }}
                >
                    ✏ Edit Profile
                </Link>

                {/* Feedback */}
                <Link
                    to="/studentfeedback"
                    className="nav-link"
                    style={{
                       paddingLeft:"10px",
                        borderRadius: "8px",
                        marginBottom: "8px",
                          fontSize: "15px",
                        background: isActive("/studentfeedback")
                            ? "rgba(255,255,255,0.15)"
                            : "transparent",
                        color: "white"
                    }}
                >
                    📝 Available Feedback
                </Link>
<hr style={{ borderColor: "rgba(255,255,255,0.2)" }} />
            </div>

        </div>
    );
};

export default StudentNav;
