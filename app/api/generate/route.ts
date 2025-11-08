// app/api/generate/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export async function POST(req: Request) {
  try {
    const { title } = await req.json();

    if (!title) {
      return NextResponse.json(
        { error: "Judul card tidak boleh kosong" },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "deskripsikan langsung intinya dengan apa yang ditanyakan.",
        },
        {
          role: "user",
          content: `Dari Open ai: "${title}"`,
        },
      ],
      max_tokens: 30,
    });

    const description =
      response.choices[0]?.message?.content?.trim() || "Tidak ada deskripsi.";

    return NextResponse.json({ description });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return NextResponse.json(
      { error: "Gagal generate deskripsi" },
      { status: 500 }
    );
  }
}
