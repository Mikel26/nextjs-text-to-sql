-- Rol de SOLO LECTURA: el feature de IA se conecta con este, nunca con un superusuario.
CREATE ROLE ai_readonly LOGIN PASSWORD 'changeme';
GRANT CONNECT ON DATABASE app TO ai_readonly;
GRANT USAGE ON SCHEMA public TO ai_readonly;
GRANT SELECT ON clientes, productos, pedidos TO ai_readonly;
ALTER ROLE ai_readonly SET statement_timeout = '5s';
-- Sin INSERT/UPDATE/DELETE ni DDL.
