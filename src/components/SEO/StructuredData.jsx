// src/components/SEO/StructuredData.jsx
export default function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type":    "MedicalBusiness",
    "name":     "Bella Smile",
    "url":      "https://www.bellasmile.com",
    "logo":     "https://www.bellasmile.com/images/favicon.png",
    "description": "Professional dental aligner management system",
    "medicalSpecialty": "Dentistry",
    "availableService": {
      "@type":       "MedicalTherapy",
      "name":        "Dental Aligners",
      "description": "Digital workflow management for dental aligner treatments",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
