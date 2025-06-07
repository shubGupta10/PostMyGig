import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface ContactLinks {
  label: string
  url: string
}

interface UserData {
  _id: string
  name: string
  email: string
  bio: string
  contactLinks: ContactLinks[]
  createdAt: string
  updatedAt: string
  isBanned: boolean
  location: string
  profilePhoto: string
  provider: string
  reportCount: number
  role: "freelancer" | "client" | "admin"
  skills: string[]
  activityPublic?: boolean
}

interface UserState {
  // State
  userData: UserData | null
  loading: boolean
  error: string | null
  
  // Actions
  setUserData: (userData: UserData) => void
  updateUserData: (updates: Partial<UserData>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearUserData: () => void
  
  // API Actions
  fetchUserData: (userId: string) => Promise<void>
  updateActivityPublic: (activityPublic: boolean) => Promise<boolean>
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        userData: null,
        loading: false,
        error: null,

        // Basic Actions
        setUserData: (userData) => 
          set({ userData, error: null }, false, 'setUserData'),

        updateUserData: (updates) => 
          set((state) => ({
            userData: state.userData ? { ...state.userData, ...updates } : null
          }), false, 'updateUserData'),

        setLoading: (loading) => 
          set({ loading }, false, 'setLoading'),

        setError: (error) => 
          set({ error }, false, 'setError'),

        clearUserData: () => 
          set({ userData: null, error: null, loading: false }, false, 'clearUserData'),

        // API Actions
        fetchUserData: async (userId: string) => {
          set({ loading: true, error: null }, false, 'fetchUserData/start')
          
          try {
            const response = await fetch("/api/user/profile", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ userId })
            })

            const data = await response.json()

            if (response.status === 200) {
              set({ 
                userData: data.user, 
                loading: false, 
                error: null 
              }, false, 'fetchUserData/success')
            } else {
              set({ 
                loading: false, 
                error: data.message || "Failed to fetch user data" 
              }, false, 'fetchUserData/error')
            }
          } catch (error) {
            console.error("Error fetching user data:", error)
            set({ 
              loading: false, 
              error: "Network error occurred" 
            }, false, 'fetchUserData/networkError')
          }
        },

        updateActivityPublic: async (activityPublic: boolean): Promise<boolean> => {
          const currentUserData = get().userData
          if (!currentUserData) return false

          try {
            const response = await fetch("/api/user/toggleActivityPublic", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ activityPublic })
            })

            const data = await response.json()

            if (response.ok) {
              // Update the store with the new activityPublic value
              set((state) => ({
                userData: state.userData ? {
                  ...state.userData,
                  activityPublic
                } : null
              }), false, 'updateActivityPublic/success')
              
              return true
            } else {
              console.error("Failed to update activity visibility:", data.message || "Unknown error")
              set({ error: data.message || "Failed to update activity visibility" }, false, 'updateActivityPublic/error')
              return false
            }
          } catch (error) {
            console.error("Error updating activity visibility:", error)
            set({ error: "Network error occurred while updating activity visibility" }, false, 'updateActivityPublic/networkError')
            return false
          }
        }
      }),
      {
        name: 'user-store', // localStorage key
        partialize: (state) => ({ 
          userData: state.userData 
        }), // Only persist userData, not loading/error states
      }
    ),
    {
      name: 'user-store', // DevTools name
    }
  )
)

// Selectors (optional but recommended for better performance)
export const useUserData = () => useUserStore(state => state.userData)
export const useUserLoading = () => useUserStore(state => state.loading)
export const useUserError = () => useUserStore(state => state.error)

// Computed selectors
export const useIsUserBanned = () => useUserStore(state => state.userData?.isBanned ?? false)
export const useUserRole = () => useUserStore(state => state.userData?.role)
export const useIsActivityPublic = () => useUserStore(state => state.userData?.activityPublic ?? false)