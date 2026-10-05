export default function DashboardLoading() {
  return (
    <div className="page-container animate-fade-in pb-12" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* 1. Hero Welcome Banner Skeleton */}
      <div
        className="relative overflow-hidden rounded-3xl p-8 sm:p-10 lg:p-12 min-h-[340px] flex flex-col justify-center animate-pulse"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            {/* Badges skeleton */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <div style={{ width: 110, height: 26, borderRadius: 999, backgroundColor: 'var(--border-secondary)' }} />
              <div style={{ width: 180, height: 26, borderRadius: 999, backgroundColor: 'var(--border-secondary)' }} />
            </div>

            {/* Title skeleton */}
            <div style={{ width: '70%', height: 36, borderRadius: 8, backgroundColor: 'var(--border-primary)', marginBottom: '12px' }} />

            {/* Subtitle skeleton */}
            <div style={{ width: '90%', height: 20, borderRadius: 6, backgroundColor: 'var(--border-secondary)', marginBottom: '8px' }} />
            <div style={{ width: '60%', height: 20, borderRadius: 6, backgroundColor: 'var(--border-secondary)', marginBottom: '24px' }} />

            {/* Buttons skeleton */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
              <div style={{ width: 160, height: 44, borderRadius: 8, backgroundColor: 'var(--border-primary)' }} />
              <div style={{ width: 180, height: 44, borderRadius: 8, backgroundColor: 'var(--border-secondary)' }} />
            </div>
          </div>

          <div className="lg:col-span-5 w-full">
            <div
              className="rounded-3xl border p-6 flex flex-col justify-between"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                borderColor: 'var(--border-secondary)',
                height: 200,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ width: 100, height: 20, borderRadius: 6, backgroundColor: 'var(--border-primary)' }} />
                <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'var(--border-primary)' }} />
              </div>
              <div style={{ width: '100%', height: 12, borderRadius: 999, backgroundColor: 'var(--border-primary)' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ height: 48, borderRadius: 12, backgroundColor: 'var(--border-primary)' }} />
                <div style={{ height: 48, borderRadius: 12, backgroundColor: 'var(--border-primary)' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Grid Skeleton */}
      <div className="stats-grid">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="stat-card animate-pulse"
            style={{ minHeight: 120 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ width: 90, height: 14, borderRadius: 4, backgroundColor: 'var(--border-secondary)' }} />
                <div style={{ width: 50, height: 36, borderRadius: 6, backgroundColor: 'var(--border-primary)' }} />
              </div>
              <div style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: 'var(--border-secondary)' }} />
            </div>
            <div style={{ width: 110, height: 12, borderRadius: 4, backgroundColor: 'var(--border-secondary)', marginTop: 12 }} />
          </div>
        ))}
      </div>

      {/* 3. Active Skill Programs Skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ width: 220, height: 28, borderRadius: 6, backgroundColor: 'var(--border-primary)', marginBottom: 8 }} />
            <div style={{ width: 340, height: 16, borderRadius: 4, backgroundColor: 'var(--border-secondary)' }} />
          </div>
          <div style={{ width: 120, height: 36, borderRadius: 8, backgroundColor: 'var(--border-secondary)' }} />
        </div>

        <div className="skill-programs-grid">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="skill-card animate-pulse"
              style={{ minHeight: 280 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ width: 110, height: 22, borderRadius: 8, backgroundColor: 'var(--border-secondary)' }} />
                  <div style={{ width: 80, height: 22, borderRadius: 8, backgroundColor: 'var(--border-secondary)' }} />
                </div>
                <div style={{ width: '80%', height: 22, borderRadius: 6, backgroundColor: 'var(--border-primary)' }} />
                <div style={{ width: '100%', height: 14, borderRadius: 4, backgroundColor: 'var(--border-secondary)' }} />
                <div style={{ width: '60%', height: 14, borderRadius: 4, backgroundColor: 'var(--border-secondary)' }} />
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ width: '100%', height: 8, borderRadius: 999, backgroundColor: 'var(--border-secondary)' }} />
                <div style={{ width: '100%', height: 40, borderRadius: 8, backgroundColor: 'var(--border-primary)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
