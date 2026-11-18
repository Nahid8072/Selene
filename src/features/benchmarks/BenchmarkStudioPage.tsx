import { useState } from "react";
import { Alert, Button } from "@sakaniui/react";
import { benchmarkDraft } from "../../fixtures/benchmarks.ts";
import { BenchmarkConfigPanel, type BenchmarkConfig } from "./BenchmarkConfigPanel.tsx";
import { ExecutionPreview } from "./ExecutionPreview.tsx";
import { ExperimentSummary } from "./ExperimentSummary.tsx";
import { PreflightValidation } from "./PreflightValidation.tsx";
import { ResourceConstraintPanel } from "./ResourceConstraintPanel.tsx";
import { WorkloadProfileEditor } from "./WorkloadProfileEditor.tsx";

export default function BenchmarkStudioPage() {
  const [config, setConfig] = useState<BenchmarkConfig>(benchmarkDraft);
  return (
    <div className="page-stack page-stack--tight">
      <header className="page-header">
        <div>
          <h1>Benchmark Studio</h1>
          <p>Design reproducible experiments to evaluate Git repository access and shared-cache performance under concurrent agent workloads.</p>
        </div>
      </header>
      <Alert
        color="neutral"
        title="Illustrative data"
        description="This studio configures an experiment. It does not run the orchestrator, the workload simulator, or the benchmark runner."
      />
      <section className="panel" aria-label="Benchmark responsibilities">
        <p className="section-note">
          Benchmark Studio is the configuration and monitoring surface. A benchmark orchestrator would coordinate the
          experiment. The workload simulator is a separate module; this page only sets its profile. A benchmark runner
          would execute the conventional Git baseline and the Selene candidate. Collected measurements belong on
          Benchmark Results, which is not this screen. The host is node-a. This note is not a deployment diagram.
        </p>
      </section>
      <div className="detail-layout">
        <BenchmarkConfigPanel value={config} onChange={setConfig} />
        <ExperimentSummary value={config} />
      </div>
      <div className="detail-layout">
        <WorkloadProfileEditor value={config} onChange={setConfig} />
        <ResourceConstraintPanel value={config} onChange={setConfig} />
      </div>
      <div className="detail-layout">
        <PreflightValidation />
        <section className="panel" aria-labelledby="run-controls">
          <h2 id="run-controls">Run controls</h2>
          <p className="section-note">Compact summary is on the right of the configuration. These controls do not run.</p>
          <div className="detail-actions">
            <Button type="button" variant="primary" size="sm" disabled>
              Start Benchmark
            </Button>
            <Button type="button" variant="outline" size="sm" disabled>
              Stop Benchmark
            </Button>
            <Button type="button" variant="secondary" size="sm" disabled>
              Save Configuration
            </Button>
            <Button type="button" variant="secondary" size="sm" disabled>
              Schedule Run
            </Button>
          </div>
        </section>
      </div>
      <ExecutionPreview />
    </div>
  );
}
