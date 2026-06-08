import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

// Postgres en la nube (Neon, Supabase, etc.) requiere SSL; en local (Docker) no.
const isLocal =
  !connectionString ||
  connectionString.includes("localhost") ||
  connectionString.includes("127.0.0.1");

// Idealmente el DATABASE_URL usa un rol de SOLO LECTURA (ver db/readonly_role.sql).
export const pool = new Pool({
  connectionString,
  ssl: isLocal ? undefined : { rejectUnauthorized: false },
});

// Transacción READ ONLY: ningún write puede ocurrir aquí, sin importar el rol.
export async function runReadonlyQuery(sql: string) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN TRANSACTION READ ONLY");
    const res = await client.query(sql);
    await client.query("COMMIT");
    return res.rows;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
