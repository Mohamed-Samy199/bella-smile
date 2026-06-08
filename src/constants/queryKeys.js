export const QUERY_KEYS = {
  // Auth
  ME: ["me"],

  // Dashboard
  DASHBOARD_STATS: ["dashboard", "stats"],

  // Patients
  PATIENTS:        (filters) => ["patients", filters],
  PATIENT:         (id)      => ["patients", id],

  // Doctors
  DOCTORS:         (filters) => ["doctors", filters],
  DOCTOR:          (id)      => ["doctors", id],
  DOCTOR_ME:       ["doctors", "me"],

  // Area Managers
  AREA_MANAGERS:   (filters) => ["area-managers", filters],
  AREA_MANAGER:    (id)      => ["area-managers", id],

  // Distributors
  DISTRIBUTORS:    (filters) => ["distributors", filters],
  DISTRIBUTOR:     (id)      => ["distributors", id],
};