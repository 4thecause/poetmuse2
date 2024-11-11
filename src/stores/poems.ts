import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db } from '../firebase/config';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { useAuthStore } from './auth';

export interface Poem {
  id?: string;
  title: string;
  content: string;
  createdAt?: any;
  updatedAt?: any;
  userId: string;
}

export const usePoemsStore = defineStore('poems', () => {
  const poems = ref<Poem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const authStore = useAuthStore();

  async function fetchPoems() {
    if (!authStore.user) return;
    
    loading.value = true;
    try {
      const q = query(
        collection(db, 'poems'),
        where('userId', '==', authStore.user.uid)
      );
      const querySnapshot = await getDocs(q);
      poems.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Poem[];
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  }

  async function savePoem(poem: Omit<Poem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    if (!authStore.user) throw new Error('User must be logged in');
    
    loading.value = true;
    try {
      const docRef = await addDoc(collection(db, 'poems'), {
        ...poem,
        userId: authStore.user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function updatePoem(id: string, updates: Partial<Poem>) {
    if (!authStore.user) throw new Error('User must be logged in');
    
    loading.value = true;
    try {
      const docRef = doc(db, 'poems', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function deletePoem(id: string) {
    if (!authStore.user) throw new Error('User must be logged in');
    
    loading.value = true;
    try {
      await deleteDoc(doc(db, 'poems', id));
      poems.value = poems.value.filter(poem => poem.id !== id);
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return {
    poems,
    loading,
    error,
    fetchPoems,
    savePoem,
    updatePoem,
    deletePoem
  };
});