"use client";

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const Avatar = ({
  name,
  src,
  size = "md",
  className = "",
}: AvatarProps) => {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
  };

  const initial = name.charAt(0).toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} bg-blue-500 rounded-full flex items-center justify-center text-white font-bold ${className}`}
    >
      {initial}
    </div>
  );
};
