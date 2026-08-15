"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { File, FileText, Upload, X } from "lucide-react";
import { Skeleton } from "@/libraries/components/Skeleton";
import { cn } from "@/utils/tools";
import { getImageUrl } from "@/utils/helpers";
import { SelectMultiFilesFieldProps } from "@/types/forms";
import { ExistingFileItem } from "@/types/variables";

const IMAGE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "bmp",
  "svg",
  "avif",
];

const getExtension = (filename: string): string => {
  return filename.split(".").pop()?.toLowerCase() || "";
};

const normalizeExtension = (extension: string): string => {
  return extension.replace(".", "").toLowerCase();
};

const isImageExtension = (extension: string): boolean => {
  return IMAGE_EXTENSIONS.includes(normalizeExtension(extension));
};

const SelectMultiFilesField: React.FC<SelectMultiFilesFieldProps> = ({
  label,
  maxFiles = 5,
  accept,
  disabled = false,
  isLoading = false,
  className = "",
  existingFiles = [],
  onDeleteExisting,
  newFiles,
  setNewFiles,
  error,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [deletedIds, setDeletedIds] = useState<Set<string | number>>(
    new Set()
  );

  const visibleExisting = useMemo(() => {
    return existingFiles.filter((item) => !deletedIds.has(item.id));
  }, [existingFiles, deletedIds]);

  const localFiles = useMemo(() => {
    return newFiles.map((file) => {
      const extension = getExtension(file.name);
      const isImage =
        file.type.startsWith("image/") ||
        isImageExtension(extension);

      return {
        file,
        extension,
        isImage,
        previewUrl: isImage ? URL.createObjectURL(file) : null,
      };
    });
  }, [newFiles]);

  useEffect(() => {
    return () => {
      localFiles.forEach((item) => {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, [localFiles]);

  const totalCount = visibleExisting.length + newFiles.length;
  const isMaxReached = totalCount >= maxFiles;

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (!selectedFiles.length) return;

    const remainingSlots = maxFiles - totalCount;

    if (remainingSlots <= 0) return;

    const filesToAdd = selectedFiles.slice(0, remainingSlots);

    setNewFiles((prev) => [...prev, ...filesToAdd]);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemoveNewFile = (index: number) => {
    setNewFiles((prev) =>
      prev.filter((_, fileIndex) => fileIndex !== index)
    );
  };

  const handleRemoveExisting = (item: ExistingFileItem) => {
    setDeletedIds((prev) => new Set(prev).add(item.id));
    onDeleteExisting?.(item);
  };

  const renderFileIcon = (extension: string) => {
    const normalizedExtension = normalizeExtension(extension);

    if (normalizedExtension === "pdf") {
      return (
        <FileText className="h-10 w-10 text-danger" />
      );
    }

    return (
      <File className="h-10 w-10 text-muted" />
    );
  };

  if (isLoading) {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {label && (
          <span className="text-sm font-medium text-gray-700">
            {label}
          </span>
        )}

        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            {label}
          </span>

          <span className="text-xs text-gray-400">
            ({totalCount} / {maxFiles})
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {visibleExisting.map((item) => {
          const extension = normalizeExtension(item.extension);
          const isImage = isImageExtension(extension);

          return (
            <div
              key={`existing-${item.id}`}
              className="group relative h-28 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm"
            >
              {isImage ? (
                <Image
                  src={getImageUrl(item.url)}
                  alt="Existing file"
                  fill
                  unoptimized
                  className="rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-3">
                  {renderFileIcon(extension)}

                  <span className="max-w-full truncate text-xs font-medium uppercase text-gray-600">
                    {extension || "FILE"}
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={() => handleRemoveExisting(item)}
                disabled={disabled}
                className="absolute right-1.5 top-1.5 cursor-pointer rounded-full bg-danger p-1 text-white opacity-90 transition-all hover:scale-105 disabled:opacity-50"
                title="حذف الملف"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                الحالي
              </span>
            </div>
          );
        })}

        {localFiles.map((item, index) => (
          <div
            key={`${item.file.name}-${item.file.lastModified}-${index}`}
            className="group relative h-28 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm"
          >
            {item.isImage && item.previewUrl ? (
              <Image
                src={item.previewUrl}
                alt={item.file.name}
                fill
                unoptimized
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-3">
                {renderFileIcon(item.extension)}

                <span
                  className="w-full truncate text-center text-xs font-medium text-gray-600"
                  title={item.file.name}
                >
                  {item.file.name}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={() => handleRemoveNewFile(index)}
              disabled={disabled}
              className="absolute right-1.5 top-1.5 cursor-pointer rounded-full bg-danger p-1 text-white opacity-90 transition-all hover:scale-105 disabled:opacity-50"
              title="إزالة الملف"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <span className="absolute bottom-1 left-1 rounded bg-success/80 px-1.5 py-0.5 text-[10px] text-white">
              جديد
            </span>
          </div>
        ))}

        {!isMaxReached && (
          <label
            className={cn(
              "flex h-28 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-reversed p-2 transition duration-300 hover:border-primary hover:bg-primary/5",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <Upload className="mb-1 h-6 w-6 text-gray-500" />

            <span className="text-center text-xs font-medium text-gray-500">
              اختر ملفات
            </span>

            <input
              ref={inputRef}
              type="file"
              accept={accept}
              multiple
              disabled={disabled}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {error && (
        <span className="text-xs font-medium text-danger">
          {error}
        </span>
      )}
    </div>
  );
};

export default SelectMultiFilesField;