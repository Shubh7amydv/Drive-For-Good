import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./features/public/pages/LandingPage";
import FAQPage from "./features/public/pages/FAQPage";
import CharitiesPage from "./features/public/pages/CharitiesPage";
import LegalPage from "./features/public/pages/LegalPage";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import AdminPage from "./features/admin/pages/AdminPage";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/faq", element: <FAQPage /> },
  { path: "/charities", element: <CharitiesPage /> },
  { path: "/legal", element: <LegalPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute adminOnly>
        <AdminPage />
      </ProtectedRoute>
    )
  }
]);
