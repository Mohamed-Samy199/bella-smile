import { useEffect } from "react";

export default function SEOHead({
  title       = "Bella Smile",
  description = "Professional dental clinic management system for aligner treatments.",
  image       = "https://www.bellasmile.com/og-image.png",
  url         = "https://www.bellasmile.com",
  noIndex     = false,
}) {
  useEffect(() => {
    // Title
    document.title = title;

    // Helper
    const setMeta = (selector, content) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        const attr = selector.includes("property") ? "property" : "name";
        const val  = selector.match(/["']([^"']+)["']/)?.[1] || "";
        el.setAttribute(attr, val);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta('meta[name="description"]',         description);
    setMeta('meta[name="robots"]',              noIndex ? "noindex, nofollow" : "index, follow");
    setMeta('meta[property="og:title"]',        title);
    setMeta('meta[property="og:description"]',  description);
    setMeta('meta[property="og:image"]',        image);
    setMeta('meta[property="og:url"]',          url);
    setMeta('meta[name="twitter:title"]',       title);
    setMeta('meta[name="twitter:description"]', description);
    setMeta('meta[name="twitter:image"]',       image);
  }, [title, description, image, url, noIndex]);

  return null;
}