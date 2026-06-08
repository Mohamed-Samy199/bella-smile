import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import landSettings from "../../../data/settings/Overview";
import smile1 from "../../../assets/hero/bella smile 1.webp"
import smile2 from "../../../assets/hero/bella smile 2.webp"
import smile3 from "../../../assets/hero/bella smile 3.webp"


const sliderImages = [smile1, smile2, smile3];


export default function HomeSlider() {
  return (
    <Slider {...landSettings} className="w-full h-screen">
      {sliderImages.map((img, i) => (
        <div key={i} className="w-full h-screen outline-none">
          <img
            src={img}
            className="w-full h-full object-cover animate-zoom-smooth"
            alt="Home Slide"
          />
        </div>
      ))}
    </Slider>
  );
}