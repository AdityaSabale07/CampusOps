import { Link, useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";

const AdminNav = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const navRef = useRef(null);

    const [timesheetOpen, setTimesheetOpen] = useState(false);
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const [modularOpen, setModularOpen] = useState(false);

    // ================= AUTO OPEN BASED ON ROUTE =================
    useEffect(() => {

        if (
            location.pathname.startsWith("/adminfeedback") ||
            location.pathname.startsWith("/adminschedule") ||
            location.pathname.startsWith("/AdminScheduledList")
        ) {
            setFeedbackOpen(true);
        }

        if (
            location.pathname.startsWith("/log") ||
            location.pathname.startsWith("/timesheets")
        ) {
            setTimesheetOpen(true);
        }

        if (location.pathname.startsWith("/admin")) {
            setModularOpen(true);
        }

    }, [location.pathname]);

    // ================= CLICK OUTSIDE CLOSE =================
    useEffect(() => {

        const handleClickOutside = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                closeAllDropdowns();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);

    }, []);

    // ================= HELPERS =================
    const closeAllDropdowns = () => {
        setTimesheetOpen(false);
        setFeedbackOpen(false);
        setModularOpen(false);
    };

    const toggleDropdown = (type) => {

        setTimesheetOpen(type === "timesheet" ? !timesheetOpen : false);
        setFeedbackOpen(type === "feedback" ? !feedbackOpen : false);
        setModularOpen(type === "modular" ? !modularOpen : false);
    };

    const logout = () => {
        dispatch({ type: "LogOut" });
        localStorage.clear();
        sessionStorage.clear();
        history.push("/");
    };

    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <div
            ref={navRef}
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

                {/* ===== TITLE ===== */}
                <h4 style={titleStyle}>🛠 Admin Panel</h4>

                {/* ===== DASHBOARD ===== */}
                <Link
                    to="/dashboard"
                    className="nav-link"
                    style={navStyle(isActive("/dashboard"))}
                    onClick={closeAllDropdowns}
                >
                    📊 Dashboard
                </Link>

                <hr style={dividerStyle} />

                {/* ===== ADMINISTRATION ===== */}
                <SectionTitle title="🏢 Administration" />

                <Link
                    to="/staffs"
                    className="nav-link"
                    style={navStyle(isActive("/staffs"))}
                    onClick={closeAllDropdowns}
                >
                    👥 Staff Management
                </Link>

                <Link
                    to="/register"
                    className="nav-link"
                    style={navStyle(isActive("/register"))}
                    onClick={closeAllDropdowns}
                >
                    ➕ New Staff Registration
                </Link>

                <Link
                    to="/courses"
                    className="nav-link"
                    style={navStyle(isActive("/courses"))}
                    onClick={closeAllDropdowns}
                >
                    📚 Courses
                </Link>

                <Link
                    to="/modules"
                    className="nav-link"
                    style={navStyle(isActive("/modules"))}
                    onClick={closeAllDropdowns}
                >
                    📦 Modules
                </Link>

                <hr style={dividerStyle} />

                {/* ===== MODULAR ADMISSION ===== */}
                <SectionTitle title="🎓 Modular Admission" />

                <div
                    onClick={() => toggleDropdown("modular")}
                    style={{ ...navStyle(false), cursor: "pointer" }}
                >
                    🎓 Modular Batch {modularOpen ? "▲" : "▼"}
                </div>

                {modularOpen && (
                    <div style={{ paddingLeft: "20px" }}>

                        <Link
                            to="/admin/admission"
                            className="nav-link"
                            style={subNavStyle(isActive("/admin/admission"))}
                            onClick={closeAllDropdowns}
                        >
                            🧾 Admission Approvals
                        </Link>

                        <Link
                            to="/admin/admission-analytics"
                            className="nav-link"
                            style={subNavStyle(isActive("/admin/admission-analytics"))}
                            onClick={closeAllDropdowns}
                        >
                            📊 Admission Analytics
                        </Link>

                        <Link
                            to="/admin/modular-admission-report"
                            className="nav-link"
                            style={subNavStyle(isActive("/admin/modular-admission-report"))}
                            onClick={closeAllDropdowns}
                        >
                            📋 Modular Report
                        </Link>

                        <Link
                            to="/admin/discounts"
                            className="nav-link"
                            style={subNavStyle(isActive("/admin/discounts"))}
                            onClick={closeAllDropdowns}
                        >
                            🎁 Discount Management
                        </Link>

                        <Link
                            to="/admin/batch-revenue"
                            className="nav-link"
                            style={subNavStyle(isActive("/admin/batch-revenue"))}
                            onClick={closeAllDropdowns}
                        >
                            🧾 Batch Revenue
                        </Link>

                        <Link
                            to="/batches"
                            className="nav-link"
                            style={subNavStyle(isActive("/batches"))}
                            onClick={closeAllDropdowns}
                        >
                            🕒 Batches
                        </Link>

                        <Link
                            to="/admin/discount-analytics"
                            className="nav-link"
                            style={subNavStyle(isActive("/admin/discount-analytics"))}
                            onClick={closeAllDropdowns}
                        >
                            📊 Discount Analytics
                        </Link>

                    </div>
                )}

                <hr style={dividerStyle} />

                {/* ===== OPERATIONS ===== */}
                <SectionTitle title="🕒 Operations" />

                <Link
                    to="/tasks"
                    className="nav-link"
                    style={navStyle(isActive("/tasks"))}
                    onClick={closeAllDropdowns}
                >
                    📌 Tasks Assign
                </Link>

                <div
                    onClick={() => toggleDropdown("timesheet")}
                    style={{ ...navStyle(false), cursor: "pointer" }}
                >
                    🕒 Timesheets {timesheetOpen ? "▲" : "▼"}
                </div>

                {timesheetOpen && (
                    <div style={{ paddingLeft: "20px" }}>
                        <Link
                            to="/logAdmin"
                            className="nav-link"
                            style={subNavStyle(isActive("/logAdmin"))}
                            onClick={closeAllDropdowns}
                        >
                            📑 Logs
                        </Link>
                    </div>
                )}

                <hr style={dividerStyle} />

                {/* ===== QUALITY CONTROL ===== */}
                <SectionTitle title="⭐ Quality Control" />

                <div
                    onClick={() => toggleDropdown("feedback")}
                    style={{ ...navStyle(false), cursor: "pointer" }}
                >
                    📝 Feedback System {feedbackOpen ? "▲" : "▼"}
                </div>

                {feedbackOpen && (
                    <div style={{ paddingLeft: "20px" }}>

                        <Link
                            to="/adminfeedbacktemplate"
                            className="nav-link"
                            style={subNavStyle(isActive("/adminfeedbacktemplate"))}
                            onClick={closeAllDropdowns}
                        >
                            📝 Templates
                        </Link>

                        <Link
                            to="/adminschedulefeedback"
                            className="nav-link"
                            style={subNavStyle(isActive("/adminschedulefeedback"))}
                            onClick={closeAllDropdowns}
                        >
                            📅 Schedule Feedback
                        </Link>

                        <Link
                            to="/AdminScheduledList"
                            className="nav-link"
                            style={subNavStyle(isActive("/AdminScheduledList"))}
                            onClick={closeAllDropdowns}
                        >
                            📊 Scheduled List
                        </Link>

                    </div>
                )}

            </div>

        </div>
    );
};


/* ===== COMPONENTS ===== */

const SectionTitle = ({ title }) => (
    <div
        style={{
            paddingLeft: "15px",
            color: "#b2dfdb",
            fontSize: "13px",
            fontWeight: "600",
            marginBottom: "8px",
            marginTop: "10px"
        }}
    >
        {title}
    </div>
);


/* ===== STYLES ===== */

const titleStyle = {
    paddingLeft: "15px",
    color: "white",
    fontWeight: "500"
};

const navStyle = (active) => ({
    paddingLeft: "15px",
    borderRadius: "8px",
    marginBottom: "8px",
    fontSize: "15px",
    background: active ? "rgba(255,255,255,0.15)" : "transparent",
    color: "white"
});

const subNavStyle = (active) => ({
    paddingLeft: "10px",
    borderRadius: "6px",
    marginBottom: "5px",
    background: active ? "rgba(255,255,255,0.12)" : "transparent",
    color: "white",
    fontSize: "14px"
});

const dividerStyle = {
    borderColor: "rgba(255,255,255,0.2)"
};

export default AdminNav;