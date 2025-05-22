import {create} from 'zustand'
import {signOut} from 'next-auth/react'

interface AuthStore {
    handleLogout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
    handleLogout: async () => {
        await signOut({
            callbackUrl: "/auth/login"
        })
        localStorage.clear();
    }
}))