import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";

export default function NewProductScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);

  // Request permission on component mount (for web and mobile)
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
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5, // Reduce quality to keep Base64 string smaller
        base64: true, // This is the key change
      });

      if (!result.canceled && result.assets && result.assets[0].base64) {
        // The Base64 string is prefixed with `data:image/jpeg;base64,` which is what many systems expect
        const base64String = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setImageBase64(base64String);
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem: ", error);
      Alert.alert(
        "Erro",
        "Não foi possível carregar a imagem. Tente novamente.",
      );
    }
  };

  const handlePriceChange = (text: string) => {
    // Allow only numbers and a single comma or dot for decimals
    const formattedText = text.replace(/[^0-9,.]/g, "").replace(",", ".");
    setPrice(formattedText);
  };

  const handleSubmit = async () => {
    // Simple validation
    if (!name.trim() || !description.trim() || !price.trim()) {
      Alert.alert(
        "Campos obrigatórios",
        "Por favor, preencha nome, descrição e preço.",
      );
      return;
    }

    const productData = {
      name,
      description,
      price: parseFloat(price), // API expects a number
      imageBase64, // Can be null if no image is selected
    };

    console.log(
      "Enviando para a API:",
      `Nome: ${productData.name}, Preço: ${productData.price}, Imagem Base64: ${productData.imageBase64 ? productData.imageBase64.substring(0, 50) + "..." : "Nenhuma"}`,
    );
    Alert.alert(
      "Produto Salvo (Simulação)",
      "Os dados do produto foram impressos no console.",
    );

    // --- LÓGICA DE INTEGRAÇÃO COM A API IRIA AQUI ---
    /*
    try {
      // Exemplo de como seria a chamada à API
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer SEU_TOKEN_JWT',
        },
        body: JSON.stringify(productData),
      });

      const responseData = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso!', 'Produto criado com sucesso.');
        router.back(); // Volta para a lista de produtos
      } else {
        throw new Error(responseData.error || 'Falha ao criar produto');
      }
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      Alert.alert('Erro na API', error.message);
    }
    */
  };

  return (
    <>
      <Stack.Screen options={{ title: "Novo Produto" }} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.label}>Foto do Produto</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
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
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descreva os ingredientes, tamanho, etc."
          value={description}
          onChangeText={setDescription}
          multiline
          maxLength={500}
        />

        <Text style={styles.label}>Preço (R$)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 45.50"
          value={price}
          onChangeText={handlePriceChange}
          keyboardType="numeric"
        />

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Produto Ativo</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isActive ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setIsActive((previousState) => !previousState)}
            value={isActive}
          />
        </View>
        <Text style={styles.switchHelperText}>
          Produtos inativos não aparecem no seu site de vendas.
        </Text>

        <View style={styles.buttonGroup}>
          <CustomButton
            title="Cancelar"
            onPress={() => router.back()}
            style={styles.cancelButton}
          />
          <CustomButton
            title="Salvar Produto"
            onPress={handleSubmit}
            style={styles.button}
          />
        </View>
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
    color: "#343a40",
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
    overflow: "hidden", // Ensures the image respects the border radius
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
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  switchHelperText: {
    fontSize: 12,
    color: "#6c757d",
    marginBottom: 30,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#6c757d",
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#6c757d",
  },
});
