export interface Quote {
  text: string;
  reference?: string;
}

export interface Sense {
  definition: string;
  examples?: string[];
  synonyms?: string[];
  antonyms?: string[];
  quotes?: Quote[];
}

export interface MeaningEntry {
  partOfSpeech: string;
  forms?: string[];
  senses: Sense[];
  synonyms?: string[];
  antonyms?: string[];
}

export interface WordEntry {
  word: string;
  phonetic?: string;
  meanings: MeaningEntry[];
}

interface RawQuote {
  text?: string;
  reference?: string;
}

interface RawSense {
  definition?: string;
  examples?: string[];
  synonyms?: string[];
  antonyms?: string[];
  quotes?: RawQuote[];
}

interface RawForm {
  word?: string;
}

interface RawEntry {
  partOfSpeech?: string;
  pronunciations?: {
    type?: string;
    text?: string;
  }[];
  forms?: RawForm[];
  senses?: RawSense[];
  synonyms?: string[];
  antonyms?: string[];
}

interface RawDictionaryResponse {
  word?: string;
  entries?: RawEntry[];
}

export class DictionaryApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DictionaryApiError";
  }
}

export async function fetchWord(word: string): Promise<WordEntry> {
  const query = word.trim();

  if (!query) {
    throw new DictionaryApiError("Please enter a word.");
  }

  const response = await fetch(
    `https://freedictionaryapi.com/api/v1/entries/en/${encodeURIComponent(query)}`,
  );

  if (!response.ok) {
    throw new DictionaryApiError("Word not found.");
  }

  const data = (await response.json()) as RawDictionaryResponse;
  const firstEntry = data.entries?.[0];

  if (!firstEntry) {
    throw new DictionaryApiError("No definition available.");
  }

  const meanings =
    data.entries?.reduce<MeaningEntry[]>((accumulator, entry) => {
      if (!entry.partOfSpeech) {
        return accumulator;
      }

      const senses =
        entry.senses
          ?.filter((sense) => sense.definition)
          .map((sense) => ({
            definition: sense.definition ?? "",
            examples: sense.examples,
            synonyms: sense.synonyms,
            antonyms: sense.antonyms,
            quotes: sense.quotes
              ?.filter((q) => q.text)
              .map((q) => ({
                text: q.text ?? "",
                reference: q.reference,
              })),
          })) ?? [];

      if (senses.length === 0) {
        return accumulator;
      }

      const forms = entry.forms
        ?.map((form) => form.word)
        .filter((word): word is string => Boolean(word));

      accumulator.push({
        partOfSpeech: entry.partOfSpeech,
        forms: forms && forms.length > 0 ? forms : undefined,
        senses,
        synonyms: entry.synonyms,
        antonyms: entry.antonyms,
      });

      return accumulator;
    }, []) ?? [];

  if (meanings.length === 0) {
    throw new DictionaryApiError("No definition available.");
  }

  const phonetic = firstEntry.pronunciations?.find(
    (pronunciation) => pronunciation.text,
  )?.text;

  return {
    word: data.word ?? query,
    phonetic,
    meanings,
  };
}
