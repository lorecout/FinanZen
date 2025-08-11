import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';

const serviceAccount = {
  projectId: "finanzen-sokph",
  clientEmail: "firebase-adminsdk-vj5i0@finanzen-sokph.iam.gserviceaccount.com",
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

const app = !getApps().length ? initializeApp({ credential: cert(serviceAccount), databaseURL: "https://finanzen-sokph-default-rtdb.firebaseio.com" }) : getApp();

export { app };
