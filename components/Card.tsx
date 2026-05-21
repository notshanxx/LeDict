import { useThemeColor } from "@/hooks/use-theme-color";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export interface Quote {
  text: string;
  reference?: string;
}

type Props = {
  style?: StyleProp<ViewStyle>;
  word: string;
  pronunciation?: string;
  partOfSpeech: string;
  forms?: string[];
  definitions: string[];
  examples?: string[];
  quotes?: Quote[];
  synonyms?: string[];
  antonyms?: string[];
  onPress?: () => void;
  isSelected?: boolean;
  selectedDefinitionIndex?: number;
  onSelectDefinition?: (index: number) => void;
};

export default function DictionaryCard({
  style,
  word,
  pronunciation,
  partOfSpeech,
  forms,
  definitions,
  examples,
  quotes,
  synonyms,
  antonyms,
  onPress,
  isSelected,
  selectedDefinitionIndex,
  onSelectDefinition,
}: Props) {
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const muted = useThemeColor({ light: "#666", dark: "#9BA1A6" }, "icon");
  const activeColor = useThemeColor({}, "tabIconSelected");

  const content = (
    <>
      <View style={styles.header}>
        <Text style={[styles.word, { color: textColor }]}>{word}</Text>
        {pronunciation && (
          <Text style={[styles.pronunciation, { color: muted }]}>
            /{pronunciation}/
          </Text>
        )}
      </View>

      <Text style={[styles.partOfSpeech, { color: muted }]}>
        {partOfSpeech}
      </Text>

      {forms && forms.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Forms</Text>
          <Text style={[styles.sectionContent, { color: textColor }]}>
            {forms.join(", ")}
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          Definitions
        </Text>
        {definitions.map((def, idx) => {
          const isDefSelected = selectedDefinitionIndex === idx;
          const defText = (
            <Text
              key={idx}
              style={[
                styles.definition,
                { color: isDefSelected ? activeColor : textColor },
              ]}
            >
              {idx + 1}. {def}
            </Text>
          );

          if (onSelectDefinition) {
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => onSelectDefinition(idx)}
                activeOpacity={0.7}
              >
                {defText}
              </TouchableOpacity>
            );
          }

          return defText;
        })}
      </View>

      {examples && examples.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Examples</Text>
          {examples.map((example, idx) => (
            <Text key={idx} style={styles.example}>
              • {example}
            </Text>
          ))}
        </View>
      )}

      {quotes && quotes.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Quotes
          </Text>
          {quotes.map((quote, idx) => (
            <View
              key={idx}
              style={[styles.quoteContainer, { borderLeftColor: muted }]}
            >
              <Text style={[styles.quote, { color: textColor }]}>
                {'"'}
                {quote.text}
                {'"'}
              </Text>
              {quote.reference && (
                <Text style={[styles.quoteReference, { color: muted }]}>
                  — {quote.reference}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {synonyms && synonyms.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Synonyms
          </Text>
          <Text style={[styles.sectionContent, { color: textColor }]}>
            {synonyms.join(", ")}
          </Text>
        </View>
      )}

      {antonyms && antonyms.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Antonyms
          </Text>
          <Text style={[styles.sectionContent, { color: textColor }]}>
            {antonyms.join(", ")}
          </Text>
        </View>
      )}
    </>
  );

  const cardStyle = [
    styles.card,
    { backgroundColor: background },
    style,
    isSelected ? { borderColor: activeColor, borderWidth: 2 } : null,
  ];

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={cardStyle} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{content}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 10,
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    elevation: 3,
  },
  selected: {
    borderColor: "#007aff",
    borderWidth: 2,
  },
  header: {
    marginBottom: 12,
  },
  word: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  pronunciation: {
    color: "#666",
    marginTop: 4,
    fontSize: 14,
  },
  partOfSpeech: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#888",
    marginBottom: 12,
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  sectionContent: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  definition: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 6,
  },
  example: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    marginBottom: 4,
    fontStyle: "italic",
  },
  quoteContainer: {
    marginBottom: 10,
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#ddd",
  },
  quote: {
    fontSize: 13,
    color: "#555",
    lineHeight: 19,
    fontStyle: "italic",
  },
  quoteReference: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
});
