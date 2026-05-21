import { useThemeColor } from "@/hooks/use-theme-color";
import {
  DictionaryApiError,
  fetchWord,
  WordEntry,
} from "@/services/dictionary";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Platform,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import ViewShot from "react-native-view-shot";
import DictionaryCard from "./Card";

export default function WordModal({
  word,
  initialEntry,
  isFavorite,
  onToggleFavorite,
  onClose,
}: {
  word: string;
  initialEntry?: WordEntry;
  isFavorite: boolean;
  onToggleFavorite: (entry: WordEntry) => Promise<void>;
  onClose: () => void;
}) {
  const headerRef = useRef<any>(null);
  const [capturing, setCapturing] = useState(false);
  const [selectedMeaningIndex, setSelectedMeaningIndex] = useState(0);
  const [selectedDefinitionIndex, setSelectedDefinitionIndex] = useState(0);
  const { width: windowWidth } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({ light: "#666", dark: "#9BA1A6" }, "icon");
  const borderBottom = useThemeColor(
    { light: "#eee", dark: "#2a2a2a" },
    "background",
  );

  const {
    data: entry,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["dictionary", word],
    queryFn: () => fetchWord(word),
    enabled: !!word && !initialEntry,
    initialData: initialEntry,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const firstMeaning = entry?.meanings?.[selectedMeaningIndex];
  const firstDefinition =
    firstMeaning?.senses?.[selectedDefinitionIndex]?.definition;
  const captureWidth = Math.round(Math.min(420, windowWidth - 40));

  const captureAndDownload = async () => {
    try {
      setCapturing(true);
      const uri = await headerRef.current?.capture?.({ result: "data-uri" });

      if (!uri) {
        throw new Error("Unable to capture image");
      }

      if (Platform.OS === "web") {
        const link = document.createElement("a");
        link.href = uri;
        link.download = `${entry?.word ?? "dictionary"}_${selectedMeaningIndex + 1}_${selectedDefinitionIndex + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        Alert.alert("Downloaded", `${entry?.word} saved to your downloads.`);
        return;
      }

      if (Platform.OS === "android") {
        const downloadsUri =
          FileSystem.StorageAccessFramework.getUriForDirectoryInRoot(
            "Download",
          );
        const permission =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync(
            downloadsUri,
          );

        if (permission.granted) {
          const base64 = uri.split(",")[1];
          const fileName = `${entry?.word ?? "dictionary"}_${selectedMeaningIndex + 1}_${selectedDefinitionIndex + 1}_${Date.now()}`;
          const fileUri =
            await FileSystem.StorageAccessFramework.createFileAsync(
              permission.directoryUri,
              fileName,
              "image/png",
            );

          await FileSystem.writeAsStringAsync(fileUri, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });

          Alert.alert("Downloaded", `${entry?.word} saved to Downloads.`);
          return;
        }
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "image/png",
          dialogTitle: `Save ${entry?.word} definition`,
        });
      } else {
        Alert.alert("Downloaded", `${entry?.word} image is ready.`);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to download image");
      console.error(err);
    } finally {
      setCapturing(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!entry) return;
    await onToggleFavorite(entry);
  };

  useEffect(() => {
    // reset selected meaning when a new entry/word is loaded
    setSelectedMeaningIndex(0);
    setSelectedDefinitionIndex(0);
  }, [entry?.meanings?.length, word]);

  useEffect(() => {
    // clamp selectedDefinitionIndex if current meaning has fewer senses
    const len = firstMeaning?.senses?.length ?? 0;
    if (len === 0) {
      setSelectedDefinitionIndex(0);
    } else if (selectedDefinitionIndex >= len) {
      setSelectedDefinitionIndex(Math.max(0, len - 1));
    }
  }, [firstMeaning?.senses?.length, selectedDefinitionIndex]);

  return (
    <View style={{ flex: 1, backgroundColor: backgroundColor }}>
      {isLoading ? (
        <View style={{ padding: 20, alignItems: "center", marginTop: 20 }}>
          <ActivityIndicator color={textColor} />
          <Text style={{ marginTop: 8, color: textColor }}>
            Loading definition...
          </Text>
        </View>
      ) : null}

      {isError ? (
        <View style={{ padding: 20 }}>
          <Text style={{ color: "crimson" }}>
            {error instanceof DictionaryApiError
              ? error.message
              : "Unable to fetch definition."}
          </Text>
        </View>
      ) : null}

      {!isLoading && !isError && entry ? (
        <View
          style={{
            position: "relative",
            width: captureWidth,
            alignSelf: "center",
          }}
        >
          <View
            collapsable={false}
            style={{
              backgroundColor: backgroundColor,
              width: "100%",
              alignSelf: "stretch",
              overflow: "hidden",
            }}
          >
            <ViewShot
              ref={headerRef}
              options={{ format: "png", quality: 0.9, result: "data-uri" }}
              style={{
                backgroundColor: backgroundColor,
                width: "100%",
                alignSelf: "stretch",
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  position: "relative",
                  backgroundColor: backgroundColor,
                  width: captureWidth,
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: backgroundColor,
                  }}
                />
                <View
                  style={{
                    paddingHorizontal: 20,
                    paddingTop: 20,
                    paddingBottom: 16,
                    backgroundColor: backgroundColor,
                    width: captureWidth,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "bold",
                      color: textColor,
                    }}
                  >
                    {entry.word}
                  </Text>
                  {entry.phonetic && (
                    <Text
                      style={{ fontSize: 16, color: mutedColor, marginTop: 4 }}
                    >
                      /{entry.phonetic}/
                    </Text>
                  )}
                  {firstMeaning && (
                    <View style={{ marginTop: 12 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontStyle: "italic",
                          color: mutedColor,
                        }}
                      >
                        {firstMeaning.partOfSpeech}
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          marginTop: 8,
                          lineHeight: 22,
                          color: textColor,
                        }}
                      >
                        {firstDefinition || "No definition available."}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </ViewShot>
            {/* definition navigation controls */}
            <View
              style={{
                position: "absolute",
                top: 14,
                right: 94,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  setSelectedDefinitionIndex((i) => Math.max(0, i - 1))
                }
                disabled={
                  !firstMeaning ||
                  (firstMeaning.senses?.length ?? 0) <= 1 ||
                  selectedDefinitionIndex === 0
                }
                style={{
                  padding: 8,
                  opacity: selectedDefinitionIndex === 0 ? 0.4 : 1,
                }}
              >
                <Ionicons
                  name="chevron-back-outline"
                  size={20}
                  color={textColor}
                />
              </TouchableOpacity>

              <Text style={{ color: mutedColor, marginHorizontal: 6 }}>
                {firstMeaning
                  ? `${selectedDefinitionIndex + 1}/${firstMeaning.senses?.length ?? 0}`
                  : ""}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  const len = firstMeaning?.senses?.length ?? 0;
                  setSelectedDefinitionIndex((i) => Math.min(len - 1, i + 1));
                }}
                disabled={
                  !firstMeaning ||
                  (firstMeaning.senses?.length ?? 0) <= 1 ||
                  (firstMeaning.senses?.length ?? 0) - 1 ===
                    selectedDefinitionIndex
                }
                style={{
                  padding: 8,
                  opacity:
                    firstMeaning &&
                    (firstMeaning.senses?.length ?? 0) - 1 ===
                      selectedDefinitionIndex
                      ? 0.4
                      : 1,
                }}
              >
                <Ionicons
                  name="chevron-forward-outline"
                  size={20}
                  color={textColor}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                height: 1,
                width: "100%",
                backgroundColor: borderBottom,
              }}
            />
          </View>

          <TouchableOpacity
            onPress={handleToggleFavorite}
            style={{
              position: "absolute",
              top: 14,
              right: 54,
              padding: 10,
            }}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? "crimson" : textColor}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={captureAndDownload}
            disabled={capturing}
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              padding: 10,
              opacity: capturing ? 0.5 : 1,
            }}
          >
            <Ionicons name="download-outline" size={24} color={textColor} />
          </TouchableOpacity>
        </View>
      ) : null}

      <BottomSheetScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, alignItems: "center" }}
      >
        {!isLoading && !isError && entry ? (
          <>
            {entry.meanings.map((meaning, idx) => {
              const definitions = meaning.senses.map((s) => s.definition);
              const examples = meaning.senses
                .flatMap((s) => s.examples)
                .filter((e): e is string => Boolean(e));
              const quotes = meaning.senses
                .flatMap((s) => s.quotes ?? [])
                .filter((q) => Boolean(q));
              const synonyms = [
                ...(meaning.synonyms ?? []),
                ...meaning.senses.flatMap((s) => s.synonyms ?? []),
              ];
              const antonyms = [
                ...(meaning.antonyms ?? []),
                ...meaning.senses.flatMap((s) => s.antonyms ?? []),
              ];

              return (
                <DictionaryCard
                  key={idx}
                  style={{ width: "100%" }}
                  word={entry.word}
                  pronunciation={entry.phonetic}
                  partOfSpeech={meaning.partOfSpeech}
                  forms={meaning.forms}
                  definitions={definitions}
                  examples={examples.length > 0 ? examples : undefined}
                  quotes={quotes.length > 0 ? quotes : undefined}
                  synonyms={
                    synonyms.length > 0 ? [...new Set(synonyms)] : undefined
                  }
                  antonyms={
                    antonyms.length > 0 ? [...new Set(antonyms)] : undefined
                  }
                  onPress={() => {
                    setSelectedMeaningIndex(idx);
                    setSelectedDefinitionIndex(0);
                  }}
                  isSelected={selectedMeaningIndex === idx}
                  selectedDefinitionIndex={
                    selectedMeaningIndex === idx
                      ? selectedDefinitionIndex
                      : undefined
                  }
                  onSelectDefinition={(defIdx) => {
                    setSelectedMeaningIndex(idx);
                    setSelectedDefinitionIndex(defIdx);
                  }}
                />
              );
            })}
          </>
        ) : null}
      </BottomSheetScrollView>

      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: 10,
          width: captureWidth,
          alignSelf: "center",
        }}
      >
        <Button title="Close" onPress={onClose} />
      </View>
    </View>
  );
}
