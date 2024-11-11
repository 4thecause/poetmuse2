import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA0xLLqm32Vje5S6pnqYUbfaJQOdqxq7kE',
  authDomain: 'poetmuse-7e4cd.firebaseapp.com',
  projectId: 'poetmuse-7e4cd',
  storageBucket: 'poetmuse-7e4cd.firebasestorage.app',
  messagingSenderId: '465848109165',
  appId: '1:465848109165:web:f67ed1fe1e294d5e015764',
  measurementId: 'G-CME9THWZJG',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
