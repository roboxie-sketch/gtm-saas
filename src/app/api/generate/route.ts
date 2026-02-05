import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

/**
 * CRITICAL:
 * These two lines prevent Next.js from touching this file at build time
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // ✅ OpenAI created ONLY at request time
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // ✅ Server-side Supabase (service role)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const body = await req.json();

    // Auth
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) {
      return NextResponse.json({ error: "Invalid user" }, { status: 401 });
    }

    // Prompt
    const prompt = `
You are a SaaS Go-To-Market expert.

Product: ${body.product}
Audience: ${body.audience}
Price: ${body.price}
Goal: ${body.goal}

Create:
- ICP
- Positioning
- Messaging
- Channels
- 30-day launch plan
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const plan = completion.choices[0].message.content;

    // Save
    await supabase.from("gtm_plans").insert({
      user_id: user.id,
      product: body.product,
      audience: body.audience,
      price: body.price,
      goal: body.goal,
      plan,
    });

    return NextResponse.json({ plan });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 }
    );
  }
}
