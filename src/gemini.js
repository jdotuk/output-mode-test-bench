import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const MODEL_NAME = "gemini-3.1-flash-lite-preview";

export async function scoreDescription(imageBase64, mimeType, promptTemplate, userSentence) {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  const filledPrompt = promptTemplate.replace("{user_sentence}", userSentence);
  const result = await model.generateContent([
    { inlineData: { data: imageBase64, mimeType } },
    filledPrompt,
  ]);
  const text = result.response.text().trim();
  // Strip markdown code fences if Gemini wraps the JSON
  const json = text.replace(/^```json?\n?/m, "").replace(/\n?```$/m, "").trim();
  return JSON.parse(json); // { score, corrected_version }
}

export async function fetchImageAsBase64(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1];
      resolve({ base64, mimeType: blob.type || "image/png" });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
