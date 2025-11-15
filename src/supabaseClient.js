import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://jumwmpgneycbbiwqebos.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1bXdtcGduZXljYmJpd3FlYm9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNTM4NTgsImV4cCI6MjA3ODcyOTg1OH0.OeDlRUTNg2PAZlfdM0L3dLUx7Im7VStSq29RGfUcyQ0"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)