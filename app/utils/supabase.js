import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kwrqhxasfaikogdecvhm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3cnFoeGFzZmFpa29nZGVjdmhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDcwMDg4NzAsImV4cCI6MTk2MjU4NDg3MH0.tgmLz5JZTQ1E9cltorDixU5lWXHQcp2INPhIIq0RWx8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;