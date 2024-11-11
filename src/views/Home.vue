<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import PoemEditor from '../components/PoemEditor.vue';

const authStore = useAuthStore();
</script>

<template>
  <v-container>
    <PoemEditor />
  </v-container>
</template>