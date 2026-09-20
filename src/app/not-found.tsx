import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-[#faf9f5] text-foreground antialiased selection:bg-brand-500/20 selection:text-brand-900 select-none">
      <div className="w-full max-w-md space-y-6 rounded-[36px] border border-border/80 bg-card p-8 sm:p-10 text-center shadow-float animate-in zoom-in-95 duration-300">
        
        {/* Brand Logo */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-white p-2 border border-border shadow-md flex items-center justify-center">
          <Image src="/logo.png" alt="Digicardo" width={48} height={48} className="w-full h-full object-contain" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border text-muted-foreground text-[10px] font-black uppercase tracking-wider font-mono">
            Error 404 · Page Not Found
          </span>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Lost your way?
          </h1>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-xs mx-auto">
            The profile or page you are looking for does not exist, has been moved, or the link may be misspelled.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="pill"
              className="w-full sm:w-auto gap-2 bg-brand-600 hover:bg-brand-700 text-white font-black text-xs shadow-cta h-11 px-6"
            >
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Button>
          </Link>

          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto gap-1.5 rounded-full border-border/80 bg-card hover:bg-muted font-bold text-xs shadow-2xs h-11 px-5"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
