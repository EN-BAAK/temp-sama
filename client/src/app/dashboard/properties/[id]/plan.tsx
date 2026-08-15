"use client";

import React, { useState } from "react";
import NextImage from "next/image";
import { File, FileText } from "lucide-react";
import { DashboardPlanCardProps } from "@/types/components";
import { getImageUrl } from "@/utils/helpers";
import PropertyImageLoading from "../PropertyImageLoading";
import PropertyNoImage from "../PropertyNoImage";
import { useFileViewerContext } from "@/contexts/FileViewerProvider";
import { FileViewerType } from "@/types/variables";

const IMAGE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  "avif",
  "svg",
];

const PlanCard: React.FC<DashboardPlanCardProps> = ({ plan }) => {
  const { openFile } = useFileViewerContext()
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [isError, setIsError] = useState(false);

  const extension = plan.extension
    .replace(".", "")
    .toLowerCase();

  const isImage = IMAGE_EXTENSIONS.includes(extension);
  const isPdf = extension === "pdf";

  const stopLoadingImage = () => {
    setIsLoadingImage(false);
  };

  const imageFailed = () => {
    setIsLoadingImage(false);
    setIsError(true);
  };

  const onViewImage = () => openFile({ url: getImageUrl(plan.fileUrl), type: FileViewerType.IMAGE })
  const onViewPDF = () => openFile({ url: getImageUrl(plan.fileUrl), type: FileViewerType.PDF })

  return (
    <div className="group relative h-28 w-full overflow-hidden rounded-xl border border-border bg-background transition-all hover:border-primary/30 hover:shadow-sm">
      {isImage ? (
        <React.Fragment>
          {isLoadingImage && <PropertyImageLoading />}

          {!isError ? (
            <NextImage
              fill
              onLoad={stopLoadingImage}
              onError={imageFailed}
              src={getImageUrl(plan.fileUrl)}
              alt="مخطط العقار"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`object-cover transition-all duration-500 group-hover:scale-105 cursor-pointer ${isLoadingImage ? "opacity-0" : "opacity-100"
                }`}
              onClick={onViewImage}
            />
          ) : (
            <PropertyNoImage />
          )}
        </React.Fragment>
      ) : (
        <button
          className="flex h-full w-full flex-col items-center justify-center gap-2 p-3 cursor-pointer"
          onClick={onViewPDF}
        >
          {isPdf ? (
            <FileText className="h-10 w-10 text-danger" />
          ) : (
            <File className="h-10 w-10 text-muted" />
          )}

          <span
            className={`text-xs font-semibold uppercase ${isPdf ? "text-danger" : "text-muted"
              }`}
          >
            {extension || "FILE"}
          </span>
        </button>
      )}
    </div>
  );
};

export default PlanCard;