<script setup lang="ts">
import { onMounted } from 'vue';
import { usePoemsStore } from '../stores/poems';
import { formatDistanceToNow } from 'date-fns';

const poemsStore = usePoemsStore();

onMounted(() => {
  poemsStore.fetchPoems();
});

function formatDate(timestamp: any) {
  if (!timestamp) return '';
  const date = timestamp.toDate();
  return formatDistanceToNow(date, { addSuffix: true });
}
</script>

<template>
  <v-card>
    <v-card-title class="text-h6">
      My Poems
      <v-progress-circular
        v-if="poemsStore.loading"
        indeterminate
        size="20"
        width="2"
        color="primary"
        class="ml-2"
      ></v-progress-circular>
    </v-card-title>

    <v-card-text>
      <v-list v-if="poemsStore.poems.length > 0">
        <v-list-item
          v-for="poem in poemsStore.poems"
          :key="poem.id"
          :title="poem.title"
          :subtitle="formatDate(poem.updatedAt)"
        >
          <template v-slot:append>
            <v-btn
              icon="mdi-delete"
              variant="text"
              color="error"
              size="small"
              @click="poemsStore.deletePoem(poem.id!)"
            ></v-btn>
          </template>
        </v-list-item>
      </v-list>
      <v-alert
        v-else-if="!poemsStore.loading"
        type="info"
        text="No poems yet. Start writing!"
        variant="tonal"
      ></v-alert>
    </v-card-text>
  </v-card>
</template>