import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { useAuth } from "../Auth/AuthContext";
import { PrivateRoute } from "../PrivateRoute";
import { GlobalLoading } from "../Overlays/LoadingOverlay";
import { AdminOnlyWrapper } from "../Components/UniversalComponents/UniversalComponents";
import AboutPage from "../Components/AboutPage/AboutPage";
import ErrorPage from "../Components/ErrorPage/ErrorPage";
import MainPage from "../Components/MainPage/MainPage";
import BugReportPage from "../Components/BugReportPage/BugReportPage";
import CreateReimbursementPage from "../Components/CreateReimbursementPage/CreateReimbursementPage";
import LoginPage from "../Components/LoginPage/LoginPage";
import LogoutPage from "../Components/LogoutPage/LogoutPage";
import AccessDeniedPage from "../Components/AccessDeniedPage/AccessDeniedPage";
import AccountPage from "../Components/AccountPage/AccountPage";
import DetailsPage from "../Components/DetailsPage/DetailsPage";
import PasswordResetPage from "../Components/PasswordResetPage/PasswordResetPage";
import UserDashboardPage from "../Components/UserDashboardPage/UserDashboardPage";
import CreateAccountPage from "../Components/CreateAccountPage/CreateAccountPage";
import NavBar from "../Components/NavBar/NavBar";
import "../universalstyles.css";

function App() {
  const auth = useAuth();

  return (
    <div>
      <Router>
        <NavBar />
        <GlobalLoading />
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute allowedRoles={["Admin", "User"]}>
                <MainPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/userdashboard"
            element={
              <PrivateRoute allowedRoles={["Admin"]}>
                <UserDashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/create"
            element=<PrivateRoute allowedRoles={["Admin", "User"]}>
              <CreateReimbursementPage />
            </PrivateRoute>
          />
          {/*          <Route path="/update" element={<UpdateReimbursementPage />} />
           */}
          <Route
            path="/bugreport"
            element={
              <PrivateRoute allowedRoles={["Admin", "User"]}>
                <BugReportPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/Account/create"
            element={
              <PrivateRoute allowedRoles={["Admin"]}>
                <CreateAccountPage />
              </PrivateRoute>
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/Account/login" element={<LoginPage />} />
          <Route path="/Account/logout" element={<LogoutPage />} />
          <Route path="/Account/accessdenied" element={<AccessDeniedPage />} />
          <Route
            path="/Account/passwordreset"
            element={<PasswordResetPage />}
          />
          <Route path="/details" element={<DetailsPage />} />
          <Route
            path="/Account"
            element={
              <PrivateRoute allowedRoles={["Admin", "User"]}>
                <AccountPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
      <ToastContainer position="bottom-left" autoClose={2000} limit={5} />
    </div>
  );
}

export default App;
