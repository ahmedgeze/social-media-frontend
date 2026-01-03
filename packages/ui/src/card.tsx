"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = ({
  children,
  className = "",
  padding = "md",
}: CardProps) => {
  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md ${paddings[padding]} ${className}`}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader = ({ children, className = "" }: CardHeaderProps) => {
  return (
    <div className={`border-b border-gray-200 dark:border-gray-700 pb-3 mb-3 ${className}`}>
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export const CardTitle = ({ children, className = "" }: CardTitleProps) => {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`}>
      {children}
    </h3>
  );
};
