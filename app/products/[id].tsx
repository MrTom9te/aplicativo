import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
  Switch,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useProducts } from "@/hooks/useProducts";
import { Product, UpdateProductRequest } from "@/types/products.types";
import api from "@/lib/api";
import { SucessResponse } from "@/types/api.types";

const PINK = "#FF69B4";
const DARK_GRAY = "#333333";
const RED_ERROR = "#D32F2F";

export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { updateProduct } = useProducts();

  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [newImageBase64, setNewImageBase64] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<SucessResponse<Product>>(
          `/products/${id}`,
        );
        if (response.data.success && response.data.data) {
          const fetchedProduct = response.data.data;
          setProduct(fetchedProduct);
          setName(fetchedProduct.name);
          setDescription(fetchedProduct.description);
          setPrice(String(fetchedProduct.price).replace(".", ","));
          setIsActive(fetchedProduct.isActive);
        } else {
          throw new Error("Produto não encontrado.");
        }
      } catch (e) {
        setError("Não foi possível carregar o produto.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const pickImage = async () => {
    // ... (código do pickImage é o mesmo da tela de criação)
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0].base64) {
        const base64String = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setNewImageBase64(base64String);
      }
    } catch (e) {
      setError("Não foi possível carregar a imagem.");
    }
  };

  const handleUpdate = async () => {
    if (!id) return;
    setError(null);

    const productData: UpdateProductRequest = {
      name,
      description,
      price: parseFloat(price.replace(",", ".")),
      isActive,
    };

    if (newImageBase64) {
      productData.imageBase64 = newImageBase64;
    }

    try {
      setIsSubmitting(true);
      await updateProduct(id, productData);
      router.back();
    } catch (e: any) {
      setError(e.message || "Falha ao atualizar o produto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={PINK} />
      </View>
    );
  }

  if (error && !product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Editar Produto" }} />
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
          <Image
            source={{ uri: newImageBase64 || product?.imageUrl }}
            style={styles.previewImage}
          />
        </TouchableOpacity>

        <Text style={styles.label}>Nome do Produto</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          editable={!isSubmitting}
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          multiline
          editable={!isSubmitting}
        />

        <Text style={styles.label}>Preço (R$)</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={(text) => setPrice(text.replace(/[^0-9,]/g, ""))}
          keyboardType="numeric"
          editable={!isSubmitting}
        />

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Produto Ativo</Text>
          <Switch
            value={isActive}
            onValueChange={setIsActive}
            disabled={isSubmitting}
          />
        </View>
        <Text style={styles.switchHelperText}>
          Produtos inativos não aparecem no seu site de vendas.
        </Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleUpdate}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Salvar Alterações</Text>
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    borderWidth: 1,
    borderColor: "#ced4da",
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ced4da",
  },
  switchHelperText: {
    fontSize: 12,
    color: "#6c757d",
    marginBottom: 30,
    paddingHorizontal: 5,
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
    backgroundColor: "#FFC0CB",
  },
});
