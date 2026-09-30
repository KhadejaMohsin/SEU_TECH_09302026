import "server-only";
import OpenAI from "openai";

const model = "gpt-4.1-mini";

export async function probeQuestion(question: string) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured on the server.");
  }

  const client = new OpenAI({ apiKey });
  const response = await client.responses.create({
    model,
    input: question,
  });

  if (!response.output_text) {
    throw new Error("OpenAI returned no text for the question.");
  }

  return {
    provider: "openai" as const,
    model: response.model || model,
    responseText: response.output_text,
  };
}