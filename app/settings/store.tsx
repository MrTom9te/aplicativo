import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker"; // Assumindo o uso de expo-image-picker
import { useNavigation } from "expo-router"; // Para configurar o cabeçalho
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useStore } from "@/hooks/useStore";
import type { UpdateStoreRequest } from "@/types/store.types";

export default function PersonalizeStoreScreen() {
  const navigation = useNavigation();
  const { store, isLoading, error, refetch, updateStore } = useStore();

  const [saving, setSaving] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [storeSlug, setStoreSlug] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [deliveryEnabled, setDeliveryEnabled] = useState(false);
  const [pickupEnabled, setPickupEnabled] = useState(false);
  const [logoUri, setLogoUri] = useState<string | null>(null); // URI para preview
  const [logoBase64, setLogoBase64] = useState<string | null>(null); // Base64 para envio
  const [themeColor, setThemeColor] = useState("#FFC0CB"); // Placeholder for color picker
  const [font, setFont] = useState("Padrão"); // Placeholder for font picker
  const [productsLayout, setProductsLayout] = useState("Grade"); // Placeholder for layout picker

  // Quando a store carregar/atualizar, popular os estados da tela
  useEffect(() => {
    if (!store) return;
    setStoreName(store.name || "");
    setStoreSlug(store.slug || "");
    setStreet(store.street || "");
    setNumber(store.number || "");
    setNeighborhood(store.neighborhood || "");
    setCity(store.city || "");
    setState(store.state || "");
    setZipCode(store.zipCode || "");
    setDeliveryEnabled((store.supportedDeliveryTypes || []).includes("DELIVERY"));
    setPickupEnabled((store.supportedDeliveryTypes || []).includes("PICKUP"));
    setLogoUri(store.logoUrl || null);
    setThemeColor(store.themeColor || "#FFC0CB");
    setFont(store.fontFamily || "Padrão");
    setProductsLayout(store.layoutStyle === "list" ? "Lista" : "Grade");
  }, [store]);
const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      // Validação do slug
      const slugRegex = /^[a-zA-Z0-9-]+$/;
      if (!slugRegex.test(storeSlug)) {
        Alert.alert(
          "Erro",
          "A URL da loja (slug) deve conter apenas letras, números e hífens.",
        );
        setSaving(false);
        return;
      }

      const supportedDeliveryTypes: ("DELIVERY" | "PICKUP")[] = [];
      if (deliveryEnabled) supportedDeliveryTypes.push("DELIVERY");
      if (pickupEnabled) supportedDeliveryTypes.push("PICKUP");

      const payload: UpdateStoreRequest = {
        name: storeName,
        slug: storeSlug,
        street,
        number,
        neighborhood,
        city,
        state,
        zipCode,
        supportedDeliveryTypes,
        themeColor,
        layoutStyle: productsLayout === "Lista" ? "list" : "grid",
        fontFamily: font,
        imageBase64: logoBase64 || undefined,
      };

      const result = await updateStore(payload);
      if (!result.ok) {
        if (result.code === "DUPLICATE_SLUG") {
          Alert.alert("Erro", "Esta URL da loja já está em uso.");
        } else {
          Alert.alert("Erro", result.error || "Falha ao salvar as alterações.");
        }
        return;
      }

      // Atualiza a preview do logo se foi alterado e backend gerou URL
      if (result.data?.logoUrl) {
        setLogoUri(result.data.logoUrl);
        setLogoBase64(null);
      }

      Alert.alert("Sucesso", "Loja atualizada com sucesso!");
    } catch (error: any) {
      console.error("Falha ao salvar dados da loja", error);
      Alert.alert(
        "Erro",
        error.message || "Não foi possível salvar as alterações.",
      );
    } finally {
      setSaving(false);
    }
  }, [storeSlug, storeName, street, number, neighborhood, city, state, zipCode, deliveryEnabled, pickupEnabled, themeColor, productsLayout, font, logoBase64, updateStore]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={handleSave} disabled={saving}>
          <Text
            style={{
              color: saving ? "#ccc" : "#007AFF",
              marginRight: 15,
              fontSize: 16,
            }}
          >
            {saving ? <ActivityIndicator color="#007AFF" /> : "Salvar"}
          </Text>
        </Pressable>
      ),
      headerTitle: "Personalizar Loja", // Define o título da tela
    });
  }, [saving, handleSave]);

  
  const pickImage = async () => {
    // Pedir permissão para acessar a galeria de imagens
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos da permissão para acessar sua galeria de fotos para alterar o logo.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true, // Solicita a imagem em base64
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setLogoUri(selectedAsset.uri);
      // O Expo ImagePicker já fornece o base64 diretamente se 'base64: true' for usado
      if (selectedAsset.base64) {
        setLogoBase64(`data:image/jpeg;base64,${selectedAsset.base64}`);
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF69B4" />
        <Text style={styles.loadingText}>Carregando sua loja...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>{error}</Text>
        <Pressable style={styles.saveButton} onPress={refetch}>
          <Text style={styles.saveButtonText}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Seção 1: Informações Básicas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações Básicas</Text>
        <Text style={styles.label}>Nome da Loja</Text>
        <TextInput
          style={styles.input}
          value={storeName}
          onChangeText={setStoreName}
          placeholder="Ex: Doces da Maria"
        />
        <Text style={styles.label}>
          URL da sua loja (`doceponto.com/loja/`)
        </Text>
        <TextInput
          style={styles.input}
          value={storeSlug}
          onChangeText={(text) =>
            setStoreSlug(text.replace(/\s/g, "-").toLowerCase())
          } // Impede espaços e converte para minúsculas
          placeholder="Ex: doces-da-maria"
          autoCapitalize="none"
        />
        <Text style={styles.slugPreview}>
          doceponto.com/loja/{storeSlug || "..."}
        </Text>
      </View>

      {/* Seção 2: Endereço e Entregas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Endereço e Entregas</Text>
        <Text style={styles.label}>Rua</Text>
        <TextInput
          style={styles.input}
          value={street}
          onChangeText={setStreet}
        />
        <Text style={styles.label}>Número</Text>
        <TextInput
          style={styles.input}
          value={number}
          onChangeText={setNumber}
        />
        <Text style={styles.label}>Bairro</Text>
        <TextInput
          style={styles.input}
          value={neighborhood}
          onChangeText={setNeighborhood}
        />
        <Text style={styles.label}>Cidade</Text>
        <TextInput style={styles.input} value={city} onChangeText={setCity} />
        <Text style={styles.label}>Estado</Text>
        <TextInput style={styles.input} value={state} onChangeText={setState} />
        <Text style={styles.label}>CEP</Text>
        <TextInput
          style={styles.input}
          value={zipCode}
          onChangeText={setZipCode}
          keyboardType="numeric"
        />

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Habilitar Delivery</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={deliveryEnabled ? "#f5dd4b" : "#f4f3f4"}
            onValueChange={setDeliveryEnabled}
            value={deliveryEnabled}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Habilitar Retirada no Local</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={pickupEnabled ? "#f5dd4b" : "#f4f3f4"}
            onValueChange={setPickupEnabled}
            value={pickupEnabled}
          />
        </View>
      </View>

      {/* Seção 3: Aparência da Loja */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aparência da Loja</Text>

        <Text style={styles.label}>Logo da Loja</Text>
        <View style={styles.logoContainer}>
          <Image
            source={{
              uri:
                logoUri ||
                "https://via.placeholder.com/150/CCCCCC/000000?text=Logo",
            }}
            style={styles.logoPreview}
          />
          <Pressable style={styles.changeLogoButton} onPress={pickImage}>
            <Text style={styles.changeLogoButtonText}>Alterar Logo</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Cor do Tema</Text>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 15 }}>
          {[
            "#FFC0CB",
            "#8A2BE2",
            "#4CAF50",
            "#2196F3",
            "#FF9800",
            "#9E9E9E",
          ].map((c) => (
            <Pressable
              key={c}
              onPress={() => setThemeColor(c)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: c,
                borderWidth: themeColor === c ? 3 : 1,
                borderColor: themeColor === c ? "#333" : "#ddd",
              }}
            />
          ))}
        </View>

        <Text style={styles.label}>Fonte da Loja</Text>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 15 }}>
          {[
            "Inter",
            "System",
            "Cursive",
            "Sans-Serif",
          ].map((f) => (
            <Pressable
              key={f}
              onPress={() => setFont(f)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: font === f ? "#007AFF" : "#ddd",
                backgroundColor: font === f ? "#E6F0FF" : "#fff",
              }}
            >
              <Text style={{ color: "#333" }}>{f}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Layout dos Produtos</Text>
        {/* Placeholder para seletor de Layout */}
        <View style={styles.layoutPickerContainer}>
          <Pressable
            style={[
              styles.layoutOption,
              productsLayout === "Grade" && styles.layoutOptionSelected,
            ]}
            onPress={() => setProductsLayout("Grade")}
          >
            <MaterialCommunityIcons
              name="view-grid"
              size={24}
              color={productsLayout === "Grade" ? "#fff" : "#333"}
            />
            <Text
              style={[
                styles.layoutOptionText,
                productsLayout === "Grade" && styles.layoutOptionTextSelected,
              ]}
            >
              Grade
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.layoutOption,
              productsLayout === "Lista" && styles.layoutOptionSelected,
            ]}
            onPress={() => setProductsLayout("Lista")}
          >
            <MaterialCommunityIcons
              name="view-list"
              size={24}
              color={productsLayout === "Lista" ? "#fff" : "#333"}
            />
            <Text
              style={[
                styles.layoutOptionText,
                productsLayout === "Lista" && styles.layoutOptionTextSelected,
              ]}
            >
              Lista
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Botão Salvar Fixo (se não estiver no cabeçalho) */}
      <Pressable
        onPress={handleSave}
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        )}
      </Pressable>
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    color: "#333",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  slugPreview: {
    fontSize: 14,
    color: "#777",
    marginTop: -10,
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 5,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  logoPreview: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    backgroundColor: "#eee",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  changeLogoButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  changeLogoButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  colorPicker: {
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  colorPickerText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  pickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  pickerButtonText: {
    fontSize: 16,
    color: "#333",
  },
  layoutPickerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 5,
    marginBottom: 15,
  },
  layoutOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  layoutOptionSelected: {
    backgroundColor: "#007AFF",
  },
  layoutOptionText: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 5,
    color: "#333",
  },
  layoutOptionTextSelected: {
    color: "#fff",
  },
  saveButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  saveButtonDisabled: {
    backgroundColor: "#90ee90",
  },
});
