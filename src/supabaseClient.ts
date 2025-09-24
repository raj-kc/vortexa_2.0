// filepath: src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://qyzzprwsuyvamnlimprs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5enpwcndzdXl2YW1ubGltcHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2OTcyNzgsImV4cCI6MjA3NDI3MzI3OH0.vHyjO2gMfFihajFrOraxi5cwXnRslhomqtIRBHba_qY';
export const supabase = createClient(supabaseUrl, supabaseKey);