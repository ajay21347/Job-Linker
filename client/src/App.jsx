import Auth from "./pages/Auth";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AdminDashboard from "./pages/AdminDashboard";
import SeekerDashboard from "./pages/SeekerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import JobDetails from "./pages/JobDetails";
import Profile from "./pages/Profile";
import CreateJob from "./pages/CreateJob";
import Applicants from "./pages/Applicants";
import MyApplications from "./pages/MyApplications";
import RecruiterNotifications from "./pages/RecruiterNotifications";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import AppLayout from "./layouts/AppLayout";
import MockInterview from "./pages/MockInterview";
import InterviewDetails from "./pages/history/InterviewDetails";
import HistoryCenter from "./pages/history/HistoryCenter";
import AnalysisDetails from "./pages/history/AnalysisDetails";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import RecruiterLayout from "./pages/recruiter/RecruiterLayout";
import DashboardOverview from "./pages/recruiter/Dashboard";
import JobsManagement from "./pages/recruiter/JobsManagement";
import ApplicantsManagement from "./pages/recruiter/ApplicantsManagement";
import Analytics from "./pages/recruiter/Analytics";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
  },
  {
    path: "/admin-dashboard",
    element: (
      <ProtectedRoute allowedRole="admin">
        <>
          <Navbar />
          <AdminDashboard />
        </>
      </ProtectedRoute>
    ),
  },

  {
    path: "/recruiter-dashboard",
    element: (
      <ProtectedRoute allowedRole="recruiter">
        <Navbar />
        <RecruiterLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardOverview />,
      },

      {
        path: "jobs",
        element: <JobsManagement />,
      },

      {
        path: "applicants",
        element: <ApplicantsManagement />,
      },
      {
        path: "create-job",
        element: <CreateJob />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },

      {
        path: "edit-job/:id",
        element: <CreateJob />,
      },
    ],
  },
  {
    path: "/seeker-dashboard",
    element: (
      <ProtectedRoute allowedRole="seeker">
        <>
          <Navbar />
          <SeekerDashboard />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: "/job/:id",
    element: (
      <>
        <Navbar />
        <JobDetails />
      </>
    ),
  },
  {
    path: "/verify-email/:token",
    element: (
      <>
        <VerifyEmail />
      </>
    ),
  },
  {
    path: "/reset-password/:token",
    element: (
      <>
        <ResetPassword />
      </>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute allowedRole={["seeker", "recruiter"]}>
        <>
          <Navbar />
          <Profile />
        </>
      </ProtectedRoute>
    ),
  },

  {
    path: "/edit-job/:id",
    element: (
      <ProtectedRoute allowedRole="recruiter">
        <>
          <Navbar />
          <CreateJob />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: "/applicants/:jobId",
    element: (
      <>
        <Navbar />
        <Applicants />
      </>
    ),
  },
  {
    path: "/my-applications",
    element: (
      <ProtectedRoute allowedRole="seeker">
        <>
          <Navbar />
          <MyApplications />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: "/recruiter-notifications",
    element: (
      <ProtectedRoute allowedRole="recruiter">
        <>
          <Navbar />
          <RecruiterNotifications />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: "/resume-analysis",
    element: (
      <ProtectedRoute allowedRole="seeker">
        <>
          <Navbar />
          <ResumeAnalysis />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: "/history",
    element: (
      <ProtectedRoute allowedRole="seeker">
        <>
          <Navbar />
          <HistoryCenter />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: "/mock-interview/:jobId",
    element: (
      <ProtectedRoute allowedRole="seeker">
        <>
          <MockInterview />
        </>
      </ProtectedRoute>
    ),
  },

  {
    path: "/history/interview/:id",
    element: (
      <ProtectedRoute allowedRole="seeker">
        <>
          <Navbar />
          <InterviewDetails />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: "/history/analysis/:id",
    element: (
      <ProtectedRoute allowedRole="seeker">
        <>
          <Navbar />
          <AnalysisDetails />
        </>
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return <AppLayout />;
}
export default App;
