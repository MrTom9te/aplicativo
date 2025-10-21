// app/(auth)/_layout.tsx
import { Stack } from "expo-router";

const LIGHT_GRAY = "#FAFAFA";

/**
 * @file app/(auth)/_layout.tsx
 * @brief Layout para as telas de autenticação (Login e Registro).
 *
 * Este componente define a estrutura de navegação e as opções de tela para
 * as rotas de autenticação. Ele utiliza `expo-router` para gerenciar um
 * empilhamento de telas (`Stack`) onde o cabeçalho padrão é desativado.
 *
 * @component AuthLayout
 *
 * @returns {JSX.Element} Um componente `Stack` do `expo-router` configurado
 * para as telas de login e registro.
 *
 * @example
 * // Este layout é automaticamente aplicado às rotas dentro do diretório (auth).
 * // Não é necessário importá-lo ou usá-lo diretamente em outros componentes.
 */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: "Registrar",
          gestureEnabled: true,
        }}
      />
    </Stack>
  );
}
