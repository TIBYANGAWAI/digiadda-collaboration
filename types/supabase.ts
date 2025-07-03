export type Role = "super_admin" | "sub_admin" | "team" | "client"

export interface AppUser {
  id: string
  email: string
  role: Role
  name?: string
  avatar?: string     // ✅ Add this line
  user_metadata?: {
    name?: string
    avatar?: string   // ✅ Optional: also add here for metadata-based fallback
    [key: string]: any
  }
}
// Dummy placeholder to avoid TS error for Database
export type Database = any
