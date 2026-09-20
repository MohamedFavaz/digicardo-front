export default function Loading() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50"
      aria-label="Loading Digicardo..."
    >
      {/* Logo mark */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
        style={{ background: "linear-gradient(135deg, #5B3FE4, #8b5cf6)" }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <rect x="4" y="4" width="8" height="8" rx="2" fill="white" opacity="0.9" />
          <rect x="16" y="4" width="8" height="8" rx="2" fill="white" opacity="0.6" />
          <rect x="4" y="16" width="8" height="8" rx="2" fill="white" opacity="0.6" />
          <rect x="16" y="16" width="8" height="8" rx="2" fill="white" opacity="0.9" />
        </svg>
      </div>

      {/* Brand name */}
      <p className="text-sm font-bold text-foreground mb-6 tracking-wide">Digicardo</p>

      {/* Animated progress bar */}
      <div className="w-48 h-1 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #5B3FE4, #8b5cf6, #ec4899)",
            animation: "loading-bar 1.4s ease-in-out infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { width: 0%; margin-left: 0; }
          50% { width: 60%; margin-left: 20%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}
