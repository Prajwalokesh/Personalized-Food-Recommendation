import Link from "next/link";
import { Utensils, Sparkles } from "lucide-react";

interface AppLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "minimal" | "icon-only";
}

export default function AppLogo({
  className = "",
  showText = true,
  size = "md",
  variant = "default",
}: AppLogoProps) {
  const sizeClasses = {
    sm: {
      icon: "h-6 w-6",
      text: "text-lg",
      gap: "space-x-1.5",
    },
    md: {
      icon: "h-8 w-8",
      text: "text-2xl",
      gap: "space-x-2",
    },
    lg: {
      icon: "h-10 w-10",
      text: "text-3xl",
      gap: "space-x-2.5",
    },
    xl: {
      icon: "h-12 w-12",
      text: "text-4xl",
      gap: "space-x-3",
    },
  };

  const currentSize = sizeClasses[size];

  if (variant === "icon-only") {
    return (
      <div
        className={`relative inline-flex items-center justify-center ${className}`}
      >
        <div className="bg-nutriscan-primary rounded-lg p-2 shadow-lg">
          <Utensils className={`${currentSize.icon} text-white`} />
          <Sparkles className="text-nutriscan-accent-amber absolute -top-1 -right-1 h-3 w-3" />
        </div>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <Link
        href="/"
        className={`flex items-center ${currentSize.gap} ${className}`}
      >
        <Utensils
          className={`${currentSize.icon} text-nutriscan-slate-900 dark:text-nutriscan-slate-100`}
        />
        {showText && (
          <span
            className={`${currentSize.text} text-nutriscan-slate-900 dark:text-nutriscan-slate-100 font-bold`}
          >
            NutriScan
          </span>
        )}
      </Link>
    );
  }

  // Default variant
  return (
    <Link
      href="/"
      className={`flex items-center ${currentSize.gap} group ${className}`}
    >
      <div className="relative">
        {/* Main icon container */}
        <div className="bg-nutriscan-primary group-hover:bg-nutriscan-primary-hover rounded-lg p-1.5 shadow-lg transition-all duration-300 group-hover:shadow-xl">
          <Utensils className={`${currentSize.icon} text-white`} />

          {/* Sparkle accent */}
          <Sparkles className="text-nutriscan-accent-amber group-hover:text-nutriscan-accent-amber/80 absolute -top-0.5 -right-0.5 h-3 w-3 transition-colors duration-300" />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`${currentSize.text} text-nutriscan-slate-900 group-hover:text-nutriscan-slate-700 dark:text-nutriscan-slate-100 dark:group-hover:text-nutriscan-slate-300 font-bold transition-colors duration-300`}
          >
            NutriScan
          </span>
          <span className="text-muted-foreground -mt-1 text-xs font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            AI Food Safety
          </span>
        </div>
      )}
    </Link>
  );
}
