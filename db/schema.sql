CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  ciudad TEXT,
  creado_en DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE productos (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  precio NUMERIC(10,2) NOT NULL
);

CREATE TABLE pedidos (
  id SERIAL PRIMARY KEY,
  cliente_id INT NOT NULL REFERENCES clientes(id),
  producto_id INT NOT NULL REFERENCES productos(id),
  cantidad INT NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE
);
