/**
 * Shown to visitors while a card opens: a card-shaped skeleton with a soft shimmer,
 * so the page never flashes blank.
 */
export default function CardLoading() {
  return (
    <div className="min-h-screen w-full bg-[#F4F4F6] md:py-8" role="status" aria-label="Opening card">
      <div className="mx-auto flex min-h-screen w-full max-w-[440px] flex-col overflow-hidden bg-white md:min-h-0 md:rounded-[28px] md:shadow-[0_12px_40px_rgba(16,24,40,0.12)]">
        <div className="skeleton h-[190px] rounded-none" />
        <div className="relative -mt-[50px] flex flex-col items-center px-6">
          <div className="h-[100px] w-[100px] rounded-full border-4 border-white bg-white">
            <div className="skeleton h-full w-full rounded-full" />
          </div>
          <div className="skeleton mt-4 h-6 w-48 rounded-lg" />
          <div className="skeleton mt-2.5 h-4 w-36 rounded-md" />
          <div className="skeleton mt-4 h-3.5 w-64 rounded-md" />
          <div className="skeleton mt-2 h-3.5 w-52 rounded-md" />
        </div>
        <div className="grid grid-cols-4 gap-2.5 px-5 pt-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-[76px] rounded-[18px]" style={{ animationDelay: `${i * 90}ms` }} />
          ))}
        </div>
        <div className="flex gap-2.5 px-5 pt-3">
          <div className="skeleton h-[50px] flex-1 rounded-[14px]" />
          <div className="skeleton h-[50px] w-[112px] rounded-[14px]" />
        </div>
        <div className="space-y-2.5 px-5 pb-10 pt-8">
          <div className="skeleton h-5 w-28 rounded-md" />
          <div className="skeleton h-[72px] rounded-2xl" />
          <div className="skeleton h-[72px] rounded-2xl" />
        </div>
        <div className="mt-auto flex items-center justify-center gap-1.5 pb-6 text-xs text-[#A1A1AA]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6] motion-safe:animate-pulse" aria-hidden="true" />
          Opening card…
        </div>
      </div>
    </div>
  );
}
