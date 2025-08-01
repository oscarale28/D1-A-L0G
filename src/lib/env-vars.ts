const {
  VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID
} = import.meta.env;

export const EnvConfig = {
  firebaseAPIKey: VITE_FIREBASE_API_KEY,
  firebaseAuthDomain: VITE_FIREBASE_AUTH_DOMAIN,
  firebaseProjectId: VITE_FIREBASE_PROJECT_ID,
  firebaseStorageBucket: VITE_FIREBASE_STORAGE_BUCKET,
  firebaseMessagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
  firebaseAppId: VITE_FIREBASE_APP_ID
};