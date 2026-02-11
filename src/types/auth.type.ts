import type {User} from "./user.type.ts";

export interface AuthSlice {
    user: User | null;
    isAuthReady: boolean;
    signInAnonymouslyAndCreateUser: () => Promise<void>;
    listenToAuthState: () => () => void;
    updateUserProfile: (data: Partial<User>) => Promise<void>;
    linkWithGoogle: () => Promise<void>;
    linkWithEmail: (email: string, password: string) => Promise<void>;
    loginWithGoogle: (rememberMe?: boolean) => Promise<void>;
    loginWithEmail: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
    registerWithEmail: (email: string, password: string, phone: string, rememberMe?: boolean) => Promise<void>;
    logout: () => Promise<void>;
}