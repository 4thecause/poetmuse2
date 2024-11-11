<script setup lang="ts">
import { ref, computed } from 'vue';
import { getSyllableCount } from '../services/datamuseService';
import RhymeSuggestions from './RhymeSuggestions.vue';
import SavePoemButton from './SavePoemButton.vue';

const emit = defineEmits<{
  (e: 'saved'): void;
  (e: 'error', message: string): void;
}>();

const title = ref('');
const poem = ref('');
const loading = ref(false);
const selectedLine = ref('');
const currentLineIndex = ref(-1);

const lines = computed(() => poem.value.split('\n'));
const syllableCount = ref<number[]>([]);

async function updateSyllableCounts() {
  loading.value = true;
  try {
    const counts = await Promise.all(
      lines.value.map(async (line) => {
        const words = line.trim().split(/\s+/).filter(Boolean);
        if (words.length === 0) return 0;

        const syllables = await Promise.all(
          words.map((word) => getSyllableCount(word))
        );
        return syllables.reduce((sum, count) => sum + count, 0);
      })
    );
    syllableCount.value = counts;
  } catch (error) {
    console.error('Error updating syllable counts:', error);
  } finally {
    loading.value = false;
  }
}

function handleLineClick(line: string, index: number) {
  selectedLine.value = line;
  currentLineIndex.value = index;
}

let debounceTimeout: number | undefined;
function handlePoemUpdate(newValue: string) {
  poem.value = newValue;
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }
  debounceTimeout = setTimeout(updateSyllableCounts, 500) as unknown as number;
}

function replaceLastWord(line: string, newWord: string): string {
  const match = line.match(/[\w']+[.,!?;:"'""''`\(\)\[\]{}]*$/);
  if (!match) return line;

  const lastWord = match[0];
  const punctuation = lastWord.match(/[.,!?;:"'""''`\(\)\[\]{}]*$/)?.[0] || '';
  return line.slice(0, -lastWord.length) + newWord + punctuation;
}
</script>

<template>
  <v-card class="mx-auto">
    <v-card-title class="text-h5 d-flex align-center justify-space-between">
      <span>Editor</span>
      <div class="d-flex align-center">
        <v-progress-circular
          v-if="loading"
          indeterminate
          size="20"
          width="2"
          color="primary"
          class="mr-2"
        ></v-progress-circular>
        <SavePoemButton
          :title="title"
          :content="poem"
          @saved="$emit('saved')"
          @error="(msg) => $emit('error', msg)"
        />
      </div>
    </v-card-title>

    <v-card-text>
      <v-text-field
        v-model="title"
        label="Poem Title"
        variant="outlined"
        class="mb-4"
      ></v-text-field>

      <div class="poem-container">
        <div class="syllable-counts" v-if="poem">
          <div
            v-for="(count, index) in syllableCount"
            :key="index"
            class="syllable-count"
            :class="{ selected: index === currentLineIndex }"
            @click="handleLineClick(lines[index], index)"
          >
            <v-chip
              size="small"
              :color="index === currentLineIndex ? 'primary' : 'grey'"
              variant="outlined"
              class="syllable-chip"
            >
              {{ count }}
            </v-chip>
          </div>
        </div>
        <v-textarea
          v-model="poem"
          @update:model-value="handlePoemUpdate"
          label="Write your poem here..."
          auto-grow      
          hide-details
          class="poem-input"
          :class="{ 'with-counts': poem }"
        ></v-textarea>
      </div>

      <RhymeSuggestions
        v-if="selectedLine"
        :line="selectedLine"
        @word-selected="
          (word) => {
            const newLines = [...lines];
            newLines[currentLineIndex] = replaceLastWord(selectedLine, word);
            poem = newLines.join('\n');
          }
        "
      />
    </v-card-text>
  </v-card>
</template>

<style scoped>
.poem-container {
  position: relative;
  display: flex;
  gap: 0.5rem;
}

.syllable-counts {
  display: flex;
  flex-direction: column;
  padding-top: 1.4rem;
  gap: 0.5rem;
}

.syllable-count {
  height: 2rem;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.syllable-chip {
  min-width: 2.5rem;
  height: 1.5rem !important;
  justify-content: center;
}

.poem-input {
  flex-grow: 1;
}

.poem-input :deep(textarea) {
  font-family: 'Georgia', serif;
  font-size: 1rem !important;
  line-height: 2.5rem !important;
  padding: 0 0.5rem !important;
  height: auto !important;
  resize: vertical;
}

.poem-input :deep(.v-field__field) {
  padding-top: 1em !important;
  border: 1px solid #000;
}

.poem-input :deep(.v-field__input) {
  --v-field-padding-top: 0 !important;
  padding-top: 0 !important;
}

.poem-input :deep(.v-field__overlay) {
  display: none;
}

.poem-input :deep(.v-label) {
  top: 0 !important;
  padding: 0.5em 0;
  margin: 0 0.5rem;
  font-size: 0.875rem;
  height: 1.75rem;
  opacity: 0.5;
}
</style>