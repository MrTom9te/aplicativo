import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";

// Mock data fetching function - replace with your actual API call
const fetchProductById = async (id: string) => {
  console.log(`Buscando dados para o produto com ID: ${id}`);
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    id,
    name: "Bolo de Chocolate (Exemplo)",
    description: "Um delicioso bolo de chocolate para festas.",
    price: "45.50",
    imageUrl: `https://via.placeholder.com/400x300.png?text=Produto+${id}`, // URL da imagem existente
  };
};

export default function EditProductScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  // O estado da imagem agora pode conter a URL existente ou a nova imagem (uri local + base64)
  const [image, setImage] = useState<{
    uri: string | null;
    base64: string | null;
  }>({ uri: null, base64: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof id === "string") {
      const loadProductData = async () => {
        try {
          const product = await fetchProductById(id);
          setName(product.name);
          setDescription(product.description);
          setPrice(product.price);
          setImage({ uri: product.imageUrl, base64: null }); // Define a imagem inicial com a URL existente
        } catch (error) {
          Alert.alert("Erro", "Não foi possível carregar os dados do produto.");
        } finally {
          setLoading(false);
        }
      };
      loadProductData();
    }
  }, [id]);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permissão Necessária",
        "É necessário permitir o acesso à galeria.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets[0].base64) {
      const selected = result.assets[0];
      // Atualiza o estado com a nova imagem (URI local para preview e base64 para envio)
      setImage({
        uri: selected.uri,
        base64: `data:image/jpeg;base64,${selected.base64}`,
      });
    }
  };

  const handleUpdate = () => {
    if (!name || !description || !price) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    // Constrói o payload para a API
    const productUpdateData: {
      name: string;
      description: string;
      price: number;
      imageBase64?: string | null;
    } = {
      name,
      description,
      price: parseFloat(price),
    };

    // Adiciona a imagem base64 ao payload APENAS se uma nova imagem foi selecionada
    if (image?.base64) {
      productUpdateData.imageBase64 = image.base64;
    }

    console.log(
      `Enviando atualização para o produto ID ${id}:`,
      productUpdateData,
    );
    Alert.alert(
      "Sucesso",
      "Produto atualizado (simulação). Verifique o console.",
    );
    // Aqui você faria a chamada real para a API (PUT /api/products/:id)
    // Ex: await api.put(`/products/${id}`, productUpdateData);
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Carregando produto...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Editar Produto</Text>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image?.uri ? (
          <Image source={{ uri: image.uri }} style={styles.previewImage} />
        ) : (
          <Text style={styles.imagePickerText}>
            Toque para adicionar uma foto
          </Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Nome do produto</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Preço</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <View style={styles.buttonContainer}>
        <Button title="Salvar Alterações" onPress={handleUpdate} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  imagePicker: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    marginBottom: 20,
  },
  imagePickerText: {
    color: "#aaa",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40, // Adiciona espaço no final do scroll
  },
});
