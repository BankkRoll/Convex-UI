"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle,
  FileAudioIcon,
  FileIcon,
  FileTextIcon,
  FileVideoIcon,
  ImageIcon,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import { type FileError } from "react-dropzone";
import { type UseConvexUploadReturn } from "../hooks/use-convex-upload";

interface FileWithPreview extends File {
  preview?: string;
  errors: readonly FileError[];
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function getFileIcon(type: string): typeof FileIcon {
  if (type.startsWith("image/")) return ImageIcon;
  if (type.startsWith("video/")) return FileVideoIcon;
  if (type.startsWith("audio/")) return FileAudioIcon;
  if (type.startsWith("text/") || type.includes("document"))
    return FileTextIcon;
  return FileIcon;
}

interface DropzoneProps {
  upload: UseConvexUploadReturn;
  className?: string;
}

export function Dropzone({ upload, className }: DropzoneProps) {
  const {
    files,
    setFiles,
    loading,
    errors,
    successes,
    isSuccess,
    onUpload,
    maxFileSize,
    maxFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    open,
  } = upload;

  const removeFile = useCallback(
    (fileName: string) => {
      setFiles(files.filter((f: FileWithPreview) => f.name !== fileName));
    },
    [files, setFiles],
  );

  const hasErrors = useMemo(() => {
    return (
      files.some((f: FileWithPreview) => f.errors.length > 0) ||
      errors.length > 0
    );
  }, [files, errors]);

  const canUpload = useMemo(() => {
    return files.length > 0 && !loading && !hasErrors && !isSuccess;
  }, [files.length, loading, hasErrors, isSuccess]);

  return (
    <div className={cn("space-y-4", className)}>
      <Card
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed cursor-pointer transition-all duration-200 hover:border-primary/50 hover:bg-primary/5",
          isDragActive && "border-primary bg-primary/10 scale-[1.02]",
          loading && "pointer-events-none opacity-50",
        )}
      >
        <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
          <input {...getInputProps()} />
          <div
            className={cn(
              "rounded-full p-4 transition-colors",
              isDragActive ? "bg-primary/20" : "bg-muted",
            )}
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <p className="text-base font-semibold">
              {isDragActive
                ? "Drop your files here"
                : "Drag and drop files here"}
            </p>
            <p className="text-sm text-muted-foreground">
              or{" "}
              <button
                type="button"
                onClick={open}
                className="font-medium text-primary hover:underline focus:outline-hidden"
                disabled={loading}
              >
                click to browse
              </button>
            </p>
          </div>
          <Badge variant="secondary" className="gap-1.5">
            <span className="text-xs">
              Max {maxFiles} file{maxFiles !== 1 ? "s" : ""} • Up to{" "}
              {formatBytes(maxFileSize)} each
            </span>
          </Badge>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <div className="space-y-3">
          {files.map((file: FileWithPreview) => {
            const FileIconComponent = getFileIcon(file.type);
            const hasFileErrors = file.errors.length > 0;
            const uploadError = errors.find(
              (e: { name: string; message: string }) => e.name === file.name,
            );
            const isUploaded = successes.includes(file.name);

            return (
              <Card
                key={file.name}
                className={cn(
                  "transition-all animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
                  hasFileErrors || uploadError
                    ? "border-destructive/50 bg-destructive/5"
                    : isUploaded
                      ? "border-green-500/50 bg-green-500/5"
                      : "",
                )}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div
                    className={cn(
                      "rounded-lg p-2 transition-colors",
                      file.type.startsWith("image/")
                        ? "bg-transparent"
                        : "bg-muted",
                    )}
                  >
                    {file.type.startsWith("image/") && file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="h-12 w-12 rounded-md object-cover shadow-xs"
                      />
                    ) : (
                      <FileIconComponent className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold truncate">
                        {file.name}
                      </p>
                      {isUploaded && (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Uploaded
                        </Badge>
                      )}
                      {(hasFileErrors || uploadError) && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Error
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(file.size)}
                    </p>
                    {hasFileErrors && (
                      <p className="text-xs text-destructive">
                        {file.errors
                          .map((e: FileError) => e.message)
                          .join(", ")}
                      </p>
                    )}
                    {uploadError && (
                      <p className="text-xs text-destructive">
                        {uploadError.message}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(file.name)}
                    disabled={loading}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {files.length > 0 && (
        <Button
          onClick={onUpload}
          disabled={!canUpload}
          size="lg"
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Uploading {files.length} file{files.length !== 1 ? "s" : ""}...
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle className="mr-2 h-5 w-5" />
              All files uploaded successfully
            </>
          ) : (
            <>
              <Upload className="mr-2 h-5 w-5" />
              Upload {files.length} file{files.length !== 1 ? "s" : ""}
            </>
          )}
        </Button>
      )}
    </div>
  );
}
