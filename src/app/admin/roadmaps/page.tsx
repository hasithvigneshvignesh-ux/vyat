import Card from '@/components/ui/Card';

export default function AdminRoadmapsPage() {
  return (
    <div className="page-container space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Roadmaps</h1>
      <Card><p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Roadmap management — create and manage learning paths with ordered skills.</p></Card>
    </div>
  );
}
