import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";

type StorageRecord = Record<string, string>;

const STORAGE_DIR = `${FileSystem.documentDirectory ?? ""}ledict-storage`;
const STORAGE_FILE = `${STORAGE_DIR}/store.json`;
const WEB_STORAGE_KEY = "ledict-storage";

let cache: StorageRecord | null = null;
let loadPromise: Promise<StorageRecord> | null = null;

async function ensureStorageDir() {
  if (!FileSystem.documentDirectory) {
    return;
  }

  await FileSystem.makeDirectoryAsync(STORAGE_DIR, { intermediates: true });
}

function sanitizeRecord(value: unknown): StorageRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.entries(value).reduce<StorageRecord>((result, [key, item]) => {
    if (typeof item === "string") {
      result[key] = item;
    }

    return result;
  }, {});
}

async function readRecord(): Promise<StorageRecord> {
  if (cache) {
    return cache;
  }

  if (!loadPromise) {
    loadPromise = (async () => {
      try {
        if (Platform.OS === "web" && typeof window !== "undefined") {
          const raw = window.localStorage.getItem(WEB_STORAGE_KEY);
          return raw ? sanitizeRecord(JSON.parse(raw)) : {};
        }

        await ensureStorageDir();

        const info = await FileSystem.getInfoAsync(STORAGE_FILE);
        if (!info.exists) {
          return {};
        }

        const raw = await FileSystem.readAsStringAsync(STORAGE_FILE);
        return sanitizeRecord(JSON.parse(raw));
      } catch {
        return {};
      }
    })().finally(() => {
      loadPromise = null;
    });
  }

  cache = await loadPromise;
  return cache;
}

async function writeRecord(record: StorageRecord): Promise<void> {
  cache = record;

  try {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(record));
      return;
    }

    await ensureStorageDir();
    await FileSystem.writeAsStringAsync(STORAGE_FILE, JSON.stringify(record));
  } catch {
    // Ignore storage write failures so the app keeps working without persistence.
  }
}

export async function getStoredItem(key: string): Promise<string | null> {
  const record = await readRecord();
  return Object.prototype.hasOwnProperty.call(record, key) ? record[key] : null;
}

export async function setStoredItem(key: string, value: string): Promise<void> {
  const record = await readRecord();
  await writeRecord({ ...record, [key]: value });
}
