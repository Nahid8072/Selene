import { StatCard } from "@sakaniui/react";

type MetricCardProps = {
  title: string;
  value: string;
  context: string;
};

export function MetricCard({ title, value, context }: MetricCardProps) {
  return (
    <StatCard title={title} value={value} description={context} trend="flat" variant="minimal" />
  );
}
