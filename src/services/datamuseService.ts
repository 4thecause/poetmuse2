interface DatamuseWord {
  word: string;
  score: number;
  numSyllables?: number;
  tags?: string[];
}

// Clean word from punctuation and special characters
function cleanWord(word: string): string {
  return word.toLowerCase()
    .replace(/[.,!?;:"'""''`\(\)\[\]{}]/g, '')
    .replace(/\s+/g, '')
    .trim();
}

export async function getSyllableCount(word: string): Promise<number> {
  const cleanedWord = cleanWord(word);
  if (!cleanedWord) return 0;

  try {
    const response = await fetch(`https://api.datamuse.com/words?sp=${cleanedWord}&md=s`);
    const data: DatamuseWord[] = await response.json();
    return data[0]?.numSyllables ?? countSyllablesLocally(cleanedWord);
  } catch (error) {
    return countSyllablesLocally(cleanedWord);
  }
}

export async function getRhymingWords(word: string): Promise<DatamuseWord[]> {
  const cleanedWord = cleanWord(word);
  if (!cleanedWord) return [];

  try {
    const response = await fetch(`https://api.datamuse.com/words?rel_rhy=${cleanedWord}&max=10`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching rhyming words:', error);
    return [];
  }
}

// Fallback local syllable counter
function countSyllablesLocally(word: string): number {
  word = word.toLowerCase();
  word = word.replace(/(?:[^laeiouy]|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 0;
}