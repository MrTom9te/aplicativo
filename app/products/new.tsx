import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useProducts } from "@/hooks/useProducts";
import type { CreateProductRequest } from "@/types/products.types";

const PINK = "#FF69B4";
const DARK_GRAY = "#333333";
const RED_ERROR = "#D32F2F";

export default function NewProductScreen() {
  const router = useRouter();
  const { createProduct } = useProducts();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permissão necessária",
            "Precisamos de acesso à sua galeria para adicionar fotos de produtos.",
          );
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    setError(null);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0].base64) {
        const base64String = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setImageBase64(base64String);
      }
    } catch (e) {
      setError("Não foi possível carregar a imagem. Tente novamente.");
    }
  };

  const handleSubmit = async () => {
    setError(null);
    if (!name.trim() || !description.trim() || !price.trim()) {
      setError("Por favor, preencha nome, descrição e preço.");
      return;
    }
    if (!imageBase64) {
      setError("Por favor, adicione uma foto para o produto.");
      return;
    }

    const productData: CreateProductRequest = {
      name,
      description,
      price: parseFloat(price.replace(",", ".")),
      imageBase64,
    };

    try {
      setIsSubmitting(true);
      await createProduct(productData);
      router.back(); // Volta para a lista de produtos
    } catch (e: any) {
      setError(e.message || "Falha ao criar o produto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Novo Produto" }} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.label}>Foto do Produto</Text>
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={pickImage}
          disabled={isSubmitting}
        >
          {imageBase64 ? (
            <Image source={{ uri: imageBase64 }} style={styles.previewImage} />
          ) : (
            <Text style={styles.imagePickerText}>
              Toque para adicionar uma foto
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Nome do Produto</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Bolo de Chocolate com Morango"
          value={name}
          onChangeText={setName}
          maxLength={100}
          editable={!isSubmitting}
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descreva os ingredientes, tamanho, etc."
          value={description}
          onChangeText={setDescription}
          multiline
          maxLength={500}
          editable={!isSubmitting}
        />

        <Text style={styles.label}>Preço (R$)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 45,50"
          value={price}
          onChangeText={(text) => setPrice(text.replace(/[^0-9,]/g, ""))}
          keyboardType="numeric"
          editable={!isSubmitting}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Salvar Produto</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  contentContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: DARK_GRAY,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  imagePicker: {
    height: 200,
    width: "100%",
    backgroundColor: "#e9ecef",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#ced4da",
    borderStyle: "dashed",
    overflow: "hidden",
  },
  imagePickerText: {
    color: "#6c757d",
    fontSize: 16,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  errorText: {
    color: RED_ERROR,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: PINK,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: "#FFC0CB", // Lighter pink
  },
});
