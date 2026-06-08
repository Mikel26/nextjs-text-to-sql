import { Pool } from "pg";

// Pool conectado con el rol de SOLO LECTURA (ver db/readonly_role.sql).
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Ejecuta dentro de una transaccion READ ONLY: capa extra de defensa.
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
