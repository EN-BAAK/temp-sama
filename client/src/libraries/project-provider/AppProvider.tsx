'use client';

import React, { createContext, useCallback, useContext, useMemo, useState, } from 'react';
import { AppContextProps, AppProviderProps, ToastMessage, Warning as WarningProps, } from './types';
import Toast from './Toast';
import Warning from './Warning';
import { useValidateAuthentication } from '@/features/useAuth';
import { initialUser } from '@/constants/global';

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({
  children,
}: AppProviderProps): React.JSX.Element => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [warning, setWarning] = useState<WarningProps | undefined>();

  const { isError, data } = useValidateAuthentication();

  const pushToast = useCallback(
    (toastMessage: Omit<ToastMessage, 'id'>) => {
      setToasts((currentToasts) => [
        ...currentToasts,
        {
          ...toastMessage,
          id: crypto.randomUUID(),
        },
      ]);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id),
    );
  }, []);

  const showWarning = useCallback((warningProps: WarningProps) => {
    setWarning(warningProps);
  }, []);

  const closeWarning = useCallback(() => {
    setWarning(undefined);
  }, []);

  const contextValue = useMemo<AppContextProps>(
    () => ({
      isLoggedIn: !isError,
      pushToast,
      showWarning,
      user: data?.data || initialUser,
    }),
    [
      isError,
      data?.data,
      pushToast,
      showWarning,
    ],
  );

  return (
    <AppContext.Provider value={contextValue}>
      <div className="fixed left-0 z-50">
        {toasts.map((toast, index) => (
          <Toast
            id={toast.id}
            key={toast.id}
            index={index}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {warning && (
        <Warning
          message={warning.message}
          btn1={warning.btn1}
          btn2={warning.btn2}
          styleBtn1={warning.styleBtn1}
          styleBtn2={warning.styleBtn2}
          onClose={closeWarning}
          handleBtn2={warning.handleBtn2}
        />
      )}

      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      'useAppContext must be used inside AppProvider',
    );
  }

  return context;
};

export default AppProvider;