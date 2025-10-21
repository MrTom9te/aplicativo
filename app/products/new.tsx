
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CreateProductRequest } from "@/types/lib";

const PINK = "#FF69B4";
const LIGHT_GRAY = "#F7F7F7";
const DARK_GRAY = "#333333";

export default function ProductFormScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    // Validação
    if (!name || !description || !price) {
      Alert.alert("Erro", "Preencha nome, descrição e preço.");
      return;
    }

    const productData: CreateProductRequest = {
      name,
      description,
      price: parseFloat(price.replace(",", ".")),
      imageUrl,
    };

    console.log("Salvando produto:", productData);
    setIsSaving(true);

    // Simula chamada de API
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert("Sucesso", "Produto salvo!");
      router.back();
    }, 1000);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={DARK_GRAY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Produto</Text>
      </View>

      {/* Formulário */}
      <View style={styles.form}>
        {/* Imagem */}
        <TouchableOpacity style={styles.imagePicker}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
          ) : (
            <>
              <MaterialCommunityIcons name="camera" size={40} color="#999" />
              <Text style={styles.imagePickerText}>Adicionar Foto</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Campos de Texto */}
        <Text style={styles.label}>Nome do Produto</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Bolo de Chocolate"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Descreva os detalhes do seu produto..."
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={styles.label}>Preço</Text>
        <TextInput
          style={styles.input}
          placeholder="R$ 0,00"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <Text style={styles.label}>URL da Imagem (Opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="https://exemplo.com/imagem.jpg"
          value={imageUrl}
          onChangeText={setImageUrl}
          autoCapitalize="none"
        />

        {/* Toggle Ativo */}
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Produto Ativo</Text>
          <Switch
            value={isActive}
            onValueChange={setIsActive}
            trackColor={{ false: "#ccc", true: "#fcd4e7" }}
            thumbColor={isActive ? PINK : "#f4f3f4"}
          />
        </View>
      </View>

      {/* Botão Salvar */}
      <TouchableOpacity
        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={isSaving}
      >
        <Text style={styles.saveButtonText}>
          {isSaving ? "Salvando..." : "Salvar Produto"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_GRAY,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
    color: DARK_GRAY,
  },
  form: {
    padding: 20,
  },
  imagePicker: {
    height: 150,
    backgroundColor: "#eee",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  imagePickerText: {
    marginTop: 8,
    color: "#777",
    fontWeight: "500",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: DARK_GRAY,
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: DARK_GRAY,
  },
  saveButton: {
    backgroundColor: PINK,
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
