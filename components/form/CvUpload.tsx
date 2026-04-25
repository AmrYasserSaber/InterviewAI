"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Textarea } from "@/components/ui/Textarea";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
};

export function CvUpload({ value, onChange, placeholder, minHeight = 200 }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function onFileSelected(file: File | null) {
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/parse-cv", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok || !data.text) {
        throw new Error(data.error || "Failed to upload CV");
      }
      onChange(data.text);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Failed to upload CV");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            void onFileSelected(file);
          }}
        />
        <Button
          type="button"
          variant="neumorphic"
          size="sm"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          <Icon name="upload_file" />
          {isUploading ? "Uploading..." : "Upload CV (PDF/DOCX)"}
        </Button>
        <p className="text-body-sm text-on-surface-variant">optional: upload or paste your CV text below</p>
      </div>
      {uploadError ? (
        <p className="font-body-sm text-body-sm text-error" role="alert">
          {uploadError}
        </p>
      ) : null}
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder ?? "Optional: paste your full resume, LinkedIn summary, or relevant experience details here..."}
        style={{ minHeight: `${minHeight}px` }}
        rows={10}
      />
    </div>
  );
}
