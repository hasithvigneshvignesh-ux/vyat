'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import { formatGoogleDriveUrl } from '@/lib/drive-utils';
import DriveEmbedPlayer from './drive-embed-player';

interface Props {
  value: string;
  onChange: (url: string, driveFileId: string | null) => void;
  label?: string;
  helpText?: string;
}

export default function DriveLinkInput({ 
  value, 
  onChange, 
  label = "Video Link (Google Drive or YouTube)", 
  helpText = "Paste a Google Drive share link or a YouTube video URL." 
}: Props) {
  const [inputValue, setInputValue] = useState(value);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);

  useEffect(() => {
    setInputValue(value);
    const { embedUrl, isValid } = formatGoogleDriveUrl(value);
    if (isValid) {
      setEmbedUrl(embedUrl);
    } else {
      setEmbedUrl(null);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    const { embedUrl, fileId, isValid } = formatGoogleDriveUrl(val);
    if (isValid) {
      setEmbedUrl(embedUrl);
      onChange(val, fileId);
    } else {
      setEmbedUrl(null);
      onChange(val, null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 dark:text-slate-200">
          {label}
        </label>
        <Input 
          type="url" 
          value={inputValue} 
          onChange={handleChange} 
          placeholder="https://drive.google.com/... or https://youtube.com/..." 
          className="w-full"
        />
        {helpText && (
          <p className="text-xs text-slate-500 mt-1">{helpText}</p>
        )}
      </div>
      
      {embedUrl && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2 dark:text-slate-200">Live Preview</p>
          <DriveEmbedPlayer embedUrl={embedUrl} />
        </div>
      )}
    </div>
  );
}
