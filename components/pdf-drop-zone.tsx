import { FileUp } from "lucide-react";
import { dropYourPDFHere } from "@/locales/.generated/server";
import { SupportedLanguage } from "@/locales/.generated/types";
import React from "react";

interface PdfDropZoneProps {
  files: File[];
  isDragging: boolean;
  lng: SupportedLanguage;
  onFileChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { files: FileList | null } }
  ) => void;
  setIsDragging: (dragging: boolean) => void;
  disabled?: boolean;
}

const PdfDropZone = ({
  files,
  isDragging,
  lng,
  onFileChange,
  setIsDragging,
  disabled = false
}: PdfDropZoneProps) => (
  <div
    className={`relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 transition-colors hover:border-muted-foreground/50${disabled ? " pointer-events-none opacity-60" : ""}`}
    onDragOver={(e) => {
      if (disabled) return;
      e.preventDefault();
      setIsDragging(true);
    }}
    onDragExit={() => !disabled && setIsDragging(false)}
    onDragEnd={() => !disabled && setIsDragging(false)}
    onDragLeave={() => !disabled && setIsDragging(false)}
    onDrop={(e) => {
      if (disabled) return;
      e.preventDefault();
      setIsDragging(false);
      onFileChange({ target: { files: e.dataTransfer.files } });
    }}>
    <input
      type="file"
      onChange={onFileChange}
      accept="application/pdf"
      className="absolute inset-0 opacity-0 cursor-pointer"
      disabled={disabled}
    />
    <FileUp className="h-8 w-8 mb-2 text-muted-foreground" />
    <p className="text-sm text-muted-foreground text-center">
      {files.length > 0 ? (
        <span className="font-medium text-foreground">{files[0].name}</span>
      ) : (
        <span>{dropYourPDFHere(lng)}</span>
      )}
    </p>
  </div>
);

export default PdfDropZone;
