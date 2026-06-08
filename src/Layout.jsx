import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./components/shared/Footer/Footer";
import Navbar from "./components/shared/Navbar/Navbar";

function Layout({ children }) {
  const location = useLocation();
  const [isAtTop, setIsAtTop] = useState(true); 

  useEffect(() => {
    // نطبق المنطق فقط في الصفحة الرئيسية
    if (location.pathname !== "/") {
      setIsAtTop(false); // إذا لم نكن في الرئيسية، اجعل النبار أبيض دائماً
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      // إذا كان التمرير أقل من ارتفاع الشاشة (HeroHome) بـ 100 بكسل مثلاً
      setIsAtTop(scrollPosition < windowHeight - 100);
    };

    // تشغيل الدالة فوراً عند التحميل للتأكد من الموضع الحالي
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return (
    <>
      <Navbar isTransparent={isAtTop && location.pathname === "/"} />

      {/* <main>{children}</main> */}
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;