export const openStlEmail = (patient) => {
  if (!patient?.doctor?.email) return;

  const subject = encodeURIComponent(
    `STL Files - ${patient.firstName} ${patient.lastName}`
  );

  const body = encodeURIComponent(
    `Dear Dr. ${patient.doctor.firstName} ${patient.doctor?.lastName} ,

Please find attached the STL files for the following patient:

Patient Name: ${patient.firstName} ${patient.lastName}

Kind regards,
Bella Smile Team`
  );

  const gmailUrl =
    `https://mail.google.com/mail/?view=cm&fs=1` +
    `&to=${patient.doctor.email}` +
    `&su=${subject}` +
    `&body=${body}`;

  window.open(gmailUrl, "_blank");
};