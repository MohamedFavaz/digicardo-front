import React from "react";
import { Lock } from "lucide-react";

interface LockedFeatureOverlayProps {
  planRequired?: "pro" | "business";
  label?: string;
  className?: string;
  onClick?: () => void;
}

export const LockedFeatureOverlay: React.FC<LockedFeatureOverlayProps> = ({
  planRequired = "pro",
  label,
  className = "",
  onClick,
}) => {
  const isBusiness = planRequired === "business";

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm cursor-pointer transition-all hover:scale-105 ${
        isBusiness
          ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
          : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500"
      } ${className}`}
      data-testid="locked-feature-badge"
    >
      <Lock className="w-2.5 h-2.5" />
      <span>{label || (isBusiness ? "Business" : "Pro")}</span>
    </div>
  );
};
