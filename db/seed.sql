INSERT INTO clientes (nombre, ciudad) VALUES
  ('Ana Torres', 'CDMX'),
  ('Luis Perez', 'Guadalajara'),
  ('Maria Gomez', 'Monterrey'),
  ('Carlos Ruiz', 'Puebla');

INSERT INTO productos (nombre, precio) VALUES
  ('Plan Basico', 9.00),
  ('Plan Pro', 29.00),
  ('Plan Team', 99.00);

INSERT INTO pedidos (cliente_id, producto_id, cantidad, total, fecha) VALUES
  (1, 2, 1, 29.00, '2026-01-12'),
  (2, 1, 2, 18.00, '2026-02-03'),
  (3, 3, 1, 99.00, '2026-02-20'),
  (1, 3, 1, 99.00, '2026-03-05'),
  (4, 2, 3, 87.00, '2026-03-18');
