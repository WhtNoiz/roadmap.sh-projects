import { useRef, useState } from 'react';
import { processStoryUpload, type Story } from '../utils/storyService';

interface StoryUploadButtonProps {
  onUploadSuccess: (story: Story) => void;
}

/** Circular button for uploading a new story; handles upload, loading state, and error messages. */
export function StoryUploadButton({ onUploadSuccess }: StoryUploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const result = await processStoryUpload(file);

      if (result.success) {
        onUploadSuccess(result.story);
      } else {
        setErrorMessage(result.error);
        setTimeout(() => setErrorMessage(null), 5000);
      }
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="relative inline-flex flex-col items-center gap-2">
      <button
        type="button"
        disabled={isUploading}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`w-16 h-16 rounded-full flex items-center justify-center border-2 border-dashed border-gray-400 bg-white hover:bg-gray-50 transition-colors ${
          isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        {isUploading ? (
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-400 border-t-transparent" />
        ) : (
          <svg
            className="w-6 h-6 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {errorMessage !== null && (
        <p className="text-xs text-red-500 max-w-[100px] text-center">{errorMessage}</p>
      )}
    </div>
  );
}
