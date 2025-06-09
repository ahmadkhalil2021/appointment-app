import { createClient } from "@supabase/supabase-js";

const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3d29zYW1lb2hpdHRwd2Ribnp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4Mzg2MzUsImV4cCI6MjA1ODQxNDYzNX0.WbJAyUXZffBBxn8Dw36SvxtXoR9wCjyipR318rEZrtk";

const SUPABASE_URL = "https://xwwosameohittpwdbnzx.supabase.co";
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
