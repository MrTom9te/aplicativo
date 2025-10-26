import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from "react-native";

// Define the possible variants for the button
type ButtonVariant = "primary" | "secondary" | "danger";

// Define the props for the CustomButton component
// We extend TouchableOpacityProps to accept all standard touchable props like onPress, style, etc.
interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant; // Make variant optional
  isLoading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  variant = "primary", // Set 'primary' as the default variant
  isLoading = false,
  disabled,
  style,
  ...rest // Collect the rest of the TouchableOpacityProps
}) => {
  // Determine styles based on the variant
  const containerStyle: ViewStyle[] = [
    styles.button,
    styles[`${variant}Container`],
  ];
  const textStyle: TextStyle[] = [styles.text, styles[`${variant}Text`]];

  const isButtonDisabled = disabled || isLoading;

  if (isButtonDisabled) {
    containerStyle.push(styles.disabled);
  }

  // Add external styles passed via props
  if (style) {
    containerStyle.push(style as ViewStyle);
  }

  return (
    <TouchableOpacity
      style={containerStyle}
      disabled={isButtonDisabled}
      activeOpacity={0.7}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          color={
            variant === "primary" || variant === "danger" ? "#fff" : "#007bff"
          }
        />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Base styles
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    minHeight: 50,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  // Variant container styles
  primaryContainer: {
    backgroundColor: "#007bff",
  },
  secondaryContainer: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#6c757d",
  },
  dangerContainer: {
    backgroundColor: "#dc3545",
  },
  // Variant text styles
  primaryText: {
    color: "#fff",
  },
  secondaryText: {
    color: "#6c757d",
  },
  dangerText: {
    color: "#fff",
  },
  // Disabled state
  disabled: {
    opacity: 0.65,
  },
});

export default CustomButton;
