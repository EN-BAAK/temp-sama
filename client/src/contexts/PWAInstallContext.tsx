"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, } from "react";
import { BeforeInstallPromptEvent, PWAInstallContextProps, PWAInstallProviderProps, } from "@/types/contexts";
import PWAInstallPrompt from "./PWAInstallPrompt";

const PWAInstallContext =
  createContext<PWAInstallContextProps | undefined>(undefined);

export const PWAInstallProvider = ({
  children,
}: PWAInstallProviderProps): React.JSX.Element => {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)",
    ).matches;

    if (isStandalone) {
      return;
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();

      const promptEvent = event as BeforeInstallPromptEvent;

      setInstallPrompt(promptEvent);
      setIsOpen(true);
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setIsOpen(false);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt,
    );

    window.addEventListener(
      "appinstalled",
      handleAppInstalled,
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );

      window.removeEventListener(
        "appinstalled",
        handleAppInstalled,
      );
    };
  }, []);

  const installApp = useCallback(async () => {
    if (!installPrompt) return;

    const result = await installPrompt.prompt();

    setInstallPrompt(null);
    setIsOpen(false);

    if (result.outcome === "accepted") {
      console.log("PWA installation accepted");
    }
  }, [installPrompt]);

  const closeInstallPrompt = useCallback(() => {
    setIsOpen(false);
  }, []);

  const contextValue = useMemo<PWAInstallContextProps>(
    () => ({
      canInstall: Boolean(installPrompt),
      installApp,
      closeInstallPrompt,
    }),
    [
      installPrompt,
      installApp,
      closeInstallPrompt,
    ],
  );

  return (
    <PWAInstallContext.Provider value={contextValue}>
      {isOpen && installPrompt && (
        <PWAInstallPrompt
          onInstall={installApp}
          onClose={closeInstallPrompt}
        />
      )}

      {children}
    </PWAInstallContext.Provider>
  );
};

export const usePWAInstallContext =
  (): PWAInstallContextProps => {
    const context = useContext(PWAInstallContext);

    if (!context) {
      throw new Error(
        "usePWAInstallContext must be used inside PWAInstallProvider",
      );
    }

    return context;
  };

export default PWAInstallProvider;