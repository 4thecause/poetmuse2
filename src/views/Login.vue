<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

async function handleSubmit() {
  loading.value = true;
  error.value = '';
  
  try {
    await authStore.signIn(email.value, password.value);
    router.push('/');
  } catch (e: any) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

async function handleGoogleSignIn() {
  loading.value = true;
  error.value = '';
  
  try {
    await authStore.signInWithGoogle();
    router.push('/');
  } catch (e: any) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card>
          <v-card-title class="text-center text-h5 py-4">
            Login to PoetMuse
          </v-card-title>
          
          <v-card-text>
            <v-form @submit.prevent="handleSubmit">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                required
              ></v-text-field>
              
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                required
              ></v-text-field>

              <v-alert
                v-if="error"
                type="error"
                variant="tonal"
                class="mb-4"
              >
                {{ error }}
              </v-alert>

              <v-btn
                block
                color="primary"
                type="submit"
                :loading="loading"
                class="mb-4"
              >
                Login
              </v-btn>

              <v-btn
                block
                color="error"
                @click="handleGoogleSignIn"
                :loading="loading"
                class="mb-4"
              >
                Sign in with Google
              </v-btn>

              <div class="text-center">
                <router-link to="/signup">Don't have an account? Sign up</router-link>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>