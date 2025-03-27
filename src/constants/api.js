// src/constants/api.js

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

/**
 * Récupère le token JWT depuis le localStorage (client-side uniquement).
 */
export const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

/**
 * En-têtes JSON avec le token d'authentification.
 */
export const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

/**
 * En-têtes sans authentification.
 */
export const jsonHeaders = {
  "Content-Type": "application/json",
};

/**
 * Toutes les routes API utilisées.
 */
export const API_ROUTES = {
  LOGIN: `${BASE_URL}/auth/login`,
  REGISTER: `${BASE_URL}/auth/register`,
  PROFILE: `${BASE_URL}/auth/profile`,
  ADVICE: `${BASE_URL}/advice`,
  RANDOM_ADVICE: `${BASE_URL}/advice/random`,
  COMMENT: `${BASE_URL}/comment`,
  USER_PUBLIC: `${BASE_URL}/user`, // à compléter avec /:id
};
