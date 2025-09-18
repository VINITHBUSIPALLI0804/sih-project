import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function getHeritageInfoFromImage(base64Image: string, mimeType: string): Promise<{info: string, videoUrl?: string}> {
  try {
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: `You are an expert historian specializing in architecture. Analyze this image. 
      1. Provide a concise, engaging description of its historical and cultural significance. Include architectural style, era, and purpose. Start with a compelling title on the first line.
      2. On a new line, after the description, if this is a famous landmark, write "VIDEO_SEARCH:" followed by a concise search query for YouTube to find a cinematic documentary video about this place (e.g., "VIDEO_SEARCH: Taj Mahal cinematic drone footage"). If not famous, omit this line.
      Format the main response in clear paragraphs.`,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ parts: [imagePart, textPart] }],
      config: { 
        thinkingConfig: { thinkingBudget: 0 } 
      },
    });
    
    let info = response.text;
    let videoUrl: string | undefined = undefined;

    if (info.includes("VIDEO_SEARCH:")) {
        const parts = info.split("VIDEO_SEARCH:");
        info = parts[0].trim();
        const query = encodeURIComponent(parts[1].trim());
        videoUrl = `https://www.youtube.com/results?search_query=${query}`;
    }

    return { info, videoUrl };
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Could not retrieve information from Gemini API.");
  }
}

export async function getHeritageInfoFromCoords(lat: number, lon: number, languageCode: string, languageName: string): Promise<string> {
  try {
    const textPart = {
      text: `Based on these coordinates (Lat: ${lat}, Lon: ${lon}), act as a local historian.
      - First, create a clear title for the location.
      - Then, provide an engaging description of the immediate area's history and cultural significance.
      - IMPORTANT: The entire response (title and description) must be written exclusively in the ${languageName} language. Do not include any English text in the main body.
      - Finally, on a new line at the very end, write "IMAGE_QUERY:" followed by a simple, beautiful Unsplash.com search query for this location in English (e.g., "IMAGE_QUERY: Old Delhi street").`,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ parts: [textPart] }],
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API call for coords failed:", error);
    throw new Error("Could not retrieve information for the location from Gemini API.");
  }
}

export async function getNearbyPlaces(lat: number, lon: number): Promise<any> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on these coordinates (Lat: ${lat}, Lon: ${lon}), list up to 5 nearby cultural or heritage points of interest. For each place, provide a name, a brief description, and a simple Unsplash.com search query for a beautiful image of the place.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        places: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING, description: "The name of the heritage site." },
                                    description: { type: Type.STRING, description: "A brief, one-sentence description." },
                                    imageUrl: { type: Type.STRING, description: "A simple search query for Unsplash.com (e.g., 'Jaipur Hawa Mahal')." }
                                },
                                required: ["name", "description", "imageUrl"],
                            },
                        },
                    },
                    required: ["places"],
                },
            },
        });

        const jsonStr = response.text.trim();
        const parsed = JSON.parse(jsonStr);
        if(parsed.places) {
            parsed.places.forEach((place: any) => {
                place.imageUrl = `https://source.unsplash.com/400x300/?${encodeURIComponent(place.imageUrl)}`;
            });
        }
        return parsed;

    } catch (error) {
        console.error("Gemini API call for nearby places failed:", error);
        throw new Error("Could not retrieve nearby places from Gemini API.");
    }
}