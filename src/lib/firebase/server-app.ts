import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';

// This service account is automatically generated and provided by Firebase App Hosting.
// It does not require any manual configuration or environment variables.
const serviceAccount = {
  projectId: "finanzen-sokph",
  clientEmail: "firebase-adminsdk-vj5i0@finanzen-sokph.iam.gserviceaccount.com",
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
};

const app = !getApps().length ? initializeApp({
    // Use cert(serviceAccount) only if privateKey is available.
    // In many environments (like App Hosting), GOOGLE_APPLICATION_CREDENTIALS is set,
    // and initializeApp() will automatically use it.
    credential: serviceAccount.privateKey ? cert(serviceAccount) : undefined,
    databaseURL: "https://finanzen-sokph-default-rtdb.firebaseio.com"
}) : getApp();


export { app };
