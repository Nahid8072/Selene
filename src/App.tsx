import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";
import { StatusNotice } from "./components/shared/StatusNotice.tsx";
import { AppShell } from "./components/shell/AppShell.tsx";

const OverviewPage = lazy(() => import("./features/overview/OverviewPage.tsx"));
const RepositoriesPage = lazy(() => import("./features/repositories/RepositoriesPage.tsx"));
const RepositoryDetailsPage = lazy(() => import("./features/repository-details/RepositoryDetailsPage.tsx"));
const WorkspacesPage = lazy(() => import("./features/workspaces/WorkspacesPage.tsx"));
const WorkspaceDetailsPage = lazy(() => import("./features/workspace-details/WorkspaceDetailsPage.tsx"));
const WorkloadsPage = lazy(() => import("./features/workloads/WorkloadsPage.tsx"));
const WorkloadDetailsPage = lazy(() => import("./features/workload-details/WorkloadDetailsPage.tsx"));
const CacheEnginePage = lazy(() => import("./features/cache/CacheEnginePage.tsx"));
const CacheNodesPage = lazy(() => import("./features/cache-nodes/CacheNodesPage.tsx"));
const BenchmarkStudioPage = lazy(() => import("./features/benchmarks/BenchmarkStudioPage.tsx"));
const BenchmarkResultsPage = lazy(() => import("./features/benchmark-results/BenchmarkResultsPage.tsx"));
const ObservabilityPage = lazy(() => import("./features/observability/ObservabilityPage.tsx"));
const IntegrationsPage = lazy(() => import("./features/integrations/IntegrationsPage.tsx"));
const SecurityPage = lazy(() => import("./features/security/SecurityPage.tsx"));
const SettingsPage = lazy(() => import("./features/settings/SettingsPage.tsx"));

export default function App() {
  return (
    <AppShell>
      <Suspense fallback={<StatusNotice kind="loading" title="Loading" description="The sample view is opening." />}>
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/repositories" element={<RepositoriesPage />} />
          <Route path="/repositories/:id" element={<RepositoryDetailsPage />} />
          <Route path="/workspaces" element={<WorkspacesPage />} />
          <Route path="/workspaces/:id" element={<WorkspaceDetailsPage />} />
          <Route path="/workloads" element={<WorkloadsPage />} />
          <Route path="/workloads/:id" element={<WorkloadDetailsPage />} />
          <Route path="/cache" element={<CacheEnginePage />} />
          <Route path="/cache/nodes" element={<CacheNodesPage />} />
          <Route path="/benchmarks" element={<BenchmarkStudioPage />} />
          <Route path="/benchmarks/results" element={<BenchmarkResultsPage />} />
          <Route path="/observability" element={<ObservabilityPage />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}
