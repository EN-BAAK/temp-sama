"use client";

import React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { FileViewerProps } from "@/types/components";
import Button from "@/libraries/forms/components/Button";

const FileViewer: React.FC<FileViewerProps> = ({
  url,
  onClose,
}) => {
  return (
    <div className="sticky top-0 h-screen flex items-center justify-center inset-0 z-50 bg-black/70">
      <div className="h-150 w-150">
        <Button
          icon={X}
          onClick={onClose}
          variant="danger"
          className="absolute right-3 top-3 z-10 w-fit rounded-full p-2"
        />

        <div className="relative h-full max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-xl bg-reversed">
          <div className="relative h-full w-full bg-muted">
            <Image
              src={url}
              alt="Preview"
              fill
              className="object-contain p-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileViewer;