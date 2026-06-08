import { NextRequest, NextResponse } from "next/server";
import { generateSql } from "@/lib/llm";
import { assertSafeSelect } from "@/lib/guard";
import { runReadonlyQuery } from "@/lib/db";

const MAX_ROWS = Number(process.env.MAX_ROWS ?? 200);

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();
    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Falta la pregunta." }, { status: 400 });
    }

    const sql = await generateSql(question); // 1. NL -> SQL
    assertSafeSelect(sql);                    // 2. valida (SELECT, 1 statement, allowlist)
    const rows = await runReadonlyQuery(sql); // 3. ejecuta con rol read-only

    // Capa 6 del post: devolvemos el SQL para mostrarselo al usuario.
    return NextResponse.json({ sql, rows: rows.slice(0, MAX_ROWS) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error inesperado.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
