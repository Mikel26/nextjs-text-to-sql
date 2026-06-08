import { Parser } from "node-sql-parser";

const parser = new Parser();
const ALLOWED_TABLES = ["clientes", "productos", "pedidos"];

// Valida por AST: un solo statement, de tipo SELECT, sobre tablas permitidas.
// (El Pro endurece esto: subconsultas, funciones peligrosas, columnas con PII, etc.)
export function assertSafeSelect(sql: string): void {
  let ast;
  try {
    ast = parser.astify(sql, { database: "postgresql" });
  } catch {
    throw new Error("No se pudo parsear el SQL generado.");
  }
  const stmts = Array.isArray(ast) ? ast : [ast];
  if (stmts.length !== 1) throw new Error("Solo se permite un statement.");
  if ((stmts[0] as { type?: string }).type !== "select") {
    throw new Error("Solo se permiten consultas SELECT.");
  }
  const tables = parser
    .tableList(sql, { database: "postgresql" })
    .map((t) => t.split("::").pop() ?? "");
  for (const t of tables) {
    if (!ALLOWED_TABLES.includes(t)) throw new Error(`Tabla no permitida: ${t}`);
  }
}
