<script setup lang="ts">
import { ref, watch } from 'vue'
import { getRhymingWords } from '../services/datamuseService'

const props = defineProps<{
  line: string
}>()

const emit = defineEmits<{
  (e: 'word-selected', word: string): void
}>()

const rhymes = ref<Array<{ word: string; score: number }>>([])
const loading = ref(false)

async function updateRhymes() {
  const words = props.line.trim().split(/\s+/)
  if (words.length === 0) return

  const lastWord = words[words.length - 1].replace(/[.,!?;:"'""''`\(\)\[\]{}]*$/, '')
  if (!lastWord) return

  loading.value = true
  try {
    rhymes.value = await getRhymingWords(lastWord)
  } catch (error) {
    console.error('Error fetching rhymes:', error)
  } finally {
    loading.value = false
  }
}

watch(() => props.line, updateRhymes, { immediate: true })
</script>

<template>
  <v-card>
    <v-card-title class="text-h6">
      Rhyming Suggestions
      <v-progress-circular
        v-if="loading"
        indeterminate
        size="1.25rem"
        width="0.125rem"
        color="primary"
        class="ml-2"
      ></v-progress-circular>
    </v-card-title>

    <v-card-text>
      <v-list v-if="rhymes.length > 0">
        <v-list-item
          v-for="rhyme in rhymes"
          :key="rhyme.word"
          :title="rhyme.word"
          link
          @click="emit('word-selected', rhyme.word)"
        >
        </v-list-item>
      </v-list>
      <v-alert
        v-else-if="!loading"
        type="info"
        text="No rhyming words found"
        variant="tonal"
      ></v-alert>
    </v-card-text>
  </v-card>
</template>