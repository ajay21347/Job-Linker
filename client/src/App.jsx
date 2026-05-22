import Auth from "./pages/Auth";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RecruiterDashboard from "./pages/RecruiterDashboard";
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

const router = createBrowserRouter([
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
        <>
          <Navbar />
          <RecruiterDashboard />
        </>
      </ProtectedRoute>
    ),
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
    path: "/create-job",
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
]);

function App() {
  return <RouterProvider router={router} />;
}
export default App;
