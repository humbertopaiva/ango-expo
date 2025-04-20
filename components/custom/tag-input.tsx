// Path: src/components/custom/tag-input.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { X, Plus } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  isDisabled?: boolean;
}

export function TagInput({
  tags,
  onTagsChange,
  label = "Tags",
  placeholder = "Adicionar tag...",
  error,
  isDisabled = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      const newTags = [...tags, inputValue.trim()];
      onTagsChange(newTags);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    onTagsChange(newTags);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.tagsContainer, error ? styles.inputError : null]}>
        {tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
            {!isDisabled && (
              <TouchableOpacity onPress={() => removeTag(index)}>
                <X size={16} color="white" />
              </TouchableOpacity>
            )}
          </View>
        ))}

        {!isDisabled && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder={placeholder}
              placeholderTextColor="#9CA3AF"
              onSubmitEditing={addTag}
              blurOnSubmit={false}
            />
            <TouchableOpacity onPress={addTag} style={styles.addButton}>
              <Plus size={16} color={THEME_COLORS.primary} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "white",
    minHeight: 48,
  },
  inputError: {
    borderColor: "#EF4444",
  },
  tag: {
    backgroundColor: THEME_COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  tagText: {
    color: "white",
    marginRight: 6,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    flex: 1,
    minWidth: 100,
  },
  input: {
    flex: 1,
    height: 30,
    fontSize: 14,
  },
  addButton: {
    padding: 4,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
  },
});
