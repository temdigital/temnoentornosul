// configuração simples do Supabase

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = "https://flidbkfrfosuahgphiza.supabase.co"
const supabaseKey = "sb_publishable_mCBYSpZc45Pw345wZ1coEA_rYL61Ea8"

export const supabase = createClient(supabaseUrl, supabaseKey)