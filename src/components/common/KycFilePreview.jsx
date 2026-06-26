"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FileText, ImageOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

/**
 * Detect if file URL is a PDF
 */
export const isPdfFile = url => {
  if (!url) return false;
  const cleanUrl = url.toLowerCase().split("?")[0].split("#")[0];
  return cleanUrl.endsWith(".pdf");
};

export const isImageFile = url => {
  if (!url) return false;
  const cleanUrl = url.toLowerCase().split("?")[0].split("#")[0];
  return [".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".svg"].some(extension =>
    cleanUrl.endsWith(extension)
  );
};

/**
 * File thumbnail component for KYC documents
 * Supports both images and PDFs
 */
export const KycFileThumbnail = ({ src, alt, onPreview }) => {
  const [failedImageSrc, setFailedImageSrc] = useState("");

  if (!src) {
    return (
      <div className="flex h-16 w-24 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 text-xs font-medium text-muted-foreground">
        No file
      </div>
    );
  }

  const isPdf = isPdfFile(src);
  const isImage = isImageFile(src);

  if (isImage && failedImageSrc !== src) {
    return (
      <button onClick={onPreview} className="overflow-hidden rounded-2xl border border-border">
        <Image
          src={src}
          alt={alt}
          width={96}
          height={64}
          onError={() => setFailedImageSrc(src)}
          className="h-16 w-24 object-cover transition-all hover:scale-105"
        />
      </button>
    );
  }

  if (isPdf) {
    return (
      <button
        onClick={onPreview}
        className="flex h-16 w-24 items-center justify-center rounded-2xl border border-border bg-red-500/10 transition-all hover:bg-red-500/20"
        title="Click to open PDF"
      >
        <FileText className="h-6 w-6 text-red-500" />
      </button>
    );
  }

  return (
    <div
      className="flex h-16 w-24 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 text-xs font-medium text-muted-foreground"
      title={isImage ? "Image preview unavailable" : "Unsupported file"}
    >
      <ImageOff className="mb-1 h-5 w-5" />
      No preview
    </div>
  );
};

/**
 * File preview dialog component
 * Displays images inline and opens PDFs in new tab
 */
export const KycFilePreviewDialog = ({
  open,
  onOpenChange,
  selectedFile,
  fileName = "File Preview",
}) => {
  const [failedPreviewSrc, setFailedPreviewSrc] = useState("");

  if (!selectedFile) return null;

  const isPdf = isPdfFile(selectedFile);
  const isImage = isImageFile(selectedFile);
  const canPreviewImage = isImage && failedPreviewSrc !== selectedFile;

  const handleOpen = () => {
    window.open(selectedFile, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl rounded-3xl border border-border bg-background p-4 overflow-hidden">
        <DialogTitle className="sr-only">{fileName}</DialogTitle>

        {canPreviewImage ? (
          <div className="overflow-hidden rounded-2xl">
            <Image
              src={selectedFile}
              alt={fileName}
              width={1200}
              height={800}
              onError={() => setFailedPreviewSrc(selectedFile)}
              className="max-h-[80vh] w-full rounded-2xl object-contain"
            />
          </div>
        ) : isPdf ? (
          <div className="flex h-80 items-center justify-center rounded-2xl bg-muted">
            <div className="text-center">
              <FileText className="mx-auto h-16 w-16 text-red-500" />
              <p className="mt-4 font-medium text-foreground">PDF Document</p>
              <p className="text-sm text-muted-foreground">
                Click the button below to open in a new tab
              </p>
              <button
                onClick={handleOpen}
                className="mt-6 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Open PDF
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-80 items-center justify-center rounded-2xl bg-muted">
            <div className="text-center">
              <ImageOff className="mx-auto h-16 w-16 text-muted-foreground" />
              <p className="mt-4 font-medium text-foreground">Preview unavailable</p>
              <p className="text-sm text-muted-foreground">
                This file is not a PDF, and the image could not be loaded.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
