import { motion } from "framer-motion";

export default function HeroSection({
  title = "Page Title",
  bgImage = "",
  height = "75vh",
  showArrow = true,
}) {
  return (
    <div
      className={`relative w-full flex items-center justify-center bg-cover bg-center bg-no-repeat ${height}`}
      style={{
        backgroundImage: `url(${bgImage})`,
        // height: height,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-white heading font-bold z-10"
      >
        {title}
      </motion.h1>

      {/* Arrow */}
      {showArrow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 z-10"
        >
          <svg
            className="w-8 h-8 animate-bounce text-mainGold"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      )}
    </div>
  );
}
