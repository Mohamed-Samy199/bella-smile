export const WORKFLOW_CONFIG = {
  "Photographic Evaluation": {
    action: "verifica-valutazione",
    label: "Photographic Evaluation Verification",
    description: "Confirm the review of the patient's photos.",
    requiresPayment: false,
    fields: [],
  },

  "Photographic Evaluation Verification": {
    action: "suitability-pickup",
    label: "Pick Up",
    description: "Set suitability and proceed to Pick Up.",
    requiresPayment: false,
    fields: [
      {
        name: "eligibility",
        type: "select",
        label: "Suitability *",
        required: true,
        options: [
          { value: "Suitable", label: "✅ Suitable" },
          { value: "Not Suitable", label: "❌ Not Suitable" },
        ],
      },
      {
        name: "treatment",
        type: "select",
        label: "Treatment",
        required: false,
        options: [
          { value: "F", label: "F" },
          { value: "I", label: "I" },
          { value: "L", label: "L" },
          { value: "M", label: "M" },
          { value: "P", label: "P" },
          { value: "PR", label: "PR" },
          { value: "R", label: "R" },
          { value: "LI", label: "LI" },
          { value: "EA", label: "EA" },
        ],
      },
      {
        name: "numAligners",
        type: "number",
        label: "Num. Aligners",
        required: false,
        min: 0,
      },
      {
        name: "dataPronte",
        type: "date",
        label: "Ready Date",
        required: false,
      },
    ],
  },

  "Pick Up": {
    action: "Preparation",
    label: "Preparation",
    description: "The patient is waiting for the first visit.",
    requiresPayment: true,
    fields: [],
  },

  "Preparation": {
    action: "check-care-plan",
    label: "Check Care Plan",
    description: "Verify the completed preparation.",
    requiresPayment: false,
    fields: [],
  },

  "Check Care Plan": {
    action: "waiting-for-acceptance",
    label: "Waiting for Acceptance",
    description: "Patient is waiting to accept the plan.",
    requiresPayment: false,
    fields: [],
  },

  "Waiting for Acceptance": {
    action: "completed",
    label: "Completed",
    description: "Complete the treatment.",
    requiresPayment: false,
    fields: [],
  },
};