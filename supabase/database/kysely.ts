import type { Database as SupabaseDatabase } from "./supabase.ts";
import type { KyselifyDatabase } from "kysely-supabase";

export type Database = KyselifyDatabase<SupabaseDatabase>;
