import { Button, Input, Select } from "@sakaniui/react";

export function AddRepositoryPreview({ onClose }: { onClose: () => void }) {
  return (
    <section className="panel" aria-labelledby="add-repository">
      <h2 id="add-repository">Add repository</h2>
      <p className="section-note">Preview only. Nothing is verified or saved. Sakani Modal locks the page, so this form stays inline.</p>
      <div className="form-grid">
        <Input label="Repository URL" disabled value="https://github.com/example/react" />
        <Select label="Provider type" disabled value="github" options={[{ value: "github", label: "GitHub" }]} />
        <Select label="Authentication method" disabled value="reference" options={[{ value: "reference", label: "Credential reference" }]} />
        <Input label="Credential reference" disabled value="github-sample" description="A name only. Nothing is stored." />
        <Input label="Access token" disabled value="sln_••••••••" description="Masked sample. A real secret is not entered or stored." />
        <Input label="Default branch" disabled value="main" />
        <Input label="Optional cache configuration" disabled value="Use the node-a cache sample" />
      </div>
      <div className="confirm-review">
        <h3>Connection verification</h3>
        <p className="section-note">Not checked. This step would look at the URL and credential reference. It does not contact a remote.</p>
      </div>
      <div className="detail-actions inert-actions">
        <Button type="button" variant="outline" onClick={onClose}>
          Close preview
        </Button>
        <Button type="button" variant="outline" disabled>
          Verify connection
        </Button>
        <Button type="button" variant="primary" disabled>
          Save repository
        </Button>
      </div>
    </section>
  );
}
