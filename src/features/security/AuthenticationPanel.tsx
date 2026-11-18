import { Button } from "@sakaniui/react";
import { authConfiguration, credentialReferences, secretNote, tokenRotation } from "../../fixtures/security.ts";
import { TokenTable } from "./TokenTable.tsx";

export function AuthenticationPanel() {
  return (
    <section className="panel" aria-labelledby="authentication">
      <h2 id="authentication">Authentication</h2>
      <p className="section-note">{secretNote} Create, revoke, and rotate do not run.</p>
      <div className="detail-actions inert-actions">
        <Button type="button" variant="primary" disabled>
          Create token
        </Button>
        <Button type="button" variant="outline" disabled>
          Rotate
        </Button>
      </div>
      <h3>API tokens</h3>
      <TokenTable />
      <h3>Credential references</h3>
      <div className="span-table security-table">
        <table className="matrix">
          <thead>
            <tr>
              <th>Name</th>
              <th>Provider</th>
              <th>Associated repository or service</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {credentialReferences.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.provider}</td>
                <td className="commit-sha">{item.target}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3>Authentication configuration</h3>
      <dl className="detail-meta detail-meta--stack">
        {authConfiguration.map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
      <h3>Token rotation</h3>
      <dl className="detail-meta detail-meta--stack">
        {tokenRotation.map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
