import { UserEntity } from "@/types/entities";

export type Variant = "default" | "secondary" | "destructive" | "outline" | "main";

export type ToastMessage = {
  id: string
  message: string;
  type: "SUCCESS" | "ERROR";
};

export type ToastProps = {
  onClose: () => void;
} & ToastMessage;

export type Warning = {
  message: string;
  btn1?: string;
  btn2: string;
  styleBtn1?: Variant;
  styleBtn2?: Variant;
  handleBtn2: () => void;
};

export type ToastComponentProps = {
  index: number;
  onClose: (id: string) => void
  id: string
} & ToastProps

export type WarningProps = {
  onClose: () => void
} & Warning

export type AppContextProps = {
  pushToast: (toastMessage: Omit<ToastMessage, "id">) => void;
  showWarning: (warning: Warning) => void;
  isLoggedIn: boolean;
  user: UserEntity
}

export type AppProviderProps = {
  children: React.ReactNode
}