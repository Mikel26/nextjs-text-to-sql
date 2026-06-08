"use client";
import { useState } from "react";

type Result = { sql: string; rows: Record<string, unknown>[] };

export default function Home() {
  const [q, setQ] = useState("");
  const [res, setRes] = useState<Result | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setRes(null);
    try {
      const r = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      setRes(data);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  const cols = res?.rows[0] ? Object.keys(res.rows[0]) : [];
  const cell = { borderBottom: "1px solid #eee", padding: 6, textAlign: "left" as const };

  return (
    <main style={{ maxWidth: 760, margin: "40px auto", fontFamily: "system-ui", padding: "0 16px" }}>
      <h1>Chat con tus datos <span style={{ color: "#999", fontWeight: 400 }}>(Lite)</span></h1>
      <p style={{ color: "#666" }}>Pregunta en lenguaje natural. Ej: &quot;¿Cuánto vendimos por ciudad?&quot;</p>

      <form onSubmit={ask} style={{ display: "flex", gap: 8 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Escribe tu pregunta..."
          style={{ flex: 1, padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
        />
        <button disabled={loading} style={{ padding: "10px 16px", borderRadius: 8 }}>
          {loading ? "..." : "Preguntar"}
        </button>
      </form>

      {err && <p style={{ color: "crimson" }}>⚠ {err}</p>}

      {res && (
        <>
          <h3>SQL generado</h3>
          <pre style={{ background: "#f5f5f5", padding: 12, borderRadius: 8, overflow: "auto" }}>{res.sql}</pre>
          <h3>Resultado ({res.rows.length})</h3>
          <div style={{ overflow: "auto" }}>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>{cols.map((c) => <th key={c} style={{ ...cell, borderBottom: "2px solid #ddd" }}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {res.rows.map((row, i) => (
                  <tr key={i}>{cols.map((c) => <td key={c} style={cell}>{String(row[c])}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}
