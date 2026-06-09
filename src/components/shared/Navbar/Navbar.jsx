import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, User, ChevronDown } from 'lucide-react';
import logo from '../../../assets/logo/bella.png';
import useAuthStore from "../../../store/auth.store";
import { useLogout } from "../../../hooks/auth/useLogout";

const Navbar = ({ isTransparent }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const activeStyle = "text-mainColor font-bold relative group";
  const normalStyle = `${isTransparent ? 'text-white' : 'text-gray-600'} font-semibold hover:text-mainColor transition-colors relative group`;
  return (
    <nav
      className={`fixed w-full z-[100] transition-all duration-500 ${isTransparent
        ? 'bg-transparent py-5'
        : 'bg-white shadow-md py-3 shadow-blue-900/5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center">

          {/* --- Logo Area (Updated to Image) --- */}
          <Link to="/" className="flex items-center group cursor-pointer">
            <img
              src={logo}
              alt="Bella Smile Logo"
              className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* --- Desktop Navigation --- */}
          <div className="hidden md:flex items-center space-x-10">
            <NavLink
              to="/"
              className={({ isActive }) => isActive ? activeStyle : normalStyle}
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-mainColor transition-all group-hover:w-full"></span>
            </NavLink>

            <NavLink
              to="/course-daish"
              className={({ isActive }) => isActive ? activeStyle : normalStyle}
            >
              Course Daish
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-mainColor transition-all group-hover:w-full"></span>
            </NavLink>

            <button
              onClick={() => scrollToSection("services")}
              className={normalStyle}
            >
              Services
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-mainColor transition-all group-hover:w-full"></span>
            </button>

            {/* <NavLink
              to="/#contact"
              className={({ isActive }) => isActive ? activeStyle : normalStyle}
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-mainColor transition-all group-hover:w-full"></span>
            </NavLink> */}
            <button
              onClick={() => scrollToSection("contact")}
              className={normalStyle}
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-mainColor transition-all group-hover:w-full"></span>
            </button>

            {user && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) => isActive ? activeStyle : normalStyle}
              >
                Dashboard
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-mainColor transition-all group-hover:w-full"></span>
              </NavLink>

            )}
          </div>

          {/* --- CTA Button --- */}
          <div className="hidden md:block">
            {user ? (

              <button
                onClick={logout}
                className={`
        ${isTransparent
                    ? "bg-white text-darkColor"
                    : "bg-darkColor  text-white"
                  }

        px-8 py-3 rounded-full font-bold
        hover:opacity-90 transition-all
        shadow-lg flex items-center gap-2
        group active:scale-95
      `}
              >
                <User size={18} />
                Logout
              </button>

            ) : (

              <Link to="/login">
                <button
                  className={`
          ${isTransparent
                      ? "bg-white text-darkColor"
                      : "bg-darkColor text-white"
                    }

          px-8 py-3 rounded-full font-bold
          hover:opacity-90 transition-all
          shadow-lg flex items-center gap-2
          group active:scale-95
        `}
                >
                  <User size={18} />
                  Login
                </button>
              </Link>

            )}
          </div>

          {/* --- Mobile Menu Button --- */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${isTransparent ? 'text-white' : 'text-darkColor'} p-2 rounded-lg`}
            >
              {isMenuOpen ? (
                <X size={30} className="text-darkColor" />
              ) : (
                <Menu size={30} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- Mobile Navigation Menu --- */}
      <div className={`md:hidden absolute w-full bg-white border-b pt-20 -z-10 border-gray-100 transition-all duration-300 ease-in-out ${isMenuOpen ? 'top-0 opacity-100 visible' : '-top-[500px] opacity-0 invisible'
        }`}>
        <div className="px-6 py-8 space-y-6 shadow-2xl">
          <Link to="/" className="block text-xl font-bold text-darkColor">Home</Link>
          <Link to="/course-daish" className="block text-xl font-semibold text-gray-600">Course Daish</Link>
          <button
            onClick={() => scrollToSection("services")}
            className={`${normalStyle} block`}
          >
            <span className='block text-xl font-semibold text-gray-600'>
              Services
            </span>
            {/* <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-mainColor transition-all group-hover:w-full"></span> */}
          </button>

          <button
            onClick={() => scrollToSection("contact")}
            className={`${normalStyle} block`}
          >
            <span className='block text-xl font-semibold text-gray-600'>
              Contact
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-mainColor transition-all group-hover:w-full"></span>
          </button>
          {/* <Link to="/dashboard" className="block text-xl font-semibold text-gray-600">Dashboard</Link> */}
          {user && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) => isActive ? activeStyle : normalStyle}
            >
              Dashboard
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-mainColor transition-all group-hover:w-full"></span>
            </NavLink>

          )}
          <hr className="border-gray-100" />
          {user ? (

            <button
              onClick={logout}
              className=" w-full bg-darkColor text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl">
              <User size={22} />
              Logout
            </button>
          ) : (
            <Link to="/login" className="block">
              <button
                className=" w-full bg-darkColor text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl ">
                <User size={22} />
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;