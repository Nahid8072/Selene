import { DonutChart, Progress } from "@sakaniui/react";
import { freeBytes, storageSummary, usedBytes } from "../../fixtures/cache.ts";

export function CacheStorageBreakdown() {
  return (
    <section className="panel" aria-labelledby="cache-storage">
      <h2 id="cache-storage">Storage</h2>
      <p className="section-note">
        Capacity {storageSummary.capacity}. Used {storageSummary.used}. Free {storageSummary.free}. Cached objects{" "}
        {storageSummary.objects}.
      </p>
      <DonutChart
        data={[
          { label: "Used", value: usedBytes / 1_000_000_000 },
          { label: "Free", value: freeBytes / 1_000_000_000 },
        ]}
        centerValue={`${storageSummary.usedRatio}%`}
        centerCaption="used"
        height={180}
      />
      <Progress value={storageSummary.usedRatio} label="Used capacity" size="sm" />
    </section>
  );
}
