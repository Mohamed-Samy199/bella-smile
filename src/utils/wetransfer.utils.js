// src/utils/wetransfer.utils.js
export const openWeTransfer = (patient) => {
  if (!patient?.doctor?.email) return;

  // WeTransfer بيفتح بـ email الـ recipient في الـ URL
  const recipientEmail = encodeURIComponent(patient.doctor.email);
  const message = encodeURIComponent(
    `STL Files for patient: ${patient.firstName} ${patient.lastName}`
  );

  // WeTransfer مش بيدعم pre-fill في الـ URL العادي
  // بس بنفتحه مع copy للبيانات للـ clipboard
  const transferInfo = `To: ${patient.doctor.email}
Subject: STL Files - ${patient.firstName} ${patient.lastName}
Message: Please find the STL files for patient ${patient.firstName} ${patient.lastName}`;

  navigator.clipboard.writeText(transferInfo).catch(() => {});

  window.open("https://wetransfer.com", "_blank");
};