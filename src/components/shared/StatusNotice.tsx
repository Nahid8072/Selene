import { EmptyState } from "@sakaniui/react";

export function StatusNotice({
  kind,
  title,
  description,
}: {
  kind: "empty" | "loading" | "error";
  title: string;
  description: string;
}) {
  if (kind === "loading") {
    return <p className="section-note">{title}. {description}</p>;
  }
  return <EmptyState type={kind === "error" ? "error" : "no-data"} title={title} description={description} />;
}
