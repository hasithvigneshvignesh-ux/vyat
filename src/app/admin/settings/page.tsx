import Card from '@/components/ui/Card';
import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="page-container space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <SettingsIcon size={20} style={{ color: 'var(--text-tertiary)' }} />
          <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Platform Settings</h2>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
          Platform settings management coming soon. Configure pricing, access duration, and other platform-wide settings here.
        </p>
      </Card>
    </div>
  );
}
