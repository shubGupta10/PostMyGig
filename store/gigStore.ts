// hooks/useGigStore.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Gig Data Types
interface Contact {
  email: string
  whatsapp: string
  x: string
}

export interface GigData {
  AcceptedFreelancerEmail: string
  budget: string
  contact: Contact
  createdAt: string
  createdBy: string
  description: string
  displayContactLinks: boolean
  expiresAt: string
  isFlagged: boolean
  reportCount: number
  skillsRequired: string[]
  status: string
  title: string
  updatedAt: string
}

interface GigState {
  gigData: GigData | null
  loading: boolean
  error: string | null

  setGigData: (gigData: GigData) => void
  updateGigData: (updates: Partial<GigData>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearGigData: () => void

  fetchGigData: (gigId: string) => Promise<void>
}

export const useGigStore = create<GigState>()(
  devtools(
    persist(
      (set) => ({
        gigData: null,
        loading: false,
        error: null,

        setGigData: (gigData) => set({ gigData, error: null }, false, 'setGigData'),

        updateGigData: (updates) =>
          set((state) => ({
            gigData: state.gigData ? { ...state.gigData, ...updates } : null
          }), false, 'updateGigData'),

        setLoading: (loading) => set({ loading }, false, 'setLoading'),

        setError: (error) => set({ error }, false, 'setError'),

        clearGigData: () => set({ gigData: null, error: null, loading: false }, false, 'clearGigData'),

        fetchGigData: async (gigId: string) => {
          set({ loading: true, error: null }, false, 'fetchGigData/start')

          try {
            const response = await fetch("/api/gig/details", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ gigId })
            })

            const data = await response.json()

            if (response.ok) {
              set({ gigData: data.gig, loading: false, error: null }, false, 'fetchGigData/success')
            } else {
              set({ loading: false, error: data.message || "Failed to fetch gig data" }, false, 'fetchGigData/error')
            }
          } catch (error) {
            console.error("Error fetching gig data:", error)
            set({ loading: false, error: "Network error occurred" }, false, 'fetchGigData/networkError')
          }
        }
      }),
      {
        name: 'gig-store',
        partialize: (state) => ({ gigData: state.gigData })
      }
    ),
    { name: 'gig-store' }
  )
)
