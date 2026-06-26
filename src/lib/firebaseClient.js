import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const clientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function assertClientConfig() {
  const missing = Object.entries(clientConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length) {
    throw new Error(
      `Variaveis Firebase client ausentes: ${missing.join(", ")}. Verifique o arquivo .env.local.`,
    );
  }
}

export function getFirebaseAuth() {
  assertClientConfig();
  const app = getApps()[0] || initializeApp(clientConfig);
  return getAuth(app);
}