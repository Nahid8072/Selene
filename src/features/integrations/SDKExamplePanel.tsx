import { useState } from "react";
import { CodeSnippet, Tabs } from "@sakaniui/react";
import { contractLabel, sdkSamples, sdkTabs, type SdkId } from "../../fixtures/integrations.ts";

export function SDKExamplePanel() {
  const [sdk, setSdk] = useState<SdkId>("go");
  const sample = sdkSamples[sdk];
  return (
    <section className="panel" aria-labelledby="sdk-examples">
      <h2 id="sdk-examples">SDKs and examples</h2>
      <p className="section-note">{contractLabel} These are not installed products, and this page does not install them.</p>
      <Tabs items={sdkTabs.map((item) => ({ value: item.value, label: item.label }))} value={sdk} onChange={(next) => setSdk(next as SdkId)} />
      <h3>Install preview</h3>
      <div className="snippet-scroll">
        <CodeSnippet code={sample.install} />
      </div>
      {sample.examples.map((example) => (
        <div key={example.title}>
          <h3>{example.title}</h3>
          <div className="snippet-scroll">
            <CodeSnippet code={example.code} />
          </div>
        </div>
      ))}
    </section>
  );
}
