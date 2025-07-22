
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { EnvConfig } from './env-vars';

const firebaseConfig = {
  apiKey: EnvConfig.firebaseAPIKey,
  authDomain: EnvConfig.firebaseAuthDomain,
  projectId: EnvConfig.firebaseProjectId,
  storageBucket: EnvConfig.firebaseStorageBucket,
  messagingSenderId: EnvConfig.firebaseMessagingSenderId,
  appId: EnvConfig.firebaseAppId
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
