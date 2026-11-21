import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import LandingPage from "./landing/LandingPage.tsx";

// The dashboard preview and its component library CSS load only when a dashboard route is opened,
// so the public landing page stays small.
const DashboardApp = lazy(() => import("./DashboardApp.tsx"));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="*"
        element={
          <Suspense fallback={null}>
            <DashboardApp />
          </Suspense>
        }
      />
    </Routes>
  );
}
