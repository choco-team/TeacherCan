'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { supabase } from '@/utils/supabase';
import { ImagePlus, Upload, Link, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | undefined) => void;
}

export default function PollImageUpload({ value, onChange }: ImageUploadProps) {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('5MB 이하의 파일만 업로드 가능합니다');
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const filePath = `options/${fileName}`;

      const { error } = await supabase.storage
        .from('poll-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (error) {
        console.error('Upload error:', error);
        alert('업로드 실패: ' + error.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('poll-images')
        .getPublicUrl(filePath);

      onChange(publicUrlData.publicUrl);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('업로드에 실패했습니다');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlConfirm = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput('');
      setMode('upload');
    }
  };

  const handleRemove = () => {
    onChange(undefined);
  };

  if (value) {
    return (
      <div className="relative group inline-block">
        <img
          src={value}
          alt="선택된 이미지"
          className="w-24 h-24 rounded-lg object-cover shadow-md border"
        />
        <button
          type="button"
          onClick={handleRemove}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:scale-110"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 p-2 bg-muted rounded-lg w-fit">
        <button
          type="button"
          className={`px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
            mode === 'upload'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setMode('upload')}
        >
          <Upload className="w-3 h-3" /> 업로드
        </button>
        <button
          type="button"
          className={`px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
            mode === 'url'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setMode('url')}
        >
          <Link className="w-3 h-3" /> URL
        </button>
      </div>

      {mode === 'upload' && (
        <div
          className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">업로드 중...</span>
            </div>
          ) : (
            <div className="space-y-1">
              <ImagePlus className="w-6 h-6 mx-auto text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                클릭하여 이미지 선택
              </p>
              <p className="text-xs text-muted-foreground">5MB 이하</p>
            </div>
          )}
        </div>
      )}

      {mode === 'url' && (
        <div className="flex gap-2">
          <Input
            placeholder="이미지 URL 입력"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="text-sm"
          />
          <Button
            type="button"
            onClick={handleUrlConfirm}
            disabled={!urlInput.trim()}
            size="sm"
          >
            추가
          </Button>
        </div>
      )}
    </div>
  );
}
