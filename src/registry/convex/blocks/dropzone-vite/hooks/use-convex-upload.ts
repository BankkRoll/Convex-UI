"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type FileError,
  type FileRejection,
  useDropzone,
} from "react-dropzone";

interface FileWithPreview extends File {
  preview?: string;
  errors: readonly FileError[];
}

type UseConvexUploadOptions = {
  /**
   * Allowed MIME types for each file upload (e.g `image/png`, `text/html`, etc). Wildcards are also supported (e.g `image/*`).
   *
   * Defaults to allowing uploading of all MIME types.
   */
  allowedMimeTypes?: string[];
  /**
   * Maximum upload size of each file allowed in bytes. (e.g 1000 bytes = 1 KB)
   */
  maxFileSize?: number;
  /**
   * Maximum number of files allowed per upload.
   */
  maxFiles?: number;
};

type UseConvexUploadReturn = ReturnType<typeof useConvexUpload>;

const useConvexUpload = (options: UseConvexUploadOptions = {}) => {
  const {
    allowedMimeTypes = [],
    maxFileSize = Number.POSITIVE_INFINITY,
    maxFiles = 1,
  } = options;

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveFile = useMutation(api.files.saveFile);

  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ name: string; message: string }[]>([]);
  const [successes, setSuccesses] = useState<string[]>([]);

  const isSuccess = useMemo(() => {
    if (errors.length === 0 && successes.length === 0) {
      return false;
    }
    if (errors.length === 0 && successes.length === files.length) {
      return true;
    }
    return false;
  }, [errors.length, successes.length, files.length]);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      const validFiles = acceptedFiles
        .filter(
          (file: File) =>
            !files.find((x: FileWithPreview) => x.name === file.name),
        )
        .map((file: File) => {
          (file as FileWithPreview).preview = URL.createObjectURL(file);
          (file as FileWithPreview).errors = [];
          return file as FileWithPreview;
        });

      const invalidFiles = fileRejections.map(
        ({ file, errors }: FileRejection) => {
          (file as FileWithPreview).preview = URL.createObjectURL(file);
          (file as FileWithPreview).errors = errors;
          return file as FileWithPreview;
        },
      );

      const newFiles = [...files, ...validFiles, ...invalidFiles];

      setFiles(newFiles);
    },
    [files, setFiles],
  );

  const dropzoneProps = useDropzone({
    onDrop,
    noClick: true,
    accept: allowedMimeTypes.reduce(
      (acc: Record<string, string[]>, type: string) => ({ ...acc, [type]: [] }),
      {},
    ),
    maxSize: maxFileSize,
    maxFiles: maxFiles,
    multiple: maxFiles !== 1,
  });

  const onUpload = useCallback(async () => {
    setLoading(true);

    // Handle partial successes - retry files with errors
    const filesWithErrors = errors.map(
      (x: { name: string; message: string }) => x.name,
    );
    const filesToUpload =
      filesWithErrors.length > 0
        ? [
            ...files.filter((f: FileWithPreview) =>
              filesWithErrors.includes(f.name),
            ),
            ...files.filter(
              (f: FileWithPreview) => !successes.includes(f.name),
            ),
          ]
        : files;

    const responses = await Promise.all(
      filesToUpload.map(async (file: FileWithPreview) => {
        try {
          // Generate upload URL
          const uploadUrl = await generateUploadUrl();

          // Upload the file to Convex storage
          const response = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
          });

          if (!response.ok) {
            throw new Error("Failed to upload file");
          }

          const { storageId } = await response.json();

          // Save file metadata to database
          await saveFile({
            storageId,
            name: file.name,
            type: file.type,
            size: file.size,
          });

          return { name: file.name, message: undefined };
        } catch (error) {
          return {
            name: file.name,
            message: error instanceof Error ? error.message : "Upload failed",
          };
        }
      }),
    );

    const responseErrors = responses.filter(
      (x: { name: string; message: string | undefined }) =>
        x.message !== undefined,
    ) as {
      name: string;
      message: string;
    }[];
    setErrors(responseErrors);

    const responseSuccesses = responses.filter(
      (x: { name: string; message: string | undefined }) =>
        x.message === undefined,
    );
    const newSuccesses = Array.from(
      new Set([
        ...successes,
        ...responseSuccesses.map(
          (x: { name: string; message: string | undefined }) => x.name,
        ),
      ]),
    );
    setSuccesses(newSuccesses);

    setLoading(false);
  }, [files, errors, successes, generateUploadUrl, saveFile]);

  useEffect(() => {
    if (files.length === 0) {
      setErrors([]);
    }

    // Remove 'Too many files' error if count is now valid
    if (files.length <= maxFiles) {
      let changed = false;
      const newFiles = files.map((file: FileWithPreview) => {
        if (file.errors.some((e: FileError) => e.code === "too-many-files")) {
          file.errors = file.errors.filter(
            (e: FileError) => e.code !== "too-many-files",
          );
          changed = true;
        }
        return file;
      });
      if (changed) {
        setFiles(newFiles);
      }
    }
  }, [files.length, setFiles, maxFiles, files]);

  return {
    files,
    setFiles,
    successes,
    isSuccess,
    loading,
    errors,
    setErrors,
    onUpload,
    maxFileSize: maxFileSize,
    maxFiles: maxFiles,
    allowedMimeTypes,
    ...dropzoneProps,
  };
};

export {
  useConvexUpload,
  type UseConvexUploadOptions,
  type UseConvexUploadReturn,
};
