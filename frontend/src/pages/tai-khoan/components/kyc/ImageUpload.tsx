"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, File, X } from "lucide-react";

interface FileUploadProps {
  onUpload: (fileName: string, preview: string | null) => void;
  onCancel: () => void;
}

export function FileUpload({ onUpload, onCancel }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File | null) => {
    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File quá lớn. Vui lòng chọn file nhỏ hơn 5MB");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Vui lòng chọn file ảnh (JPG, PNG)");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsUploading(false);

    onUpload(selectedFile.name, imagePreview);
    setSelectedFile(null);
    setImagePreview(null);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/30 hover:border-muted-foreground/50"
        }`}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">
          Kéo thả tệp của bạn vào đây
        </p>
        <p className="text-xs text-muted-foreground mt-1">hoặc</p>
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-primary underline hover:opacity-80 p-0 bg-transparent"
        >
          Chọn từ máy tính
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="rounded-lg overflow-hidden border border-border">
          <img
            src={imagePreview || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-auto max-h-64 object-cover"
          />
        </div>
      )}

      {/* Selected File */}
      {selectedFile && (
        <div className="bg-secondary/50 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <File className="w-4 h-4 text-muted-foreground" />
            <div className="text-sm">
              <p className="font-medium text-foreground truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedFile(null);
              setImagePreview(null);
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="flex-1"
        >
          {isUploading ? "Đang tải lên..." : "Xác Nhận Tải Lên"}
        </Button>
        <Button onClick={onCancel} variant="outline" className="flex-1">
          Hủy
        </Button>
      </div>
    </div>
  );
}
