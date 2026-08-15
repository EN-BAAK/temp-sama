import { FileViewerType } from "./variables";
import { ReactNode } from "react";

export type OpenFileProps = {
  url: string;
  type: FileViewerType;
};

export type FileViewerContextProps = {
  openFile: (file: OpenFileProps) => void;
  closeFile: () => void;
};

export type FileViewerProviderProps = {
  children: React.ReactNode;
};

export interface PWAInstallProviderProps {
  children: ReactNode;
}

export interface PWAInstallContextProps {
  canInstall: boolean;
  installApp: () => Promise<void>;
  closeInstallPrompt: () => void;
}

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;

  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

export interface PWAInstallPromptProps {
  onInstall: () => Promise<void>;
  onClose: () => void;
}