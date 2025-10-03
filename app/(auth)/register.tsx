import { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { useAuthContext } from '@/context/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, authLoading, error, clearError } = useAuthContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLocalError(null);
    clearError();

    if (password !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await register({ name, email, password });
      router.replace('/(tabs)');
    } catch (submitError) {
      if (submitError instanceof Error) {
        setLocalError(submitError.message);
      } else {
        setLocalError('No se pudo completar el registro.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Typography variant="h2" style={styles.title}>
            Crea tu cuenta
          </Typography>
          <Typography variant="body2" color={Colors.dark.secondaryText}>
            Únete para guardar tus looks favoritos y recibir novedades exclusivas.
          </Typography>

          <View style={styles.formGroup}>
            <Typography variant="subtitle2" style={styles.label}>
              Nombre completo
            </Typography>
            <TextInput
              placeholder="Nombre Apellido"
              placeholderTextColor={Colors.dark.secondaryText}
              style={styles.input}
              value={name}
              onChangeText={setName}
              onFocus={() => {
                setLocalError(null);
                clearError();
              }}
            />
          </View>

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
              placeholder="Mínimo 6 caracteres"
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

          <View style={styles.formGroup}>
            <Typography variant="subtitle2" style={styles.label}>
              Confirmar contraseña
            </Typography>
            <TextInput
              placeholder="Repite tu contraseña"
              placeholderTextColor={Colors.dark.secondaryText}
              secureTextEntry
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
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
            title="Crear cuenta"
            onPress={handleSubmit}
            variant="gradient"
            loading={authLoading}
          />

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.back()}
          >
            <Typography variant="body2" color={Colors.gold.primary}>
              ¿Ya tienes una cuenta? Inicia sesión
            </Typography>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
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
  loginButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  errorContainer: {
    backgroundColor: 'rgba(244, 67, 54, 0.12)',
    padding: 12,
    borderRadius: 8,
  },
});
