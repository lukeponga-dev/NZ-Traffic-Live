import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function searchLocation(query: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Find the latitude and longitude for the following New Zealand location or road: "${query}". Return the result as a JSON object with "lat", "lng", and "displayName" properties. If it's a road, return a central point on that road.`,
      config: {
        tools: [{ googleSearch: {} }, { googleMaps: {} }],
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || "{}");
    return result as { lat: number; lng: number; displayName: string };
  } catch (error) {
    console.error("AI Search failed:", error);
    return null;
  }
}
