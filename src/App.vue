<script setup lang="ts">
import { useAuthStore } from "./stores/auth";

const authStore = useAuthStore();
</script>

<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-title>PoetMuse</v-app-bar-title>
      <v-spacer></v-spacer>
      <template v-if="authStore.user">
        <v-btn @click="authStore.signOut">Logout</v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>

    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }} PoetMuse</span>
    </v-footer>
  </v-app>
</template>
