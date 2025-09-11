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

  STATES: "/organization/states/",
  REGISTRATION_GROUPS: "/policy/registration-groups/",

  MATCH_GROUPS: "/policy/match-groups/",

  ORGANIZATION_SETUP: "/organization/setup/",
} as const;
