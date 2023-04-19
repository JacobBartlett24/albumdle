import { createBrowserClient } from '@supabase/auth-helpers-remix'
const supabaseUrl = process.env.SUPABASE_URL
const supabaseSecretKey = process.env.SUPABASE_KEY
export const supabase = createBrowserClient(supabaseUrl, supabaseSecretKey)