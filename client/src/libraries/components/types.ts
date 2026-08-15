
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "circular" | "pattern"
}

export interface LinkProps {
  value: React.ReactNode;
  action: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}