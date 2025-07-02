export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      // Add your tables here later if needed
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
