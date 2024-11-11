<script setup lang="ts">
import { ref } from 'vue';
import { usePoemsStore } from '../stores/poems';

const props = defineProps<{
  title: string;
  content: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'saved'): void;
  (e: 'error', message: string): void;
}>();

const poemsStore = usePoemsStore();

async function savePoem() {
  if (!props.title || !props.content) {
    emit('error', 'Please provide both title and content');
    return;
  }

  try {
    await poemsStore.savePoem({
      title: props.title,
      content: props.content
    });
    emit('saved');
  } catch (error) {
    emit('error', 'Error saving poem');
  }
}
</script>

<template>
  <v-btn
    color="primary"
    @click="savePoem"
    :disabled="disabled || !title || !content"
    :loading="poemsStore.loading"
  >
    Save Poem
  </v-btn>
</template>