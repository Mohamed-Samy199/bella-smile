import { ArrowRight } from "lucide-react";
import HomeSlider from "./HomeSlider";

export default function HeroHome() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <HomeSlider />
      </div>
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

      <div className="absolute inset-0 z-10 bg-black/20" />

      <div className="relative z-20 h-full max-w-7xl mx-auto px-6 lg:px-12 flex items-center">
        <div className="max-w-3xl text-left">
          {/* كلاس group موجود هنا، وبذلك أي Hover على الـ h1 سيؤثر على الـ path بالأسفل */}
          <h1 className="text-white text-5xl md:text-7xl font-bold leading-[1.1] mb-10 drop-shadow-2xl group cursor-default">
            Transforming Your <br />
            <span className="relative inline-block mx-3 text-mainColor">
              Smile
              <svg
                className="absolute pt-4 -bottom-7 -left-[30px] w-[130%] h-16 pointer-events-none overflow-visible"
                viewBox="0 0 100 50"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  className="transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] stroke-mainColor"
                  d="M10 15 Q 50 35 90 15"
                  // هنا نخبر المتصفح بتحديث مسار الرسمة عند عمل هوفر على الـ h1
                  style={{
                    strokeWidth: "4",
                    strokeLinecap: "round",
                    filter: "drop-shadow(0 0 5px rgba(102, 187, 238, 0.4))",
                  }}
                  // نستخدم كلاس الـ tailwind لتبديل قيمة الـ attribute برمجياً بسلاسة بفضل الـ transition
                  {...{
                    "data-smile": "normal",
                  }}
                  className="transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] stroke-mainColor [d:url('#')] group-hover:[d:path('M5_10_Q_50_45_95_10')]"
                  d="M10 15 Q 50 35 90 15"
                />
              </svg>
            </span>
            With Precision
          </h1>

          <div className="flex flex-wrap gap-4">
            <button
            onClick={() => scrollToSection("contact")}
            className="bg-darkColor hover:bg-darkColor/80 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl active:scale-95">
              Contact Us
            </button>

            <button
            onClick={() => scrollToSection("gallery")}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center gap-2 group">
              View Gallery
              <ArrowRight
                className="group-hover:translate-x-1 transition-transform"
                size={20}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}