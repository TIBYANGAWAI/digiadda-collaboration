export type Role = "super_admin" | "sub_admin" | "team" | "client"

export interface AppUser {
  id: string
  email: string
  role: Role
  name?: string
  user_metadata?: {
    name?: string
    [key: string]: any
  }
}
