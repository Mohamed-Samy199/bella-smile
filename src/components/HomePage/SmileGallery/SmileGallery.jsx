import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, ArrowLeftRight } from 'lucide-react';
import ReactCompareImage from 'react-compare-image';

import backgroundPattern from '../../../assets/gallery/bg.webp';
import bella from '../../../assets/logo/bella.png';
import crowding1 from '../../../assets/gallery/Crowding Case before.webp';
import crowding2 from '../../../assets/gallery/Crowding Case after.webp';
import spacing1 from '../../../assets/gallery/Spacing Case before.webp';
import spacing2 from '../../../assets/gallery/Spacing Case after.webp';
import deepBite1 from '../../../assets/gallery/Deep Bite Case before.webp';
import deepBite2 from '../../../assets/gallery/Deep Bite Case after.webp';
import Specialist from '../../../assets/gallery/smile specialist.webp';

const SmileGallery = () => {
  const cases = [
    { 
      id: 1,  
      before: crowding1, 
      after: crowding2,
      title: "Crowding Case"
    },
    { 
      id: 2,  
      before: spacing1, 
      after: spacing2,
      title: "Spacing Case"
    },
    { 
      id: 3,  
      before: deepBite1, 
      after: deepBite2,
      title: "Deep Bite Case"
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % cases.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + cases.length) % cases.length);

  useEffect(() => {
    let interval;
    if (!isPaused) {
      interval = setInterval(() => {
        handleNext();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPaused, currentIndex]);

  return (
    <section id="gallery" className="relative w-full min-h-screen bg-white overflow-hidden font-sans flex items-center py-20" dir="ltr">
      
      <div className="absolute inset-0 pointer-events-none opacity-30 z-0">
        <img src={backgroundPattern} className="w-full h-full object-cover" alt="Background" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* الجانب الأيسر: الصورة الثابتة */}
          <div className="w-full lg:w-1/2 relative flex items-center justify-center lg:justify-start">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]"
            >
              <div className="absolute inset-0 rounded-full border-[10px] border-mainColor/10 blur-[1px] shadow-[0_0_60px_rgba(102,187,238,0.3)]"></div>
              <div className="absolute inset-4 rounded-full overflow-hidden bg-white/20 backdrop-blur-3xl border-4 border-white flex items-center justify-center shadow-inner">
                <img 
                  src={Specialist}
                  alt="Smile Specialist" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-5 -right-5 w-24 h-24 z-20 md:w-32 md:h-32"
              >
                <img src={bella} className="w-full h-full object-contain" alt="Logo" />
              </motion.div>
            </motion.div>
          </div>

          {/* الجانب الأيمن: الكاروسيل */}
          <div className="w-full lg:w-1/2 text-left">
            <h2 className="text-darkColor text-3xl lg:text-5xl font-black leading-tight mb-4">
              Real Patient <br />
              <span className="text-mainColor">Transformations</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-lg">
              Interact with the slider to see how our precision aligners reshape smiles.
            </p>

            {/* الحاوية التي توقف الدوران عند ملامستها فقط */}
            <div 
              className="relative h-[350px] w-full flex items-center justify-center perspective-[1500px]"
              onMouseEnter={() => setIsPaused(true)} 
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="relative w-full h-full flex items-center justify-center preserve-3d">
                <AnimatePresence initial={false}>
                  {cases.map((caseItem, index) => {
                    const position = (index - currentIndex + cases.length) % cases.length;
                    const isCenter = position === 1;
                    const isLeft = position === 0;
                    const isRight = position === 2;

                    return (
                      <motion.div
                        key={caseItem.id}
                        className="absolute w-[300px] md:w-[420px] h-auto rounded-[2.5rem] bg-white shadow-[0_30px_60px_rgba(0,51,102,0.12)] overflow-hidden flex flex-col cursor-pointer border border-white p-3"
                        style={{ zIndex: isCenter ? 50 : 20 }}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{
                          x: isCenter ? 0 : isLeft ? "-65%" : "65%",
                          z: isCenter ? 300 : -150, 
                          rotateY: isLeft ? 35 : isRight ? -35 : 0, 
                          scale: isCenter ? 1 : 0.75,
                          opacity: 1,
                        }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        onClick={() => setCurrentIndex(index)}
                      >
                        <div className="relative rounded-[1.8rem] overflow-hidden h-auto bg-gray-100">
                          {isCenter ? (
                            <div className="h-auto w-full pointer-events-auto">
                                <ReactCompareImage 
                                  leftImage={caseItem.before} 
                                  rightImage={caseItem.after}
                                  sliderLineColor="#66BBEE"
                                  handle={(
                                    <div className="w-9 h-9 rounded-full bg-darkColor text-white flex items-center justify-center shadow-2xl border-2 border-white">
                                      <ArrowLeftRight size={16} />
                                    </div>
                                  )}
                                />
                            </div>
                          ) : (
                            <div className="flex w-full h-auto aspect-video pointer-events-none">
                              <img src={caseItem.before} className="w-1/2 h-full object-cover" alt="Before" />
                              <img src={caseItem.after} className="w-1/2 h-full object-cover opacity-60" alt="After" />
                              <div className="absolute inset-0 bg-darkColor/5" />
                            </div>
                          )}
                        </div>

                        <div className={`mt-4 mb-2 text-center font-bold transition-all duration-300 ${isCenter ? 'text-darkColor text-xl' : 'text-gray-400 text-sm opacity-50'}`}>
                          {caseItem.title}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* أزرار التنقل */}
              <div className="absolute -bottom-10 flex gap-6 z-[60]">
                <button 
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }} 
                  className="p-4 rounded-full bg-white shadow-xl text-darkColor hover:bg-blue-50 active:scale-90 transition-all border border-blue-50"
                >
                  <ArrowLeft size={22} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleNext(); }} 
                  className="p-4 rounded-full bg-darkColor text-white shadow-xl hover:bg-darkColor/80 active:scale-90 transition-all"
                >
                  <ArrowRight size={22} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SmileGallery;
