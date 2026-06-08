import { motion } from 'framer-motion';
import { Tag, Truck, PhoneCall, ArrowUpRight } from 'lucide-react';

const FeaturesSection = () => {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  
  const features = [
    {
      title: "Globally Competitive Prices",
      desc: "World-class quality at a local price, making a perfect smile accessible to everyone with international standards.",
      // تم استخدام mainColor هنا بدلاً من الكود الثابت
      icon: <Tag className="text-mainColor" size={32} />,
      bg: "bg-white",
      textColor: "text-darkColor",
      btnText: "Get Started",
      target: "services",
      colSpan: "lg:col-span-2",
      img: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=400"
    },
    {
      title: "Fast Delivery",
      desc: "Your aligners delivered within 5 working days maximum.",
      icon: <Truck className="text-white" size={32} />,
      // تم استخدام bg-mainColor المخصص
      bg: "bg-mainColor",
      textColor: "text-white",
      btnText: "Order Now",
      target: "contact",
      colSpan: "lg:col-span-1",
    },
    {
      title: "24/7 Support",
      desc: "Our team is always ready to answer your questions via a dedicated medical team or AI Chatbot.",
      icon: <PhoneCall className="text-white" size={32} />,
      // تم استخدام bg-darkColor المخصص
      bg: "bg-darkColor",
      textColor: "text-white",
      btnText: "01023825307",
      colSpan: "lg:col-span-1",
        target: "",
    }
  ];

  return (
    <section className="py-24 bg-slate-50 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 text-center lg:text-left">
          <h2 className="text-darkColor text-4xl lg:text-5xl font-black mb-4">
            Why Choose <span className="text-mainColor">Bella Smile</span>?
          </h2>
          <p className="text-gray-500 max-w-2xl text-lg">
            We provide premium dental alignment services with cutting-edge technology and patient-centric care.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {features.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`${item.bg} ${item.colSpan} rounded-[2.5rem] p-10 relative overflow-hidden shadow-sm border border-gray-100 flex flex-col justify-between group`}
            >
              <div className="z-10 relative">
                <div className={`w-16 h-16 rounded-2xl mb-8 flex items-center justify-center ${
                  item.textColor === 'text-white' 
                  ? 'bg-white/20' 
                  : 'bg-mainColor/10'
                }`}>
                  {item.icon}
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${item.textColor}`}>{item.title}</h3>
                <p className={`text-sm lg:text-base leading-relaxed opacity-80 ${item.textColor} max-w-[80%]`}>
                  {item.desc}
                </p>
              </div>

              <div className="mt-12 z-10">
                <button 
                  className={`flex items-center gap-2 font-bold py-3 px-8 rounded-full transition-all ${
                    item.textColor === 'text-white' 
                    ? 'bg-white text-darkColor hover:bg-opacity-90' 
                    : 'bg-darkColor text-white hover:bg-mainColor'
                  }`}
                  onClick={() => item.target && scrollToSection(item.target)}
                >
                  {item.btnText}
                  <ArrowUpRight size={18} />
                </button>
              </div>

              {/* Decorative Circle for White Card */}
              {index === 0 && (
                <div className="absolute right-0 bottom-0 w-64 h-64 bg-mainColor/20 rounded-full -mr-20 -mb-20 z-0" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;