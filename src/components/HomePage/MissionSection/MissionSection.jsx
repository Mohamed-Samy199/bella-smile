import { motion } from 'framer-motion';
import { CheckCircle2, Award, Users, Target } from 'lucide-react';
import bg from '../../../assets/mission/bg.webp';
import doctor from '../../../assets/mission/doctor.webp';
import orthodontics from '../../../assets/mission/orthodontics.webp';

const MissionSection = () => {
  const missionPoints = [
    { text: "Patient-Centered Orthodontic Excellence", icon: <Users size={20} /> },
    { text: "Precision Digital Planning & Workflow", icon: <Target size={20} /> },
    { text: "Locally Crafted, High-Quality Aligners", icon: <Award size={20} /> },
    { text: "Transparent & Trustworthy Care", icon: <CheckCircle2 size={20} /> },
  ];

  return (
    <section className="relative w-full py-24 bg-white overflow-hidden font-sans">
      
      <div className="absolute inset-0 pointer-events-none opacity-80">
        <img 
          src={bg} 
          className="w-full h-full object-cover"
          alt="background-decor"
        />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          <div className="w-full lg:w-1/2 relative flex items-center justify-center lg:justify-start">
            <div className="relative flex gap-4 items-end">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-48 md:w-64 aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl z-10 border-4 border-white"
              >
                <img 
                  src={doctor} 
                  className="w-full h-full object-cover" 
                  alt="Specialist" 
                />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-40 md:w-56 aspect-[3/4] rounded-[2rem] overflow-hidden shadow-xl z-20 border-4 border-white mb-12"
              >
                <img 
                  src={orthodontics} 
                  className="w-full h-full object-cover" 
                  alt="orthodontics" 
                />
              </motion.div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 text-left"
          >
            <h4 className="text-mainColor font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
              <span className="w-8 h-1 bg-mainColor rounded-full"></span>
              Our Mission
            </h4>
            
            <h2 className="text-darkColor text-4xl lg:text-5xl font-extrabold leading-tight mb-8">
              Clinically Driven & <br />
              <span className="text-mainColor">Patient-Centered</span> Excellence
            </h2>

            <p className="text-gray-500 text-lg mb-10 leading-relaxed max-w-xl">
              At <strong className="text-darkColor">Bella Smile</strong>, we are dedicated to delivering clear aligner solutions tailored for the Egyptian market. 
              By combining cutting-edge orthodontic expertise with precision digital workflows, we make your dream smile a reality.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              {missionPoints.map((point, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-3 group cursor-default"
                >
                  <div className="mt-1 bg-darkColor/5 p-2 rounded-lg text-darkColor group-hover:bg-darkColor group-hover:text-white transition-all">
                    {point.icon}
                  </div>
                  <span className="font-bold text-darkColor text-sm leading-snug transition-colors">
                    {point.text}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-darkColor text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-900/20 hover:bg-darkColor/80 transition-all"
            >
              About Us
            </motion.button>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default MissionSection;