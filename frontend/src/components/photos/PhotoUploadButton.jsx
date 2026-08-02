import { useRef } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function PhotoUploadButton({ onUpload, isUploading }) {
  const inputRef = useRef(null);

  function handleChange(e) {
    const files = [...e.target.files];
    if (files && files.length > 0) onUpload(files);
    e.target.value = '';
  }

  return (
    <>
      <Button size="sm" onClick={() => inputRef.current?.click()} isLoading={isUploading}>
        <Camera className="h-4 w-4" />
        Thêm ảnh
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={handleChange}
      />
    </>
  );
}
