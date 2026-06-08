import { useState } from "react";
import "react-phone-input-2/lib/style.css";
import { motion, AnimatePresence } from "framer-motion";
import AppointmentSection from "../../components/HomePage/AppointmentSection/AppointmentSection";
import ServicesSection from "../../components/HomePage/ServicesSection/ServicesSection";


// ── Steps Data ────────────────────────────────────────────────
const STEPS = [
  {
    number: "01",
    icon: "📸",
    title: "Photographic Evaluation",
    description:
      "The doctor submits the patient's clinical photos and dental records. Our team evaluates the case and confirms suitability for aligner treatment.",
  },
  {
    number: "02",
    icon: "🔬",
    title: "Clinical Analysis",
    description:
      "Our specialists analyze diagnostic data and clinical aspects of the case, developing a functional treatment plan tailored to the patient's needs.",
  },
  {
    number: "03",
    icon: "🖥️",
    title: "3D Simulation",
    description:
      "Using advanced 3D software, we generate a complete case simulation — number of aligners, bite correction, and expected final result.",
  },
  {
    number: "04",
    icon: "📦",
    title: "Aligner Production",
    description:
      "Upon acceptance of the plan, aligners are manufactured with precision using certified digital workflows and shipped directly to your clinic.",
  },
  {
    number: "05",
    icon: "🦷",
    title: "Treatment & Follow-up",
    description:
      "Patients wear aligners for the prescribed duration. Periodic check-ins ensure correct progress and minimize the need for refinements.",
  },
  {
    number: "06",
    icon: "✅",
    title: "Completion",
    description:
      "Treatment is finalized with optimal results. Any required optimization phases are included as part of the treatment — no extra cost.",
  },
];

// ── Why Us ────────────────────────────────────────────────────
const WHY = [
  {
    icon: "🎯",
    title: "Diagnosis-First",
    text: "Every plan starts with a thorough clinical evaluation — not a template.",
  },
  {
    icon: "🔄",
    title: "Fewer Refinements",
    text: "Precision planning reduces mid-course corrections significantly.",
  },
  {
    icon: "🌍",
    title: "Trusted Globally",
    text: "Partnering with clinics across Europe, the Middle East, and beyond.",
  },
  {
    icon: "💡",
    title: "Full Digital Workflow",
    text: "From evaluation to delivery — entirely managed through our platform.",
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function CourseDaish() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="bg-white min-h-screen font-sans" dir="ltr">

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-darkColor min-h-[92vh]
                          flex items-center">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-96 h-96 rounded-full
                          border border-white" />
          <div className="absolute top-40 left-32 w-64 h-64 rounded-full
                          border border-white" />
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full
                          border border-white" />
        </div>

        <div className="container mx-auto max-w-6xl px-6 lg:px-12 relative z-10
                        py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="max-w-3xl"
          >
            <span className="inline-block text-mainColor text-xs font-bold
                             tracking-[0.2em] uppercase mb-6 border border-mainColor/30
                             px-4 py-1.5 rounded-full">
              Digital Dental Excellence
            </span>

            <h1 className="text-white text-5xl lg:text-7xl font-black
                           leading-[1.05] tracking-tight mb-6">
              Smarter Aligners.
              <br />
              <span className="text-mainColor">Better Outcomes.</span>
            </h1>

            <p className="text-white/60 text-lg lg:text-xl leading-relaxed
                          max-w-xl mb-10">
              Bella Smile provides a complete digital workflow for clear aligner
              treatment — from evaluation to delivery, managed in one platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2
                           bg-mainColor hover:bg-mainColor/90 text-white
                           font-bold px-8 py-4 rounded-2xl transition
                           active:scale-95 text-sm"
              >
                See How It Works
                <span className="text-lg">→</span>
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2
                           border border-white/20 hover:border-white/50
                           text-white font-semibold px-8 py-4 rounded-2xl
                           transition text-sm"
              >
                Get In Touch
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="grid grid-cols-3 gap-6 mt-20 max-w-xl"
          >
            {[
              { num: "100%", label: "Digital Workflow" },
              { num: "3+",   label: "Years Warranty" },
              { num: "50+",  label: "Countries Served" },
            ].map(({ num, label }) => (
              <div key={label} className="text-left">
                <p className="text-mainColor text-3xl font-black">{num}</p>
                <p className="text-white/40 text-xs mt-1 uppercase tracking-wide">
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Why Bella Smile ───────────────────────────────── */}
      <section className="py-24 px-6 lg:px-12 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <span className="text-mainColor text-xs font-bold tracking-[0.2em]
                             uppercase">
              Why Choose Us
            </span>
            <h2 className="text-darkColor text-4xl lg:text-5xl font-black
                           mt-3 tracking-tight">
              The Bella Smile Difference
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-white rounded-2xl p-6 border border-gray-100
                           hover:border-mainColor/30 hover:shadow-lg
                           transition-all duration-300"
              >
                <span className="text-3xl mb-4 block">{item.icon}</span>
                <h3 className="text-darkColor font-bold text-base mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ServicesSection />

      {/* ── How It Works ──────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 lg:px-12 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <span className="text-mainColor text-xs font-bold tracking-[0.2em]
                             uppercase">
              The Process
            </span>
            <h2 className="text-darkColor text-4xl lg:text-5xl font-black
                           mt-3 tracking-tight">
              How It Works
            </h2>
            <p className="text-gray-400 text-base mt-4 max-w-xl mx-auto">
              A clear, structured journey from first evaluation to completed
              treatment — every step managed digitally.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* Step Tabs */}
            <div className="space-y-3">
              {STEPS.map((step, i) => (
                <motion.button
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  onClick={() => setActiveStep(i)}
                  className={`w-full text-left flex items-center gap-4 p-4
                              rounded-2xl border transition-all duration-300
                              ${activeStep === i
                                ? "bg-darkColor border-darkColor shadow-lg"
                                : "bg-white border-gray-100 hover:border-gray-300"
                              }`}
                >
                  <span
                    className={`text-xs font-black w-8 h-8 rounded-xl flex
                                items-center justify-center shrink-0 transition
                                ${activeStep === i
                                  ? "bg-mainColor text-white"
                                  : "bg-gray-100 text-gray-400"
                                }`}
                  >
                    {step.number}
                  </span>
                  <span
                    className={`font-semibold text-sm transition
                      ${activeStep === i ? "text-white" : "text-gray-700"}`}
                  >
                    {step.title}
                  </span>
                  {activeStep === i && (
                    <span className="ml-auto text-mainColor text-base">→</span>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Step Detail */}
            <div className="lg:sticky lg:top-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-darkColor rounded-3xl p-10 min-h-[320px]
                             flex flex-col justify-between"
                >
                  <div>
                    <span className="text-6xl mb-6 block">
                      {STEPS[activeStep].icon}
                    </span>
                    <span className="text-mainColor text-xs font-bold
                                     tracking-[0.2em] uppercase">
                      Step {STEPS[activeStep].number}
                    </span>
                    <h3 className="text-white text-2xl font-black mt-2 mb-4">
                      {STEPS[activeStep].title}
                    </h3>
                    <p className="text-white/60 text-base leading-relaxed">
                      {STEPS[activeStep].description}
                    </p>
                  </div>

                  {/* Progress dots */}
                  <div className="flex gap-2 mt-8">
                    {STEPS.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveStep(i)}
                        className={`h-1.5 rounded-full transition-all duration-300
                          ${i === activeStep
                            ? "w-6 bg-mainColor"
                            : "w-1.5 bg-white/20"
                          }`}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────── */}
      <section className="py-20 px-6 bg-mainColor">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-white text-4xl lg:text-5xl font-black
                           tracking-tight mb-4">
              Ready to Go Digital?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Join clinics across Europe who trust Bella Smile for their
              aligner workflow.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-white text-darkColor
                         font-bold px-8 py-4 rounded-2xl hover:bg-gray-50
                         transition active:scale-95 text-sm"
            >
              Get Started Today →
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Contact ───────────────────────────────────────── */}
      <AppointmentSection />
    </div>
  );
}