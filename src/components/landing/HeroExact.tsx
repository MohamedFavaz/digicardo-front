"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  CheckCircle2,
  Phone,
  MessageSquare,
  Mail,
  Globe,
  Building2,
  MapPin,
  Calendar,
  FileText,
  Github,
  Camera,
  Share2,
  Star,
  User,
  QrCode,
  Smartphone,
  CreditCard,
  Clock,
  Music,
} from "lucide-react";

export function HeroExact({ onOpenDemo }: { onOpenDemo?: () => void }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative overflow-hidden pt-6 pb-16 lg:pt-10 lg:pb-20 bg-white">
      {/* Background Radial Glow behind the phone */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-[10%] -translate-y-1/2 w-[520px] h-[520px] rounded-full blur-3xl -z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(91, 63, 228, 0.15) 0%, rgba(91, 63, 228, 0.03) 60%, transparent 75%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ── Left Column: Value Proposition ── */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-7 text-left">
            {/* Pill Tag */}
            <div>
              <span
                className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide"
                style={{ backgroundColor: "#eeebfc", color: "#5B3FE4" }}
              >
                Digital Visiting Card
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-slate-900 leading-[1.12] tracking-tight">
              One Card.
              <br />
              Many <span style={{ color: "#5B3FE4" }}>Possibilities.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-500 max-w-lg leading-relaxed font-normal">
              Create a beautiful digital visiting card and share it instantly with
              anyone, anywhere. Simple, professional and always with you.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                href="/register"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm sm:text-base font-bold text-white transition-all transform hover:-translate-y-0.5 active:scale-98"
                style={{
                  backgroundColor: "#5B3FE4",
                  boxShadow: "0 8px 22px rgba(91, 63, 228, 0.32)",
                }}
              >
                <span>Create Your Card</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={onOpenDemo}
                className="inline-flex items-center gap-2.5 px-5 py-3.5 rounded-full text-sm sm:text-base font-bold text-slate-900 hover:text-[#5B3FE4] bg-transparent transition-colors group cursor-pointer"
              >
                <span
                  className="w-8 h-8 rounded-full border border-slate-300 group-hover:border-[#5B3FE4] flex items-center justify-center transition-colors"
                  style={{ color: "#5B3FE4" }}
                >
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </span>
                <span>View Demo</span>
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Professional"
                  className="inline-block w-8 h-8 rounded-full ring-2 ring-white object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Professional"
                  className="inline-block w-8 h-8 rounded-full ring-2 ring-white object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Professional"
                  className="inline-block w-8 h-8 rounded-full ring-2 ring-white object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Professional"
                  className="inline-block w-8 h-8 rounded-full ring-2 ring-white object-cover"
                />
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-500">
                Trusted by professionals
              </span>
            </div>
          </div>

          {/* ── Right Column: Smartphone Mockup & Doodle ── */}
          <div className="lg:col-span-6 flex items-center justify-center lg:justify-center relative">
            
            <div className="relative flex items-center justify-center">
              {/* Phone Hardware Shell */}
              <div
                className="relative z-10 w-[285px] sm:w-[298px] h-[545px] sm:h-[555px] bg-slate-950 rounded-[44px] p-2.5 border-[4px] border-slate-800 flex flex-col justify-between"
                style={{
                  boxShadow:
                    "0 25px 50px -12px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(15, 23, 42, 0.12)",
                }}
              >
                {/* Hardware Buttons */}
                <div className="absolute -left-[6px] top-24 w-[3px] h-7 bg-slate-700 rounded-l-sm" />
                <div className="absolute -left-[6px] top-35 w-[3px] h-9 bg-slate-700 rounded-l-sm" />
                <div className="absolute -left-[6px] top-47 w-[3px] h-9 bg-slate-700 rounded-l-sm" />
                <div className="absolute -right-[6px] top-32 w-[3px] h-14 bg-slate-700 rounded-r-sm" />

                {/* Inner Screen */}
                <div className="relative w-full h-full bg-white rounded-[36px] overflow-hidden border border-slate-100 flex flex-col justify-between text-slate-800 select-none">
                  
                  {/* Top Area: Island + Banner + Profile + CTAs */}
                  <div>
                    {/* Dynamic Island Notch */}
                    <div className="pt-2 pb-1 bg-white flex items-center justify-center relative z-20">
                      <div className="w-18 h-3.5 bg-slate-950 rounded-full flex items-center justify-end px-2 gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-950 border border-slate-700" />
                      </div>
                    </div>

                    {/* Profile Banner */}
                    <div
                      className="h-14 relative overflow-hidden flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, #f4f2fd 0%, #ebe7fb 100%)",
                      }}
                    >
                      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#5B3FE4_1px,transparent_1px)] [background-size:6px_6px]" />
                    </div>

                    {/* Profile Avatar & Header */}
                    <div className="px-3 text-center -mt-7 relative z-10">
                      <div
                        className="mx-auto rounded-full ring-2 ring-white shadow-md flex items-center justify-center overflow-hidden"
                        style={{
                          width: "48px",
                          height: "48px",
                          backgroundColor: "#6C5CE7",
                        }}
                      >
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                          alt="Avatar"
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="mt-1 flex items-center justify-center gap-1">
                        <span className="font-extrabold text-[12px] text-slate-900 tracking-tight">
                          VENWO TECHNOLOGIES
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 fill-sky-500 text-white" />
                      </div>

                      <p className="text-[8.5px] text-slate-400 font-medium">
                        Welcome to my Digicardo page!
                      </p>

                      <div className="mt-0.5">
                        <span
                          className="inline-block text-[7.5px] font-bold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: "#eeebfc",
                            color: "#5B3FE4",
                          }}
                        >
                          VENWO TECHNOLOGIES
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons on Card */}
                    <div className="px-3 space-y-1 mt-2">
                      {/* View Service (Teal Button) */}
                      <div
                        className="w-full text-white rounded-md py-1.5 px-3 flex items-center justify-between text-[9.5px] font-bold shadow-xs cursor-pointer"
                        style={{ backgroundColor: "#00BFA5" }}
                      >
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3 h-3" />
                          <span>View Service</span>
                        </span>
                        <span className="text-[10px]">›</span>
                      </div>

                      {/* Pay Now & My Location */}
                      <div className="grid grid-cols-2 gap-1.5">
                        <div
                          className="text-white rounded-md py-1 px-2 flex items-center justify-center gap-1 text-[8.5px] font-bold shadow-xs cursor-pointer"
                          style={{ backgroundColor: "#FFA000" }}
                        >
                          <CreditCard className="w-2.5 h-2.5" />
                          <span>Pay Now</span>
                        </div>
                        <div
                          className="text-white rounded-md py-1 px-2 flex items-center justify-center gap-1 text-[8.5px] font-bold shadow-xs cursor-pointer"
                          style={{ backgroundColor: "#37474F" }}
                        >
                          <MapPin className="w-2.5 h-2.5" />
                          <span>My Location</span>
                        </div>
                      </div>

                      {/* 24x7 Always Open Status Pill */}
                      <div className="bg-slate-50 border border-slate-100 rounded-md py-0.5 px-2 flex items-center justify-between text-[7.5px] font-semibold text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-2 h-2 text-slate-400" />
                          <span>24×7 Always Open</span>
                        </span>
                        <span className="flex items-center gap-1 text-emerald-600 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Open Now</span>
                        </span>
                      </div>
                    </div>

                    {/* 4x4 Contact & Social Icon Grid */}
                    <div className="px-3 pt-2">
                      <div className="grid grid-cols-4 gap-1 text-center">
                        {/* Row 1 */}
                        <div className="flex flex-col items-center">
                          <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-0.5">
                            <Phone className="w-2.5 h-2.5" />
                          </span>
                          <span className="text-[6.5px] text-slate-500 font-medium">Call</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-0.5">
                            <MessageSquare className="w-2.5 h-2.5" />
                          </span>
                          <span className="text-[6.5px] text-slate-500 font-medium">WhatsApp</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="w-6 h-6 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-0.5">
                            <Mail className="w-2.5 h-2.5" />
                          </span>
                          <span className="text-[6.5px] text-slate-500 font-medium">Email</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="w-6 h-6 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mb-0.5">
                            <Globe className="w-2.5 h-2.5" />
                          </span>
                          <span className="text-[6.5px] text-slate-500 font-medium">Website</span>
                        </div>

                        {/* Row 2 */}
                        <div className="flex flex-col items-center">
                          <span className="w-6 h-6 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-0.5">
                            <Building2 className="w-2.5 h-2.5" />
                          </span>
                          <span className="text-[6.5px] text-slate-500 font-medium">Bank</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="w-6 h-6 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-0.5">
                            <MapPin className="w-2.5 h-2.5" />
                          </span>
                          <span className="text-[6.5px] text-slate-500 font-medium">Address</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-0.5">
                            <Calendar className="w-2.5 h-2.5" />
                          </span>
                          <span className="text-[6.5px] text-slate-500 font-medium">Book Now</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="w-6 h-6 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-0.5">
                            <FileText className="w-2.5 h-2.5" />
                          </span>
                          <span className="text-[6.5px] text-slate-500 font-medium">Form</span>
                        </div>

                        {/* Row 3 */}
                        <div className="flex flex-col items-center">
                          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center mb-0.5">
                            <Github className="w-2.5 h-2.5" />
                          </span>
                          <span className="text-[6.5px] text-slate-500 font-medium">GitHub</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="w-6 h-6 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center mb-0.5">
                            <Camera className="w-2.5 h-2.5" />
                          </span>
                          <span className="text-[6.5px] text-slate-500 font-medium">Snapchat</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-0.5">
                            <Music className="w-2.5 h-2.5" />
                          </span>
                          <span className="text-[6.5px] text-slate-500 font-medium">TikTok</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="w-6 h-6 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-0.5">
                            <Share2 className="w-2.5 h-2.5" />
                          </span>
                          <span className="text-[6.5px] text-slate-500 font-medium">Pinterest</span>
                        </div>

                        {/* Row 4 */}
                        <div className="flex flex-col items-center">
                          <span className="w-6 h-6 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-0.5">
                            <Star className="w-2.5 h-2.5" />
                          </span>
                          <span className="text-[6.5px] text-slate-500 font-medium">Review</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mb-0.5">
                            <User className="w-2.5 h-2.5" />
                          </span>
                          <span className="text-[6.5px] text-slate-500 font-medium">About</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="w-6 h-6 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-0.5">
                            <QrCode className="w-2.5 h-2.5" />
                          </span>
                          <span className="text-[6.5px] text-slate-500 font-medium">QR</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mb-0.5">
                            <Smartphone className="w-2.5 h-2.5" />
                          </span>
                          <span className="text-[6.5px] text-slate-500 font-medium">App</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Stats Single Compact Row */}
                  <div className="border-t border-slate-100 bg-slate-50/90 px-2 py-1 grid grid-cols-5 text-center text-slate-600">
                    <div>
                      <div className="text-[9px] font-black text-slate-800 leading-tight">55</div>
                      <div className="text-[5.5px] font-bold text-slate-400 uppercase tracking-tighter">Views</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-black text-slate-800 leading-tight">0</div>
                      <div className="text-[5.5px] font-bold text-slate-400 uppercase tracking-tighter">Clicks</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-black text-slate-800 leading-tight">0</div>
                      <div className="text-[5.5px] font-bold text-slate-400 uppercase tracking-tighter">Actions</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-black text-slate-800 leading-tight">1</div>
                      <div className="text-[5.5px] font-bold text-slate-400 uppercase tracking-tighter">Days Live</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-black text-slate-800 leading-tight">55</div>
                      <div className="text-[5.5px] font-bold text-slate-400 uppercase tracking-tighter">Engage</div>
                    </div>
                  </div>

                </div>
              </div>

              {/* ── Hand-Drawn Doodle & Annotation (Cleanly to the right of the phone) ── */}
              <div
                className="hidden xl:flex flex-col items-center absolute pointer-events-none select-none"
                style={{ left: "320px", top: "40px" }}
              >
                {/* Radiating Doodle Rays */}
                <div
                  className="font-bold text-xl leading-none tracking-widest mb-1 -rotate-6"
                  style={{ color: "#5B3FE4" }}
                >
                  \ | /
                </div>

                {/* Handwritten Text */}
                <div
                  className="text-center font-bold text-sm sm:text-base leading-tight -rotate-6"
                  style={{
                    color: "#5B3FE4",
                    fontFamily: "Comic Sans MS, 'Caveat', cursive, sans-serif",
                  }}
                >
                  <div>Your</div>
                  <div>Digital Card</div>
                  <div>Looks Like This</div>
                </div>

                {/* Curved Doodle Arrow pointing to the phone */}
                <svg
                  width="85"
                  height="75"
                  viewBox="0 0 95 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="-mt-1 -rotate-6 transform -scale-x-100"
                >
                  <path
                    d="M15 10 C 25 35, 75 10, 60 55 C 50 75, 20 65, 10 50"
                    stroke="#5B3FE4"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 12 42 L 8 52 L 20 54"
                    stroke="#5B3FE4"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
