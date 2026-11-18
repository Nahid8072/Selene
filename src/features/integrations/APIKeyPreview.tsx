import { Input, Select } from "@sakaniui/react";
import { keyPreview, scopeOptions } from "../../fixtures/integrations.ts";

export function APIKeyPreview() {
  return (
    <div className="form-grid">
      <Input label="Name" disabled value={keyPreview.name} />
      <Select label="Scopes" disabled value={keyPreview.scope} options={scopeOptions} />
      <Input label="Expiration" disabled value={keyPreview.expiration} />
      <p className="section-note form-grid__wide">{keyPreview.note}</p>
    </div>
  );
}
