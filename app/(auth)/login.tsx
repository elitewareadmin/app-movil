import { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { useAuthContext } from '@/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login, authLoading, error, clearError } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLocalError(null);
    clearError();

    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (submitError) {
      if (submitError instanceof Error) {
        setLocalError(submitError.message);
      } else {
        setLocalError('No se pudo iniciar sesión.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.card}>
        <Typography variant="h2" style={styles.title}>
          Bienvenido de nuevo
        </Typography>
        <Typography variant="body2" color={Colors.dark.secondaryText}>
          Accede para descubrir colecciones exclusivas y experiencias
          personalizadas.
        </Typography>

        <View style={styles.formGroup}>
          <Typography variant="subtitle2" style={styles.label}>
            Correo electrónico
          </Typography>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="usuario@ejemplo.com"
            placeholderTextColor={Colors.dark.secondaryText}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            onFocus={() => {
              setLocalError(null);
              clearError();
            }}
          />
        </View>

        <View style={styles.formGroup}>
          <Typography variant="subtitle2" style={styles.label}>
            Contraseña
          </Typography>
          <TextInput
            placeholder="••••••••"
            placeholderTextColor={Colors.dark.secondaryText}
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            onFocus={() => {
              setLocalError(null);
              clearError();
            }}
          />
        </View>

        {(localError || error) && (
          <View style={styles.errorContainer}>
            <Typography variant="caption" color={Colors.status.error}>
              {localError ?? error}
            </Typography>
          </View>
        )}

        <Button
          title="Iniciar sesión"
          onPress={handleSubmit}
          variant="gradient"
          loading={authLoading}
          style={styles.submitButton}
        />

        <TouchableOpacity
          style={styles.recoverButton}
          onPress={() => router.push('/(auth)/register')}
        >
          <Typography variant="body2" color={Colors.gold.primary}>
            ¿No tienes cuenta? Regístrate
          </Typography>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    padding: 24,
    gap: 16,
  },
  title: {
    textAlign: 'center',
  },
  formGroup: {
    gap: 8,
  },
  label: {
    color: Colors.dark.secondaryText,
  },
  input: {
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 16,
    backgroundColor: Colors.dark.card,
    color: Colors.dark.text,
    borderWidth: 1,
    borderColor: Colors.dark.divider,
  },
  submitButton: {
    marginTop: 8,
  },
  recoverButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  errorContainer: {
    backgroundColor: 'rgba(244, 67, 54, 0.12)',
    padding: 12,
    borderRadius: 8,
  },
});
