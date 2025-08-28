// lib/auth-config.ts

export const authConfig = {
  // Define page routes for authentication and error handling
  pages: {
    signIn: "/login",
    unauthorized: "/unauthorized", // Optional: Create this page to show a friendly "Access Denied" message
  },

  // Define the user roles in your application
  roles: {
    patient: "patient",
    doctor: "doctor",
    superadmin: "superadmin",
  },

  /**
   * Configure protected routes.
   * The middleware will check against this configuration to allow or deny access.
   */
  protectedRoutes: {
    // --- Patient-Specific Routes ---
    "/patient-portal": ["patient"],

    // --- Doctor & Superadmin Routes ---
    "/": ["doctor", "superadmin"], // Dashboard homepage
    "/appointments": ["doctor", "superadmin"],
    "/billing": ["doctor", "superadmin"],
    "/documents": ["doctor", "superadmin"],
    "/e-prescription": ["doctor", "superadmin"], // Corrected route name
    "/file-management": ["doctor", "superadmin"],
    "/messaging": ["doctor", "superadmin"],
    "/ocr-workflow": ["doctor", "superadmin"],
    "/patient-intake": ["doctor", "superadmin"],
    "/patients": ["doctor", "superadmin"],
    "/profile": ["doctor", "superadmin"],
    "/results-review": ["doctor", "superadmin"],
    "/settings": ["doctor", "superadmin"],
    "/telemedicine": ["doctor", "superadmin"],

    // This handles the dynamic patient detail pages
    "/patients/[username]": ["doctor", "superadmin"],
  },
};
