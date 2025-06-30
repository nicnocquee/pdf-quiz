import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

const bodySchema = z.object({
  file: z.string()
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { file } = bodySchema.parse(json);

    const result = await generateObject({
      model: openai("gpt-4.1-mini"),
      schema: z.object({
        title: z
          .string()
          .describe(
            "A max three word title for the quiz based on the file provided as context"
          )
      }),
      prompt:
        "Generate a title for a quiz based on the following (PDF) file name. Try and extract as much info from the file name as possible. If the file name is just numbers or incoherent, just return quiz.\n\n " +
        file
    });

    return NextResponse.json({ title: result.object.title });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
