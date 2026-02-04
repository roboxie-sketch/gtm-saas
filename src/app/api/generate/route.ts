import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Server-side Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);


export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1️⃣ Get user session from request
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

    // 2️⃣ Generate GTM plan with OpenAI
    const prompt = `
You are a SaaS Go-To-Market expert.

Create a complete GTM strategy.

Product: ${body.product}
Target Audience: ${body.audience}
Price: ${body.price}
Business Goal: ${body.goal}

Include:
- Ideal Customer Profile
- Positioning & Messaging
- Acquisition Channels
- Content ideas
- 30-day launch plan
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const planText = completion.choices[0].message.content;

    // 3️⃣ Save plan to Supabase
    await supabase.from("gtm_plans").insert({
      user_id: user.id,
      product: body.product,
      audience: body.audience,
      price: body.price,
      goal: body.goal,
      plan: planText,
    });

    // 4️⃣ Return plan to frontend
    return NextResponse.json({ plan: planText });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
