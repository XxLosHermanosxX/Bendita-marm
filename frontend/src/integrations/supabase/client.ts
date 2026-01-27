import { createClient } from '@supabase/supabase-js';

// Usando as credenciais fornecidas
const supabaseUrl = 'https://inpjpmtjpfkkbqukpkhs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlucGpwbXRqcGZra2JxdWtwa2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNjE0MzksImV4cCI6MjA4MzYzNzQzOX0.nBgRF3Lu9h1FHLNsy3gXcWnuXMpCs3aV_dtesA2f-Qg';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);