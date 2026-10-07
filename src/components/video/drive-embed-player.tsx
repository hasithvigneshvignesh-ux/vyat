import React from 'react';

export default function DriveEmbedPlayer({ embedUrl }: { embedUrl: string | null }) {
  if (!embedUrl) {
    return (
      <div className="aspect-video w-full rounded-xl overflow-hidden shadow bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
        <p>No video available</p>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full rounded-xl overflow-hidden shadow">
      <iframe
        src={embedUrl}
        className="w-full h-full"
        allow="autoplay; encrypted-media; fullscreen"
        allowFullScreen
      />
    </div>
  );
}
