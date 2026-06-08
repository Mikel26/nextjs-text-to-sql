// Demo del guard de seguridad: comprueba que SOLO pasen SELECT válidos sobre tablas permitidas.
// Espeja la lógica de src/lib/guard.ts para poder correrse con `node` sin toolchain de TS.
// Uso: npm run test:guard   (o: node scripts/test-guard.mjs)
import pkg from "node-sql-parser";
const { Parser } = pkg;

const parser = new Parser();
const ALLOWED_TABLES = ["clientes", "productos", "pedidos"];

function assertSafeSelect(sql) {
  let ast;
  try {
    ast = parser.astify(sql, { database: "postgresql" });
  } catch {
    throw new Error("No se pudo parsear el SQL.");
  }
  const stmts = Array.isArray(ast) ? ast : [ast];
  if (stmts.length !== 1) throw new Error("Solo se permite un statement.");
  if (stmts[0].type !== "select") throw new Error("Solo se permiten consultas SELECT.");
  const tables = parser
    .tableList(sql, { database: "postgresql" })
    .map((t) => t.split("::").pop());
  for (const t of tables) {
    if (!ALLOWED_TABLES.includes(t)) throw new Error(`Tabla no permitida: ${t}`);
  }
}

const cases = [
  { sql: "SELECT c.ciudad, SUM(p.total) FROM clientes c JOIN pedidos p ON c.id = p.cliente_id GROUP BY c.ciudad", expect: "pass" },
  { sql: "SELECT * FROM productos", expect: "pass" },
  { sql: "DROP TABLE pedidos", expect: "reject" },
  { sql: "DELETE FROM pedidos", expect: "reject" },
  { sql: "UPDATE productos SET precio = 0", expect: "reject" },
  { sql: "SELECT * FROM pedidos; DROP TABLE pedidos", expect: "reject" },
  { sql: "SELECT * FROM usuarios_secretos", expect: "reject" },
];

let ok = 0;
for (const { sql, expect } of cases) {
  let result = "pass";
  let msg = "";
  try {
    assertSafeSelect(sql);
  } catch (e) {
    result = "reject";
    msg = e.message;
  }
  const good = result === expect;
  if (good) ok++;
  const icon = good ? "OK " : "XX ";
  const label = result === "reject" ? `RECHAZADO (${msg})` : "PERMITIDO";
  console.log(`${icon}[esperado: ${expect}] ${label}\n     ${sql}\n`);
}

console.log(`${ok}/${cases.length} casos como se esperaba.`);
process.exit(ok === cases.length ? 0 : 1);
