"use client";

import React, { createContext, useCallback, useContext, useMemo, useState, } from "react";
import { FileViewerContextProps, FileViewerProviderProps, OpenFileProps, } from "@/types/contexts";

import FileViewer from "./FileViewer";
import { FileViewerType } from "@/types/variables";

const FileViewerContext =
  createContext<FileViewerContextProps | undefined>(undefined);

export const FileViewerProvider = ({ children, }: FileViewerProviderProps): React.JSX.Element => {
  const [file, setFile] = useState<OpenFileProps | undefined>();

  const openFile = useCallback((file: OpenFileProps) => {
    if (file.type.toUpperCase() === FileViewerType.PDF) {
      window.open(file.url, "_blank", "noopener,noreferrer");
      return;
    }

    setFile(file);
  }, []);

  const closeFile = useCallback(() => {
    setFile(undefined);
  }, []);

  const contextValue = useMemo<FileViewerContextProps>(
    () => ({
      openFile,
      closeFile,
    }),
    [openFile, closeFile],
  );

  return (
    <FileViewerContext.Provider value={contextValue}>
      {file && (
        <FileViewer
          url={file.url}
          type={file.type}
          onClose={closeFile}
        />
      )}

      {children}
    </FileViewerContext.Provider>
  );
};

export const useFileViewerContext = (): FileViewerContextProps => {
  const context = useContext(FileViewerContext);

  if (!context) {
    throw new Error(
      "useFileViewerContext must be used inside FileViewerProvider",
    );
  }

  return context;
};

export default FileViewerProvider;