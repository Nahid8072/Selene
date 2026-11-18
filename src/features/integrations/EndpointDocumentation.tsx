import { Badge, CodeSnippet } from "@sakaniui/react";
import { contractLabel, type DocEndpoint } from "../../fixtures/integrations.ts";

export function EndpointDocumentation({ endpoint }: { endpoint: DocEndpoint }) {
  return (
    <div>
      <p>
        <Badge>{endpoint.method}</Badge> {endpoint.name}
      </p>
      <p className="section-note">{endpoint.summary}</p>
      <p className="section-note">{contractLabel}</p>
      <h3>Request preview</h3>
      <div className="snippet-scroll">
        <CodeSnippet code={endpoint.request} />
      </div>
      <h3>Response preview</h3>
      <div className="snippet-scroll">
        <CodeSnippet code={endpoint.response} />
      </div>
      <h3>Code area</h3>
      <div className="snippet-scroll">
        <CodeSnippet code={endpoint.code} />
      </div>
    </div>
  );
}
