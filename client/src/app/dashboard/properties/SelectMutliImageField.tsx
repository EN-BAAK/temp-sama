"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { FiUpload, FiX } from "react-icons/fi";
import { Skeleton } from "@/libraries/components/Skeleton";
import { cn } from "@/utils/tools";
import { SelectMultiImageFieldProps } from "@/types/forms";
import { ExistingImageItem } from "@/types/variables";
import { getImageUrl } from "@/utils/helpers";

const SelectMultiImageField: React.FC<SelectMultiImageFieldProps> = ({
  label,
  maxImages = 5,
  disabled = false,
  isLoading = false,
  className = "",
  existingImages = [],
  onDeleteExisting,
  newFiles,
  setNewFiles,
  error,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [deletedIds, setDeletedIds] = useState<Set<string | number>>(new Set());

  const visibleExisting = useMemo(() => {
    return existingImages.filter((item) => !deletedIds.has(item.id));
  }, [existingImages, deletedIds]);

  const localPreviews = useMemo(() => {
    return newFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
  }, [newFiles]);

  useEffect(() => {
    return () => {
      localPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [localPreviews]);

  const totalCount = visibleExisting.length + newFiles.length;
  const isMaxReached = totalCount >= maxImages;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;

    const remainingSlots = maxImages - totalCount;
    if (remainingSlots <= 0) return;

    const filesToAdd = selectedFiles.slice(0, remainingSlots);

    setNewFiles((prev) => [...prev, ...filesToAdd]);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemoveNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExisting = (item: ExistingImageItem) => {
    setDeletedIds((prev) => new Set(prev).add(item.id));

    onDeleteExisting?.(item);
  };

  if (isLoading) {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-xs text-gray-400">
            ({totalCount} / {maxImages})
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {visibleExisting.map((item) => (
          <div
            key={`existing-${item.id}`}
            className="group relative h-28 w-full rounded-lg border border-gray-200 bg-gray-50 overflow-hidden shadow-sm"
          >
            <Image
              src={getImageUrl(item.url)}
              alt="Existing image"
              fill
              unoptimized
              className="object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => handleRemoveExisting(item)}
              disabled={disabled}
              className="absolute right-1.5 top-1.5 rounded-full bg-red-500 p-1 text-white opacity-90 transition-all hover:bg-red-600 hover:scale-105 cursor-pointer disabled:opacity-50"
              title="حذف الصورة"
            >
              <FiX className="h-3.5 w-3.5" />
            </button>
            <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
              الحالية
            </span>
          </div>
        ))}

        {localPreviews.map((preview, index) => (
          <div
            key={`new-${preview.url}`}
            className="group relative h-28 w-full rounded-lg border border-gray-200 bg-gray-50 overflow-hidden shadow-sm"
          >
            <Image
              src={preview.url}
              alt="New local preview"
              fill
              unoptimized
              className="object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => handleRemoveNewFile(index)}
              disabled={disabled}
              className="absolute right-1.5 top-1.5 rounded-full bg-red-500 p-1 text-white opacity-90 transition-all hover:bg-red-600 hover:scale-105 cursor-pointer disabled:opacity-50"
              title="إزالة"
            >
              <FiX className="h-3.5 w-3.5" />
            </button>
            <span className="absolute bottom-1 left-1 rounded bg-emerald-600/80 px-1.5 py-0.5 text-[10px] text-white">
              جديدة
            </span>
          </div>
        ))}

        {!isMaxReached && (
          <label
            className={cn(
              "flex h-28 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-reversed p-2 transition duration-300 hover:border-blue-500 hover:bg-blue-50/20",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <FiUpload className="h-6 w-6 text-gray-500 mb-1" />
            <span className="text-xs text-gray-500 text-center font-medium">
              اختر صور
            </span>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              disabled={disabled}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {error && <span className="text-xs font-medium text-red-500">{error}</span>}
    </div>
  );
};

export default SelectMultiImageField;