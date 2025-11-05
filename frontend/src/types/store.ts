import type { User } from "./user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;

  setAccessToken: (accesssToken: string) => void;
  clearState: () => void;

  signUp: (
    email: string,
    phone_number: string,
    password: string
  ) => Promise<boolean>;

  signIn: (username: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  fetchMe: () => Promise<void>;
  refresh: () => Promise<void>;
}
