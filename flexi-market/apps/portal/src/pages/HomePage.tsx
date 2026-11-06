import { Button, Card, StatCard } from '@e-burgos/tucu-ui';

export function HomePage() {
  return (
    <div className="space-y-6">
      <Card
        title="portal"
        description="Replace this page with your first SDD-specified view."
      >
        <Button color="primary">Get started</Button>
      </Card>
      <StatCard title="Active users" value="1,284" subtitle="Last 30 days" />
    </div>
  );
}
