# Chat con tus datos — Lite 🐘🤖

Feature de **text-to-SQL** ("pregúntale a tus datos en lenguaje natural") para **Next.js + PostgreSQL**, con una base de seguridad sensata. Pregunta en español → SQL → resultado en tabla.

> Este es el **Lite** (gratis, MIT). Funciona y es seguro para probar. La versión **Pro** trae el endurecimiento completo de producción (ver abajo).

## Demo

**▶ Pruébalo en vivo:** https://nextjs-text-to-sql-green.vercel.app/

Escribe *"¿Cuánto vendimos por ciudad?"* y obtienes el SQL generado + la tabla de resultados, contra una base de datos demo.

## ⚡ Quickstart

Requisitos: Node 18+, Docker (para Postgres) y una API key de Groq (gratis, sin tarjeta).

```bash
# 1. Base de datos demo (crea esquema, datos y el rol read-only)
docker compose up -d

# 2. Dependencias
npm install

# 3. Variables de entorno
cp .env.example .env   # añade tu GROQ_API_KEY

# 4. Arranca
npm run dev            # http://localhost:3000
```

## 🧠 Cómo funciona

Pipeline en 3 pasos (`src/app/api/query/route.ts`):

1. **NL → SQL** — el LLM genera SQL a partir de la pregunta y el esquema (`src/lib/llm.ts`).
2. **Guard** — se valida por AST que sea un único `SELECT` sobre tablas permitidas (`src/lib/guard.ts`).
3. **Ejecución read-only** — se corre con un rol de BD de solo lectura, en transacción `READ ONLY` (`src/lib/db.ts`).

## 🔒 Seguridad incluida (y lo que falta)

El Lite ya trae la base que **nunca** deberías omitir:

- ✅ Rol de BD de **solo lectura** + transacción `READ ONLY`
- ✅ Validación por **AST**: solo `SELECT`, un statement, allowlist de tablas
- ✅ `statement_timeout` y tope de filas
- ✅ La pregunta del usuario se trata como **dato**, separada de las instrucciones
- ✅ Se muestra el SQL generado (humano en el loop)

La versión **Pro** añade lo necesario para producción seria:

- 🔓 Row-level security / aislamiento por tenant y enmascarado de PII
- 🔓 **Abstención**: detectar baja confianza y no responder (en vez de inventar)
- 🔓 Control de **costo de tokens** (router de modelos + caché)
- 🔓 Defensas reforzadas contra prompt injection (P2SQL)
- 🔓 Set de **evals** para medir precisión antes de lanzar

→ Guía completa + repo Pro: **(próximamente — tu link de Gumroad)**
→ Cómo blindarlo, explicado paso a paso: **(próximamente — tu link al post)**

## ⚠️ Aviso

Es una base educativa. Revisa y adapta la seguridad a tu caso antes de exponerla a usuarios reales.

## Licencia

MIT — ver [LICENSE](./LICENSE).
