import { useState } from "react";
import { Select, Tabs } from "@sakaniui/react";
import { contractLabel, docCategories } from "../../fixtures/integrations.ts";
import { EndpointDocumentation } from "./EndpointDocumentation.tsx";

export function EndpointExplorer() {
  const [categoryId, setCategoryId] = useState<(typeof docCategories)[number]["id"]>(docCategories[0].id);
  const category = docCategories.find((item) => item.id === categoryId) ?? docCategories[0];
  const [operationId, setOperationId] = useState<string>(category.operations[0].id);
  const operation = category.operations.find((item) => item.id === operationId) ?? category.operations[0];
  return (
    <section className="panel" aria-labelledby="api-docs">
      <h2 id="api-docs">API documentation</h2>
      <p className="section-note">{contractLabel} No request is sent.</p>
      <Select
        label="Category"
        value={category.id}
        options={docCategories.map((item) => ({ value: item.id, label: item.label }))}
        onChange={(next) => {
          const found = docCategories.find((item) => item.id === next);
          if (!found) return;
          setCategoryId(found.id);
          setOperationId(found.operations[0].id);
        }}
      />
      <Tabs
        items={category.operations.map((item) => ({ value: item.id, label: item.name }))}
        value={operation.id}
        onChange={setOperationId}
      />
      <EndpointDocumentation endpoint={operation} />
    </section>
  );
}
