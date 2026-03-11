import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, ImagePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface DragDropImageUploadProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  bucket: string;
  multiple?: boolean;
  className?: string;
  previewSize?: "sm" | "md" | "lg";
  placeholder?: string;
}

const sizeClasses = {
  sm: "h-24 w-24",
  md: "h-32 w-32",
  lg: "h-40 w-full max-w-xs",
};

const previewSizeClasses = {
  sm: "h-16 w-16",
  md: "h-24 w-24",
  lg: "h-32 w-32",
};

export default function DragDropImageUpload({
  value,
  onChange,
  bucket,
  multiple = false,
  className,
  previewSize = "md",
  placeholder = "ছবি আপলোড করুন",
}: DragDropImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const images = Array.isArray(value) ? value : value ? [value] : [];

  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    setUploading(true);
    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file);
      if (!error) {
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
        newUrls.push(urlData.publicUrl);
      }
    }
    if (multiple) {
      onChange([...images, ...newUrls]);
    } else {
      onChange(newUrls[0] || (Array.isArray(value) ? value : value || ""));
    }
    setUploading(false);
  }, [bucket, images, multiple, onChange, value]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) {
      uploadFiles(e.dataTransfer.files);
    }
  }, [uploadFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      uploadFiles(e.target.files);
      e.target.value = "";
    }
  }, [uploadFiles]);

  const removeImage = useCallback((index: number) => {
    if (multiple) {
      onChange(images.filter((_, i) => i !== index));
    } else {
      onChange("");
    }
  }, [images, multiple, onChange]);

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Preview existing images */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((url, i) => (
            <div key={i} className="relative group">
              <img
                src={url}
                alt=""
                className={cn(
                  "rounded-lg object-cover border border-border",
                  previewSizeClasses[previewSize]
                )}
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full h-5 w-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone - show if multiple or no image yet */}
      {(multiple || images.length === 0) && (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all duration-200",
            sizeClasses[previewSize],
            dragOver
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-border hover:border-primary/50 hover:bg-accent/50",
            uploading && "pointer-events-none opacity-60"
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
              <span className="text-xs text-muted-foreground">আপলোড হচ্ছে...</span>
            </>
          ) : (
            <>
              {multiple ? (
                <ImagePlus className="h-6 w-6 text-muted-foreground" />
              ) : (
                <Upload className="h-6 w-6 text-muted-foreground" />
              )}
              <span className="text-xs text-muted-foreground text-center px-2">
                {dragOver ? "ছেড়ে দিন" : placeholder}
              </span>
              <span className="text-[10px] text-muted-foreground/60">
                ক্লিক বা ড্র্যাগ করুন
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
