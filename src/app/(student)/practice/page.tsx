import { Metadata } from 'next';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Code, Terminal, Play, AlertCircle } from 'lucide-react';

export const metadata: Metadata = { title: 'Practice — Vyat' };

export default function PracticePage() {
  return (
    <div className="page-container space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Online Compiler
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
          Write, compile, and run code directly in your browser
        </p>
      </div>

      {/* Language selector */}
      <div className="flex gap-2 flex-wrap">
        {['Python', 'C', 'C++', 'Java'].map((lang, idx) => (
          <button
            key={lang}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              idx === 0 ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'hover:bg-[var(--bg-tertiary)]'
            }`}
            style={idx !== 0 ? { borderColor: 'var(--border-primary)', color: 'var(--text-secondary)' } : undefined}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Editor area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Code editor */}
        <Card padding="none" className="overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
            <div className="flex items-center gap-2">
              <Code size={16} style={{ color: 'var(--text-tertiary)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>main.py</span>
            </div>
            <Badge variant="info">Python</Badge>
          </div>
          <div className="p-4 min-h-[400px]" style={{ backgroundColor: 'var(--bg-tertiary)', fontFamily: 'var(--font-mono)' }}>
            <textarea
              className="w-full h-full min-h-[380px] bg-transparent text-sm resize-none outline-none"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', lineHeight: 1.7 }}
              placeholder="# Write your code here...&#10;&#10;def hello():&#10;    print('Hello, World!')&#10;&#10;hello()"
              spellCheck={false}
            />
          </div>
        </Card>

        {/* Output */}
        <Card padding="none" className="overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
            <div className="flex items-center gap-2">
              <Terminal size={16} style={{ color: 'var(--text-tertiary)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Output</span>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500 text-white hover:bg-emerald-400 transition-colors">
              <Play size={12} /> Run
            </button>
          </div>
          <div className="p-4 min-h-[400px]" style={{ backgroundColor: '#0d1117' }}>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={14} className="text-amber-400" />
              <p className="text-xs text-amber-400">
                Compiler service is in development mode. Code execution will be available soon.
              </p>
            </div>
            <pre className="text-sm text-emerald-400" style={{ fontFamily: 'var(--font-mono)' }}>
              {'>'} Ready for execution...
            </pre>
          </div>
        </Card>
      </div>

      {/* Info */}
      <Card className="!p-4">
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          The online compiler uses a secure sandboxed execution environment. Supported languages: Python, C, C++, Java.
          Code is executed server-side and output is streamed back in real-time.
        </p>
      </Card>
    </div>
  );
}
