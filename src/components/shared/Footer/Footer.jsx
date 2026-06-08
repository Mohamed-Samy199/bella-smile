import { Link } from "react-router-dom";
import SocialMedia from "./SocialMedia/SocialMedia";
import bellaLogo from "../../../assets/logo/bella-logo-white.png";

const linksTop = [
  { to: "/", label: "Home" },
  { to: "/course", label: "Course Daish" },
  { to: "/about", label: "About" },
  { to: "/course", label: "Course" },
];



function Footer() {
  return (
    <div className="bg-darkColor">
      <footer className="grid md:grid-cols-10 grid-cols-1 px-5 py-3 gap-5 bg-darkColor text-white">
        
        {/* Logo */}
        <div className="md:col-span-2 flex justify-center items-center lg:px-8">
          <Link to="/" className="block">
            <img
              className="object-contain w-[40%] md:w-[85%] m-auto"
              src={bellaLogo}
              loading="lazy"
              alt="logo"
            />
          </Link>
        </div>

        {/* Links */}
        <div className="md:col-span-5 flex flex-col items-center md:items-start justify-center">
          
          <nav className="flex flex-wrap justify-center md:justify-start gap-1 font-semibold">
            {linksTop.map((l, i) => (
              <Link key={i} to={l.to} className="me-1 hover:opacity-80">
                {l.label} {i < linksTop.length - 1 && "|"}
              </Link>
            ))}
          </nav>

          <p className="text-sm mt-2 text-center md:text-left">
            © 2026 Bella Smile, All rights reserved
          </p>
        </div>

        {/* Social */}
        <div className="md:col-span-3 flex justify-evenly items-center">
          <SocialMedia />
        </div>
      </footer>
    </div>
  );
}

export default Footer;