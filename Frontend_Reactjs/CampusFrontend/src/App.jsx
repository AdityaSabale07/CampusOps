// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import store from './store';

import ProtectedRoute from './utils/ProtectedRoute';

// ================= COMPONENTS =================
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CardView from './components/CardView';

import Staffs from './components/Staffs';
import Courses from './components/Courses';
import Modules from './components/Modules';
import Tasks from './components/Tasks';
import LogAdmin from './components/LogAdmin';

import StaffDashboard from './components/StaffDashboard';
import Logs from './components/Logs';
import LogHours from './components/LogHours';
import UpdateProfile from './components/UpdateProfile';
import RouterLogs from './components/RouterLogs';
import EditLog from './components/EditLog';

import StudentFeedback from "./components/StudentFeedback";
import StudentDashboard from "./components/StudentDashboard";
import StudentEditProfile from './components/StudentEditProfile';
import StudentProfile from './components/StudentProfile';

import AdminFeedbackTemplate from './components/AdminFeedbackTemplate';
import AdminAddQuestions from './components/AdminAddQuestions';
import AdminScheduleFeedback from './components/AdminScheduleFeedback';
import AdminScheduledList from './components/AdminScheduledList';
import AdminReportPage from './components/AdminReportPage';
import AdminTemplatePreview from './components/AdminTemplatePreview';
import AdminEditTemplateQuestions from './components/AdminEditTemplateQuestion';

import StaffFeedbackList from './components/StaffFeedbackList';
import StaffFeedbackReport from './components/StaffFeedbackReport';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AdminAdmissionApproval from './components/AdminAdmissionApproval';
import AdmissionRegistration from './components/AdmissionRegistration';
import AdminAdmissionAnalytics from './components/AdminAdmissionAnalytics';
import StudentAdmissionRegistration from './components/StudentAdmissionRegistration';
import StudentAdmissionStatus from "./components/StudentAdmissionStatus";
import AdmissionLandingPage from "./components/AdmissionLandingPage";
import BatchManagement from "./components/BatchManagement";
import AdminModularAdmissionReport from "./components/AdminModularAdmissionReport";
import AdminDiscountManagement from './components/AdminDiscountManagement';
import AdminBatchRevenueReport from "./components/AdminBatchRevenueReport";
import AdminDiscountAnalytics from "./components/AdminDiscountAnalytics";
import FakePaymentPage from './components/FakePaymentPage';
// ================= APP =================

function App() {

  // 🔐 ENTERPRISE SESSION VALIDATION (FIXED)
  useEffect(() => {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // no session → nothing to validate
    if (!token || !role) return;

    try {

      const decoded = jwtDecode(token);

      const expiryTime = decoded.exp * 1000;
      const timeLeft = expiryTime - Date.now();

      // ⭐ TOKEN ALREADY EXPIRED
      if (timeLeft <= 0) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/";
        return;
      }

      // ⭐ AUTO LOGOUT TIMER
      const timer = setTimeout(() => {

        alert("Session expired. Please login again.");

        localStorage.clear();
        sessionStorage.clear();

        window.location.href = "/";

      }, timeLeft);

      return () => clearTimeout(timer);

    } catch (error) {

      // invalid token safety
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    }

  }, []);

  return (
    <Provider store={store}>
      <div className="App">

        <ToastContainer position="top-right" autoClose={5000} />

        <BrowserRouter>
          <Switch>

            {/* ================= PUBLIC ROUTES ================= */}
            <Route component={Login} path="/" exact />
            <Route component={Register} path="/register" />
            <Route component={AdmissionLandingPage} path="/admission" exact />
            <Route component={StudentAdmissionRegistration} path="/admission/register" />
            <Route component={StudentAdmissionStatus} path="/admission/status" />
            <Route path="/fake-payment/:id" component={FakePaymentPage} />
            {/* ================= ADMIN ROUTES ================= */}
            <ProtectedRoute role="ADMIN" component={Dashboard} path="/dashboard" />
            <ProtectedRoute role="ADMIN" component={CardView} path="/cardview" />
            <ProtectedRoute role="ADMIN" component={Staffs} path="/staffs" />
            <ProtectedRoute role="ADMIN" component={Courses} path="/courses" />
            <ProtectedRoute role="ADMIN" component={Modules} path="/modules" />
            <ProtectedRoute role="ADMIN" component={BatchManagement} path="/batches" />
            <ProtectedRoute role="ADMIN" component={Tasks} path="/tasks" />
            <ProtectedRoute role="ADMIN" component={LogAdmin} path="/logAdmin" />

            <ProtectedRoute role="ADMIN" component={AdminFeedbackTemplate} path="/adminfeedbacktemplate" />
            <ProtectedRoute role="ADMIN" component={AdminAddQuestions} path="/adminaddquestions" />
            <ProtectedRoute role="ADMIN" component={AdminEditTemplateQuestions} path="/admin/template/:id/questions" />
            <ProtectedRoute role="ADMIN" component={AdminScheduleFeedback} path="/adminschedulefeedback" />
            <ProtectedRoute role="ADMIN" component={AdminScheduledList} path="/AdminScheduledList" />
            <ProtectedRoute role="ADMIN" component={AdminReportPage} path="/admin/report/:id" />
            <ProtectedRoute role="ADMIN" component={AdminTemplatePreview} path="/admin/template/preview/:id" />
            <ProtectedRoute role="ADMIN" component={AdminAdmissionApproval} path="/admin/admission" />
            <ProtectedRoute role="ADMIN" component={AdminAdmissionAnalytics} path="/admin/admission-analytics" />
            <ProtectedRoute role="ADMIN" component={AdminModularAdmissionReport} path="/admin/modular-admission-report" />
            <ProtectedRoute role="ADMIN" component={AdminDiscountManagement} path="/admin/discounts" />
            <ProtectedRoute role="ADMIN" component={AdminBatchRevenueReport} path="/admin/batch-revenue" />
            <ProtectedRoute role="ADMIN" component={AdminDiscountAnalytics} path="/admin/discount-analytics" />

            {/* ================= STAFF ROUTES ================= */}
            <ProtectedRoute role="STAFF" component={StaffDashboard} path="/staffdashboard" />
            <ProtectedRoute role="STAFF" component={Logs} path="/logs" />
            <ProtectedRoute role="STAFF" component={RouterLogs} path="/router-logs" />
            <ProtectedRoute role="STAFF" component={LogHours} path="/logHours" />
            <ProtectedRoute role="STAFF" component={UpdateProfile} path="/updateProfile" />
            <ProtectedRoute role="STAFF" component={EditLog} path="/editlog/:id" />
            <ProtectedRoute role="STAFF" component={StaffFeedbackList} path="/stafffeedback" exact />
            <ProtectedRoute role="STAFF" component={StaffFeedbackReport} path="/stafffeedback/report/:id" />
            <ProtectedRoute role="STAFF" component={StaffFeedbackReport} path="/staff/report/:id" />

            {/* ================= STUDENT ROUTES ================= */}
            <ProtectedRoute role="STUDENT" component={StudentDashboard} path="/studentdashboard" />
            <ProtectedRoute role="STUDENT" component={StudentFeedback} path="/studentfeedback" />
            <ProtectedRoute role="STUDENT" component={StudentEditProfile} path="/studenteditprofile" />
            <ProtectedRoute role="STUDENT" component={StudentProfile} path="/studentprofile" />

          </Switch>
        </BrowserRouter>

      </div>
    </Provider>
  );
}

export default App;