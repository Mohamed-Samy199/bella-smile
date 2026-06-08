import React, { useRef } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Monitor,
  Activity,
  Factory,
  Heart,
  ClipboardList,
  ArrowUpRight,
} from "lucide-react";

import bellaLogo from "../../../assets/logo/bella.png";
import servicesBella from "../../../assets/services/sercice bella.webm";

const ServiceCard = ({ service, index, videoSrc }) => {
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log("Video play prevented:", err);
      });
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative h-[380px] cursor-pointer perspective-1000"
    >
      {/* Card Body */}
      <div className="absolute inset-0 bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,51,102,0.08)] border border-gray-100 transition-all duration-500 group-hover:border-mainColor/30 overflow-hidden">
        
        <div
          className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${service.color} opacity-5 rounded-full blur-3xl group-hover:opacity-20 transition-opacity`}
        />

        <div className="relative z-20 h-full flex flex-col justify-between">
          <div className="w-16 h-16 rounded-2xl bg-darkColor/5 text-darkColor flex items-center justify-center group-hover:bg-darkColor group-hover:text-white transition-all duration-500 shadow-sm">
            {React.cloneElement(service.icon, { size: 30 })}
          </div>

          <div className="text-left">
            <h3 className="text-2xl font-bold text-darkColor mb-3 group-hover:text-darkColor">
              {service.title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 group-hover:text-gray-600">
              {service.desc}
            </p>

            <div className="flex items-center gap-2 text-mainColor font-bold opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
              <span className="text-xs uppercase tracking-widest">
                Explore Tech
              </span>
              <ArrowUpRight size={16} />
            </div>
          </div>
        </div>

        <div className="absolute inset-0 z-10 opacity-[0.04] group-hover:opacity-[0.18] transition-opacity duration-700 scale-105 group-hover:scale-100 pointer-events-none">
          <video
            ref={videoRef}
            loop
            muted
            preload="auto"
            playsInline
            className="w-full h-full object-cover grayscale"
          >
            <source src={videoSrc} type="video/webm" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </div>
      </div>
    </motion.div>
  );
};

const ServicesDynamic = () => {
  const services = [
    {
      id: 1,
      title: "Custom Clear Aligners",
      icon: <Settings />,
      desc: "Tailored fit for your unique smile.",
      color: "from-darkColor to-mainColor",
    },
    {
      id: 2,
      title: "Digital Planning",
      icon: <Monitor />,
      desc: "Precise AI-driven 3D smile mapping.",
      color: "from-mainColor to-darkColor",
    },
    {
      id: 3,
      title: "Clinical Expert",
      icon: <Activity />,
      desc: "Expert orthodontist oversight.",
      color: "from-darkColor to-mainColor",
    },
    {
      id: 4,
      title: "Precision Mfg",
      icon: <Factory />,
      desc: "High-quality, locally made aligners.",
      color: "from-mainColor to-[#0077CC]",
    },
    {
      id: 5,
      title: "Dentist Workflow",
      icon: <ClipboardList />,
      desc: "Seamless integration for practitioners.",
      color: "from-darkColor to-[#0077CC]",
    },
    {
      id: 6,
      title: "Comfort-First",
      icon: <Heart />,
      desc: "Maximum comfort, minimum visibility.",
      color: "from-mainColor to-darkColor",
    },
  ];

  return (
    <section id="services" className="py-32 bg-white overflow-hidden relative" dir="ltr">
      {/* النص الخلفي الضخم المتحرك */}
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-40 left-0 whitespace-nowrap opacity-[0.05] select-none pointer-events-none z-0"
      >
        <h2 className="text-[18rem] font-black text-darkColor">
          BELLA SMILE DIGITAL PRECISION BELLA SMILE
        </h2>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
        <div className="mx-auto mb-4 w-max">
          <motion.h4
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-mainColor font-bold tracking-widest uppercase mb-4 flex items-center gap-2"
          >
            <span className="w-8 h-1 bg-mainColor rounded-full"></span>
            Our Services
          </motion.h4>
        </div>

        <h2 className="text-darkColor h2-smile text-5xl lg:text-6xl font-extrabold leading-tight mb-16 max-w-3xl mx-auto group cursor-default">
          Tailored Clear Aligner Care For Your Perfect{" "}
          <span className="relative inline-block mx-2 pb-4 text-mainColor">
            Smile
            <svg
              className="absolute -bottom-4 -left-[18px] w-[120%] h-8 pointer-events-none overflow-visible"
              viewBox="0 0 100 20"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                className="transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] stroke-current [d:url('#')] group-hover:[d:path('M2_3_Q_50_24_98_3')]"
                d="M5 5 Q 50 18 95 5"
                style={{
                  strokeWidth: "3",
                  strokeLinecap: "round",
                  filter: "drop-shadow(0 0 3px rgba(102, 187, 238, 0.3))",
                }}
              />
            </svg>
          </span>
        </h2>

        <div className="relative flex items-center justify-center mb-16">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute w-80 h-80 md:w-[450px] md:h-[450px] bg-mainColor/10 rounded-full blur-3xl"
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 w-64 h-64 md:w-80 md:h-80 rounded-full border-[15px] border-white shadow-[0_30px_70px_rgba(0,51,102,0.2)] bg-white flex items-center justify-center overflow-hidden"
          >
            <div className="absolute w-48 h-48 bg-mainColor/25 blur-[50px] rounded-full z-0"></div>
            <div className="relative z-10 w-full h-full flex items-center justify-center p-8">
              <img
                src={bellaLogo}
                alt="Bella Smile Logo"
                className="w-[85%] h-auto object-contain drop-shadow-xl transform hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-mainColor/10 to-transparent pointer-events-none"></div>
            <div className="absolute inset-0 rounded-full border border-white/50 z-20 pointer-events-none"></div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              videoSrc={servicesBella}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesDynamic;