// Lo que el modelo "ve" de tu BD. Mantenlo curado: NO incluyas columnas sensibles.
export const SCHEMA_CONTEXT = `
Tablas disponibles (PostgreSQL):

clientes(id, nombre, ciudad, creado_en)
productos(id, nombre, precio)
pedidos(id, cliente_id -> clientes.id, producto_id -> productos.id, cantidad, total, fecha)

Reglas:
- Responde SOLO con una consulta SELECT de PostgreSQL.
- Usa los nombres exactos de tablas y columnas.
- No agregues explicaciones, solo el SQL.
`;
