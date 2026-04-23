import Auth from "./pages/Auth";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}
export default App;
