import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";
import dotenv from "dotenv";

const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export const supabase = createClient<Database>(supabaseUrl!, supabaseKey!);
