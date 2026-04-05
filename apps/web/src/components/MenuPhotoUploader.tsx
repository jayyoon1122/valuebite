'use client';

import { useState } from 'react';
import { Camera, Upload, Loader2, Check, AlertCircle } from 'lucide-react';

interface Props {
  restaurantId: string;
  onAnalysisComplete?: (result: any) => void;
}

export function MenuPhotoUploader({ restaurantId, onAnalysisComplete }: Props) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('uploading');
    setError('');

    try {
      // Convert to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Remove data:image/...;base64, prefix
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setStatus('analyzing');

      // Get EXIF date if available (simplified — just use file lastModified)
      const photoDate = new Date(file.lastModified).toISOString();

      // Send to AI analysis endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/ai/menu-photo/analyze`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('vb_token') || ''}`,
          },
          body: JSON.stringify({
            restaurantId,
            imageBase64: base64,
            photoDate,
          }),
        },
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Analysis failed');
      }

      const data = await response.json();
      setResult(data.data);
      setStatus('done');
      onAnalysisComplete?.(data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze menu photo');
      setStatus('error');
    }
  };

  return (
    <div className="border-2 border-dashed border-[var(--vb-border)] rounded-xl p-4">
      {status === 'idle' && (
        <label className="flex flex-col items-center gap-2 cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-[var(--vb-primary)]/10 flex items-center justify-center">
            <Camera size={24} className="text-[var(--vb-primary)]" />
          </div>
          <span className="text-sm font-medium">Upload Menu Photo</span>
          <span className="text-xs text-[var(--vb-text-secondary)]">
            AI will extract items & prices
          </span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      )}

      {status === 'uploading' && (
        <div className="flex flex-col items-center gap-2">
          <Loader2 size={24} className="animate-spin text-[var(--vb-primary)]" />
          <span className="text-sm">Uploading photo...</span>
        </div>
      )}

      {status === 'analyzing' && (
        <div className="flex flex-col items-center gap-2">
          <Loader2 size={24} className="animate-spin text-purple-500" />
          <span className="text-sm font-medium">AI analyzing menu...</span>
          <span className="text-xs text-[var(--vb-text-secondary)]">
            Extracting items, prices, and nutritional info
          </span>
        </div>
      )}

      {status === 'done' && result && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-green-600">
            <Check size={20} />
            <span className="font-medium">
              {result.itemsExtracted} items extracted!
            </span>
          </div>
          <p className="text-xs text-[var(--vb-text-secondary)]">
            Language: {result.language} | Confidence: {Math.round(result.confidence * 100)}%
          </p>
          {result.warnings?.length > 0 && (
            <div className="text-xs text-orange-600">
              {result.warnings.map((w: string, i: number) => (
                <p key={i} className="flex items-center gap-1">
                  <AlertCircle size={12} /> {w}
                </p>
              ))}
            </div>
          )}
          <button
            onClick={() => { setStatus('idle'); setResult(null); }}
            className="text-xs text-[var(--vb-primary)] font-medium hover:underline"
          >
            Upload another photo
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle size={20} />
            <span className="text-sm">{error}</span>
          </div>
          <button
            onClick={() => { setStatus('idle'); setError(''); }}
            className="text-xs text-[var(--vb-primary)] font-medium hover:underline"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
