import { createClient } from '@supabase/supabase-js';


// const SUPABASE_URL="https://aidcieypylrqmltrwclo.supabase.co"
// const SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZGNpZXlweWxycW1sdHJ3Y2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxNzI5NTYsImV4cCI6MjA1Mzc0ODk1Nn0.wEFZjx9LYs_7v9lwU9_ckH543g5qkTAp-HrkJSKvnTE"

const SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmdXFsYm5xdGplaWJpY3BmeGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxMjAzNjksImV4cCI6MjA1NDY5NjM2OX0.YSnEWWT6lWhKNUNYgmBxga2e9ro-u-gWGtOlsMmmTn8"
const SUPABASE_URL="https://sfuqlbnqtjeibicpfxhj.supabase.co"



// Ensure the credentials are set
if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing Supabase environment variables. Please set SUPABASE_URL and SUPABASE_KEY in your .env file.');
}

// Create and export the Supabase client
const supabase_client = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase_client;
