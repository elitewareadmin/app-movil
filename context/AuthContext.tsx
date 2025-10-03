import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import storage from '@/utils/storage';

interface AuthUser {
  name: string;
  email: string;
  createdAt: string;
}

interface StoredUser extends AuthUser {
  password: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isHydrating: boolean;
  authLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    payload: Pick<StoredUser, 'email' | 'name' | 'password'>
  ) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const USERS_STORAGE_KEY = '@metafashion:users';
const SESSION_STORAGE_KEY = '@metafashion:session';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function readUsers(): Promise<Record<string, StoredUser>> {
  const raw = await storage.getItem(USERS_STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, StoredUser>;
    return parsed ?? {};
  } catch (error) {
    console.warn('Failed to parse stored users', error);
    return {};
  }
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const sessionRaw = await storage.getItem(SESSION_STORAGE_KEY);
        if (sessionRaw) {
          const sessionUser: AuthUser = JSON.parse(sessionRaw);
          setUser(sessionUser);
        }
      } catch (storageError) {
        console.warn('Failed to restore session', storageError);
      } finally {
        setIsHydrating(false);
      }
    };

    hydrate();
  }, []);

  const persistSession = useCallback(async (nextUser: AuthUser | null) => {
    if (nextUser) {
      await storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      await storage.removeItem(SESSION_STORAGE_KEY);
    }
  }, []);

  const register = useCallback<AuthContextValue['register']>(
    async ({ email, name, password }) => {
      setAuthLoading(true);
      setError(null);

      try {
        if (!email || !name || !password) {
          throw new Error('Todos los campos son obligatorios.');
        }

        const normalisedEmail = email.trim().toLowerCase();
        const users = await readUsers();

        if (users[normalisedEmail]) {
          throw new Error('Ya existe una cuenta asociada a este correo.');
        }

        if (password.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres.');
        }

        const newUser: StoredUser = {
          email: normalisedEmail,
          name: name.trim(),
          password,
          createdAt: new Date().toISOString(),
        };

        const updatedUsers = {
          ...users,
          [normalisedEmail]: newUser,
        };

        await storage.setItem(
          USERS_STORAGE_KEY,
          JSON.stringify(updatedUsers)
        );

        const sessionUser: AuthUser = {
          email: newUser.email,
          name: newUser.name,
          createdAt: newUser.createdAt,
        };

        setUser(sessionUser);
        await persistSession(sessionUser);
      } catch (registerError) {
        if (registerError instanceof Error) {
          setError(registerError.message);
          throw registerError;
        }

        const fallbackError = new Error('No se pudo registrar la cuenta.');
        setError(fallbackError.message);
        throw fallbackError;
      } finally {
        setAuthLoading(false);
      }
    },
    [persistSession]
  );

  const login = useCallback<AuthContextValue['login']>(
    async (email, password) => {
      setAuthLoading(true);
      setError(null);

      try {
        if (!email || !password) {
          throw new Error('Debes ingresar tu correo y contraseña.');
        }

        const normalisedEmail = email.trim().toLowerCase();
        const users = await readUsers();
        const existingUser = users[normalisedEmail];

        if (!existingUser || existingUser.password !== password) {
          throw new Error('Credenciales inválidas, inténtalo nuevamente.');
        }

        const sessionUser: AuthUser = {
          email: existingUser.email,
          name: existingUser.name,
          createdAt: existingUser.createdAt,
        };

        setUser(sessionUser);
        await persistSession(sessionUser);
      } catch (loginError) {
        if (loginError instanceof Error) {
          setError(loginError.message);
          throw loginError;
        }

        const fallbackError = new Error('No se pudo iniciar sesión.');
        setError(fallbackError.message);
        throw fallbackError;
      } finally {
        setAuthLoading(false);
      }
    },
    [persistSession]
  );

  const logout = useCallback(async () => {
    setAuthLoading(true);
    setError(null);

    try {
      setUser(null);
      await persistSession(null);
    } finally {
      setAuthLoading(false);
    }
  }, [persistSession]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isHydrating,
      authLoading,
      error,
      login,
      register,
      logout,
      clearError,
    }),
    [authLoading, clearError, error, isHydrating, login, logout, register, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext debe utilizarse dentro de un AuthProvider');
  }

  return context;
}

