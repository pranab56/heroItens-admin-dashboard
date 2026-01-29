import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface ImageUploadProps {
  image: File | string | null;
  onImageChange: (image: File | string) => void;
  onRemove: () => void;
}

export const ImageUploadPreview = ({ image, onImageChange, onRemove }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>('');

  useEffect(() => {
    if (image instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(image);
    } else if (typeof image === 'string') {
      setPreview(image);
    } else {
      setPreview('');
    }
  }, [image]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      onImageChange(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      onImageChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="bg-[#1C2936] border-2 border-dashed border-gray-700 rounded-lg hover:border-blue-500 transition-colors cursor-pointer"
      onClick={() => fileInputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {preview ? (
        <div className="relative p-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-3 right-3 z-10 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
          >
            <X size={16} />
          </button>
          <div className="relative h-48 w-full rounded-lg overflow-hidden">
            <Image
              src={preview}
              alt="Banner preview"
              fill
              className="object-cover"
            />
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-blue-400">
            <Upload size={16} />
            <span>Click to change image</span>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center">
          <Upload size={32} className="text-blue-400 mx-auto mb-3" />
          <p className="text-white font-medium mb-1">Click to upload banner image</p>
          <p className="text-gray-400 text-sm mb-2">or drag and drop</p>
          <p className="text-gray-400 text-xs">Recommended size: 1200x400px (PNG, JPG, WEBP)</p>
        </div>
      )}
    </div>
  );
};