import { defineStore } from 'pinia';
import { ref } from 'vue';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { auth } from '../firebase/config';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);

  // Initialize auth state
  onAuthStateChanged(auth, (newUser) => {
    user.value = newUser;
    loading.value = false;
  });

  async function signUp(email: string, password: string) {
    try {
      error.value = null;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      user.value = userCredential.user;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    }
  }

  async function signIn(email: string, password: string) {
    try {
      error.value = null;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      user.value = userCredential.user;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    }
  }

  async function signInWithGoogle() {
    try {
      error.value = null;
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      user.value = userCredential.user;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    }
  }

  async function signOut() {
    try {
      await firebaseSignOut(auth);
      user.value = null;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    }
  }

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut
  };
});