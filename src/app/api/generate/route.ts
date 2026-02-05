import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs"; // IMPORTANT

export async function POST(req: Request) {
  try {
    // Create OpenAI client at runtime (not build time)
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Server-side Supabase client (service role)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const body = await req.json();

    // Get user token
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) {
      return NextResponse.json({ error: "Invalid user" }, { status: 401 });
    }

    // Generate GTM plan
    const prompt = `
You are a SaaS Go-To-Market expert.

Product: ${body.product}
Audience: ${body.audience}
Price: ${body.price}
Goal: ${body.goal}

Create:
- ICP
- Positioning
- Channels
- Messaging
- 30-day launch plan
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const planText = completion.choices[0].message.content;

    // Save to database
    await supabase.from("gtm_plans").insert({
      user_id: user.id,
      product: body.product,
      audience: body.audience,
      price: body.price,
      goal: body.goal,
      plan: planText,
    });

    return NextResponse.json({ plan: planText });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 }
    );
  }
}
