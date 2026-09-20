import React from "react";
import Link from "next/link";
import Image from "next/image";

interface DigicardoBadgeProps {
  className?: string;
}

export const DigicardoBadge: React.FC<DigicardoBadgeProps> = ({ className = "" }) => {
  return (
    <div className={`py-6 flex items-center justify-center ${className}`} data-testid="digicardo-branding-badge">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium bg-black/10 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white backdrop-blur-md border border-black/5 dark:border-white/10 transition-all hover:scale-105 group"
      >
        <div className="w-3.5 h-3.5 rounded-sm overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
          <Image src="/logo.png" alt="Digicardo" width={14} height={14} className="w-full h-full object-contain" />
        </div>
        <span>Powered by <strong>Digicardo</strong></span>
      </Link>
    </div>
  );
};

export default DigicardoBadge;
