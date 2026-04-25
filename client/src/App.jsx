import Auth from "./pages/Auth";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RecruiterDashboard } from "./pages/RecruiterDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { SeekerDashboard } from "./pages/SeekerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

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
]);

function App() {
  return <RouterProvider router={router} />;
}
export default App;
