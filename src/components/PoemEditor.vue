<script setup lang="ts">
import { ref } from 'vue';
import PoemForm from './PoemForm.vue';
import PoemList from './PoemList.vue';

const saveStatus = ref('');

function handleSaved() {
  saveStatus.value = 'Poem saved successfully!';
  setTimeout(() => {
    saveStatus.value = '';
  }, 3000);
}

function handleError(message: string) {
  saveStatus.value = message;
  setTimeout(() => {
    saveStatus.value = '';
  }, 3000);
}
</script>

<template>
  <v-row>
    <v-col cols="12" md="8">
      <v-alert
        v-if="saveStatus"
        :type="saveStatus.includes('Error') ? 'error' : 'success'"
        variant="tonal"
        class="mb-4"
      >
        {{ saveStatus }}
      </v-alert>

      <PoemForm
        @saved="handleSaved"
        @error="handleError"
      />
    </v-col>

    <v-col cols="12" md="4">
      <PoemList />
    </v-col>
  </v-row>
</template>