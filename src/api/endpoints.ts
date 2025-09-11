// src/api/endpoints.ts
export const ENDPOINTS = {
  // Authentication
  LOGIN: "/accounts/login/",
  SIGNUP: "/accounts/signup/",
  FORGOT_PASSWORD: "/accounts/forgot-password/",
  RESET_PASSWORD: "/accounts/reset-password/",
  CHANGE_PASSWORD_FIRST_LOGIN: "/accounts/change-password-first-login/",
  LOGOUT: "/accounts/logout/",

  // User Management
  USER_PROFILE: "/accounts/profile/",

  GET_CURRENT_USER: "/accounts/get-current-user/",
  //   UPDATE_PROFILE: "/accounts/profile/update/",

  //   // Welcome Flow
  //   WELCOME_DATA: "/welcome/data/",
  //   WELCOME_SUBMIT: "/welcome/submit/",

  // Dashboard
  //   DASHBOARD_STATS: "/dashboard/stats/",

  // Policies
  //   POLICIES: "/policies/",
  //   POLICY_PACKAGES: "/policies/packages/",
} as const;
