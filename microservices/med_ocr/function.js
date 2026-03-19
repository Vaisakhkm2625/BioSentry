// functions/src/index.ts
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import OpenAI from "openai";
import { logger } from "firebase-functions/v2";

// ────────────────────────────────────────────────
// Secrets (use Firebase CLI secrets or .env-style params)
const openAiKey = defineSecret("OPENAI_API_KEY");

// Optional: set region & memory if needed
// export const extractMedicine = onCall(
//   { region: "asia-south1", secrets: [openAiKey], memory: "512MB" },
//   async (request) => { ... }
// );

export const extractMedicineFromImage = onCall(
  { secrets: [openAiKey] },    // makes OPENAI_API_KEY available
  async (request) => {
    // ─── Security: only authenticated users ───────────────────────
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "You must be signed in to use this feature."
      );
    }

    // Optional: you can also do role/user checks here
    // if (request.auth.token.admin !== true) { ... }

    const data = request.data;

    if (!data?.imageBase64 || typeof data.imageBase64 !== "string") {
      throw new HttpsError(
        "invalid-argument",
        "Field 'imageBase64' is required and must be a base64 string."
      );
    }

    const imageBase64 = data.imageBase64.trim();

    // ─── Initialize OpenAI ─────────────────────────────────────────
    const openai = new OpenAI({
      apiKey: openAiKey.value(),
    });

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",           // updated name (2025 reality)
        temperature: 0,
        messages: [
          {
            role: "system",
            content: 
              "You are a medical OCR assistant. " +
              "Extract medicine name and batch number from images. " +
              "If not visible or not detectable, return null."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: 
                  "Extract the medicine name and batch number " +
                  "from this medicine image and return **ONLY** valid JSON (no markdown, no explanation, no code fences)\n\n" +
                  "{\n" +
                  '  "medicine_name": string | null,\n' +
                  '  "batch_number": string | null\n' +
                  "}"
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ]
      });

      const rawContent = response.choices[0]?.message?.content?.trim();

      if (!rawContent) {
        throw new Error("No content returned from OpenAI");
      }

      let result;
      try {
        result = JSON.parse(rawContent);
      } catch (parseErr) {
        logger.error("OpenAI returned invalid JSON", { content: rawContent });
        throw new HttpsError("internal", "Failed to parse medicine data");
      }

      // Optional: basic shape validation
      if (
        !result ||
        !("medicine_name" in result) ||
        !("batch_number" in result)
      ) {
        throw new HttpsError("internal", "Invalid response format from AI");
      }

      return result;   // { medicine_name: "...", batch_number: "..." }

    } catch (err: any) {
      logger.error("Medicine extraction failed", err);

      if (err instanceof HttpsError) {
        throw err;
      }

      throw new HttpsError(
        "internal",
        "Failed to process image. Please try again."
      );
    }
  }
);
