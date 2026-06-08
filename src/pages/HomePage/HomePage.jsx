import AppointmentSection from "../../components/HomePage/AppointmentSection/AppointmentSection";
import FeaturesSection from "../../components/HomePage/FeaturesSection/FeaturesSection";
import HeroHome from "../../components/HomePage/HeroHome/HeroHome";
import MissionSection from "../../components/HomePage/MissionSection/MissionSection";
import ServicesSection from "../../components/HomePage/ServicesSection/ServicesSection";
import SmileGallery from "../../components/HomePage/SmileGallery/SmileGallery";
import StructuredData from "../../components/SEO/StructuredData";

function HomePage() {
  return (
    <>
      <StructuredData />
      <HeroHome />
      <FeaturesSection />
      <MissionSection />
      <ServicesSection />
      <SmileGallery />
      <AppointmentSection />
    </>
  );
}

export default HomePage;