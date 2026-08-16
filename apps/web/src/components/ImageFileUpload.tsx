"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Upload, CheckCircle2, Loader2, Image as ImageIcon } from "lucide-react";

interface ImageFileUploadProps {
  label: string;
  onImageUploaded: (url: string) => void;
  defaultImage?: string;
}

export default function ImageFileUpload({
  label,
  onImageUploaded,
  defaultImage = "",
}: ImageFileUploadProps) {
  const [preview, setPreview] = useState<string>(defaultImage);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    // Convert file to Base64 Data URL for universal compatibility & instant storage
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result as string;
      setPreview(base64Data);

      try {
        // Attempt Cloudinary upload via API backend signature if available
        const token = typeof window !== "undefined" ? localStorage.getItem("suvidha_admin_token") : "";
        const sigRes = await fetch("http://localhost:5000/api/products/admin/upload-signature", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sigData = await sigRes.json();

        if (sigData.success && sigData.signature) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("api_key", sigData.apiKey);
          formData.append("timestamp", sigData.timestamp);
          formData.append("signature", sigData.signature);
          formData.append("folder", sigData.folder);

          const cloudinaryRes = await fetch(
            `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

          const cloudinaryData = await cloudinaryRes.json();
          if (cloudinaryData.secure_url) {
            setPreview(cloudinaryData.secure_url);
            onImageUploaded(cloudinaryData.secure_url);
            setUploading(false);
            return;
          }
        }
      } catch (err) {
        console.log("Using Base64 fallback for selected image");
      }

      onImageUploaded(base64Data);
      setUploading(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-gray-700">{label}</label>

      <div className="relative border-2 border-dashed border-accent/40 hover:border-ink rounded-lg p-4 bg-gray-50 text-center transition-all cursor-pointer group">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        {preview ? (
          <div className="relative h-44 w-full rounded overflow-hidden border bg-white">
            <Image
              src={preview}
              alt="Selected preview"
              fill
              className="object-cover"
              unoptimized={preview.startsWith("data:")}
            />
            <div className="absolute top-2 right-2 bg-ink/90 text-accent p-1.5 rounded-full shadow">
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin text-accent" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPreview("");
                onImageUploaded("");
              }}
              className="absolute bottom-2 right-2 bg-red-600 text-white p-1.5 text-[10px] rounded font-bold uppercase z-20 shadow"
            >
              Change File
            </button>
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center justify-center text-gray-500 space-y-2">
            <div className="w-10 h-10 rounded-full bg-ink/10 text-ink flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs font-semibold text-ink">Click or drag image file here</p>
              <p className="text-[10px] text-gray-400">PNG, JPG, WEBP up to 10MB</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
