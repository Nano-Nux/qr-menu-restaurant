'use client';

import React, { useState, useEffect } from 'react';
import { Link2, HardDrive, Upload, Image as ImageIcon, CheckCircle, AlertCircle, RefreshCw, Sparkles, Database, Cloud } from 'lucide-react';

interface ImageInputPickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function convertGoogleDriveUrl(url: string): { fileId: string | null; directUrl: string | null } {
  if (!url || typeof url !== 'string') return { fileId: null, directUrl: null };
  
  const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    const fileId = fileDMatch[1];
    return {
      fileId,
      directUrl: `https://lh3.googleusercontent.com/u/0/d/${fileId}`
    };
  }

  const idParamMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) {
    const fileId = idParamMatch[1];
    return {
      fileId,
      directUrl: `https://lh3.googleusercontent.com/u/0/d/${fileId}`
    };
  }

  return { fileId: null, directUrl: null };
}

export default function ImageInputPicker({ value, onChange, label = 'Image Source' }: ImageInputPickerProps) {
  const [activeTab, setActiveTab] = useState<'url' | 'gdrive' | 'upload'>('url');
  
  // Inputs
  const [directUrlInput, setDirectUrlInput] = useState(value || '');
  const [gdriveInput, setGdriveInput] = useState('');
  const [convertedGdriveUrl, setConvertedGdriveUrl] = useState('');
  const [gdriveFileId, setGdriveFileId] = useState<string | null>(null);

  // File Upload states
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [storageInfo, setStorageInfo] = useState<{ useSqlite: boolean; cloudinaryConfigured: boolean; mode: string } | null>(null);

  // Fetch storage engine info from backend (/api/upload)
  useEffect(() => {
    fetch('/api/upload')
      .then((res) => res.json())
      .then((data) => setStorageInfo(data))
      .catch((err) => console.error('Failed to get upload config:', err));
  }, []);

  // Update local states when value prop changes externally
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    if (activeTab === 'url') {
      setDirectUrlInput(value || '');
    }
  }

  // Handle Google Drive Link conversion in real time
  const handleGdriveInputChange = (input: string) => {
    setGdriveInput(input);
    const { fileId, directUrl } = convertGoogleDriveUrl(input);
    if (fileId && directUrl) {
      setGdriveFileId(fileId);
      setConvertedGdriveUrl(directUrl);
      onChange(directUrl);
    } else {
      setGdriveFileId(null);
      setConvertedGdriveUrl('');
    }
  };

  // Handle File Upload to /api/upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Upload failed');
      }

      if (data.url) {
        onChange(data.url);
      }
    } catch (err: any) {
      setUploadError(err.message || 'File upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3 bg-[#14120e] p-4 rounded-2xl border border-white/10 text-xs">
      {/* Field Label */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider block">
          {label}
        </label>
        {value && (
          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Image Loaded
          </span>
        )}
      </div>

      {/* 3 Option Tab Switcher */}
      <div className="grid grid-cols-3 gap-1 bg-[#0c0b09] p-1 rounded-xl border border-white/10">
        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`py-2 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'url'
              ? 'bg-[#1f1b14] text-[#c5a059] border border-[#c5a059]/40 shadow'
              : 'text-[#a39783] hover:text-white'
          }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>Image URL</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gdrive')}
          className={`py-2 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'gdrive'
              ? 'bg-[#1f1b14] text-[#c5a059] border border-[#c5a059]/40 shadow'
              : 'text-[#a39783] hover:text-white'
          }`}
        >
          <HardDrive className="w-3.5 h-3.5 text-blue-400" />
          <span>Google Drive</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`py-2 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'upload'
              ? 'bg-[#1f1b14] text-[#c5a059] border border-[#c5a059]/40 shadow'
              : 'text-[#a39783] hover:text-white'
          }`}
        >
          <Upload className="w-3.5 h-3.5 text-emerald-400" />
          <span>Direct Upload</span>
        </button>
      </div>

      {/* OPTION 1: DIRECT IMAGE URL */}
      {activeTab === 'url' && (
        <div className="space-y-2">
          <input
            type="text"
            value={directUrlInput}
            onChange={(e) => {
              setDirectUrlInput(e.target.value);
              onChange(e.target.value);
            }}
            placeholder="Paste direct image link (https://images.unsplash.com/...)"
            className="w-full bg-[#181510] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a059]"
          />
          <span className="text-[10px] text-[#8c8273] block">
            Enter any public image web link (.jpg, .png, .webp).
          </span>
        </div>
      )}

      {/* OPTION 2: GOOGLE DRIVE URL CONVERTER */}
      {activeTab === 'gdrive' && (
        <div className="space-y-2">
          <input
            type="text"
            value={gdriveInput}
            onChange={(e) => handleGdriveInputChange(e.target.value)}
            placeholder="Paste Google Drive shared link (e.g. https://drive.google.com/file/d/.../view?usp=sharing)"
            className="w-full bg-[#181510] border border-blue-500/30 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-400 font-mono"
          />

          {gdriveFileId ? (
            <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 space-y-1">
              <div className="flex items-center gap-2 text-blue-300 font-bold text-[10px]">
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span>Google Drive Share Link Auto-Converted!</span>
              </div>
              <p className="text-[10px] text-gray-300 font-mono break-all line-clamp-1">
                File ID: {gdriveFileId}
              </p>
              <p className="text-[10px] text-blue-200 font-mono break-all line-clamp-2">
                Direct URL: {convertedGdriveUrl}
              </p>
            </div>
          ) : (
            <span className="text-[10px] text-[#8c8273] block">
              Paste any shared Google Drive file link. The system converts it into a direct web image link automatically.
            </span>
          )}
        </div>
      )}

      {/* OPTION 3: DIRECT IMAGE FILE UPLOAD */}
      {activeTab === 'upload' && (
        <div className="space-y-3">
          {/* Storage Engine Indicator */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#0c0b09] border border-white/10 text-[10px]">
            <span className="text-[#a39783]">Active Storage Destination:</span>
            {storageInfo?.useSqlite ? (
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <Database className="w-3 h-3 text-amber-400" /> SQLite Database (.db)
              </span>
            ) : (
              <span className="font-bold text-sky-400 flex items-center gap-1">
                <Cloud className="w-3 h-3 text-sky-400" /> Cloudinary Cloud
              </span>
            )}
          </div>

          <label className="relative border-2 border-dashed border-white/20 hover:border-[#c5a059] rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-[#181510]/60">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {uploading ? (
              <div className="flex items-center gap-2 text-[#c5a059]">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="font-bold text-xs">Uploading to {storageInfo?.useSqlite ? 'SQLite .db' : 'Cloudinary'}...</span>
              </div>
            ) : (
              <>
                <Upload className="w-6 h-6 text-[#c5a059]" />
                <div className="text-center">
                  <span className="font-bold text-xs text-white block">Click or Drag Image File Here</span>
                  <span className="text-[10px] text-[#8c8273]">Supports JPG, PNG, WEBP, GIF (Max 10MB)</span>
                </div>
              </>
            )}
          </label>

          {uploadError && (
            <div className="p-2 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-[10px] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      )}

      {/* LIVE IMAGE PREVIEW */}
      {value && (
        <div className="pt-2 border-t border-white/10 flex items-center gap-3">
          <img
            src={value}
            alt="Preview"
            className="w-16 h-16 rounded-xl object-cover border border-[#c5a059]/40 bg-[#0c0b09] shrink-0"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="overflow-hidden">
            <span className="text-[10px] text-[#c5a059] uppercase font-bold tracking-wider block">Live Selected Image</span>
            <span className="text-[10px] text-[#a39783] font-mono break-all line-clamp-2">{value}</span>
          </div>
        </div>
      )}
    </div>
  );
}
