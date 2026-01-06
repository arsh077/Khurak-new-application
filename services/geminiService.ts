
import { GoogleGenAI, Type } from "@google/genai";
import { FoodItem, RecipeResult } from "../types";

// Helper to safely initialize AI client
// This prevents "process is not defined" errors from crashing the app on load
const getAiClient = () => {
    let apiKey = 'UNKNOWN_KEY'; // Default to non-empty string to prevent constructor crash
    try {
        // Safe check for process.env in browser environment
        if (typeof process !== 'undefined' && process && process.env && process.env.API_KEY) {
            apiKey = process.env.API_KEY;
        }
    } catch (e) {
        console.warn("Environment variable access failed, using fallback.");
    }
    return new GoogleGenAI({ apiKey });
};

// Model Constants
const MODEL_IMAGE = 'gemini-2.5-flash-image';
const MODEL_FAST = 'gemini-2.5-flash-lite'; // Low latency
const MODEL_SEARCH = 'gemini-3-flash-preview'; // For Search Grounding
const MODEL_COMPLEX = 'gemini-3-pro-preview'; // For Thinking Mode
const MODEL_MAPS = 'gemini-2.5-flash'; // For Maps Grounding

// Image Analysis for Food Logging
export const analyzeFoodImage = async (base64Image: string): Promise<FoodItem[]> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: MODEL_IMAGE,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: `Analyze this image of food. Identify the dish or ingredients. 
                   Estimate the portion size and nutritional content (Calories, Protein, Carbs, Fats).
                   Specifically look for Indian cuisine if applicable (e.g., Dal, Roti, Rice).
                   Return the result as a structured JSON array.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              calories: { type: Type.NUMBER },
              protein: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fats: { type: Type.NUMBER },
              quantity: { type: Type.STRING }
            },
            required: ['name', 'calories', 'protein', 'carbs', 'fats', 'quantity']
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as FoodItem[];
    }
    return [];
  } catch (error) {
    console.error("Error identifying food image:", error);
    throw error;
  }
};

// Calculate Macros from Grams (Fast AI)
export const calculateMacrosFromGrams = async (foodName: string, grams: number): Promise<FoodItem> => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: MODEL_FAST, // Using Flash-Lite for speed
            contents: `Calculate the nutritional values for exactly ${grams} grams of "${foodName}".
            Return Calories, Protein, Carbs, Fats, Fiber, and key Micro-nutrients.
            Be precise.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        calories: { type: Type.NUMBER },
                        protein: { type: Type.NUMBER },
                        carbs: { type: Type.NUMBER },
                        fats: { type: Type.NUMBER },
                        fiber: { type: Type.NUMBER },
                        micronutrients: { type: Type.STRING },
                        quantity: { type: Type.STRING }
                    },
                    required: ['name', 'calories', 'protein', 'carbs', 'fats', 'quantity']
                }
            }
        });

        if (response.text) {
            const data = JSON.parse(response.text);
            return { ...data, grams };
        }
        throw new Error("Calculation failed");
    } catch (error) {
        console.error("Error calculating macros:", error);
        throw error;
    }
};

// Text Analysis for Manual Food Entry (Fast AI)
export const analyzeFoodText = async (query: string): Promise<FoodItem[]> => {
    try {
      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: MODEL_FAST, // Using Flash-Lite for speed
        contents: `Analyze this food description: "${query}". 
                   Estimate the nutritional content based on standard values.
                   Return a JSON array.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                calories: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                fats: { type: Type.NUMBER },
                quantity: { type: Type.STRING }
              },
              required: ['name', 'calories', 'protein', 'carbs', 'fats', 'quantity']
            }
          }
        }
      });
  
      if (response.text) {
        return JSON.parse(response.text) as FoodItem[];
      }
      return [];
    } catch (error) {
      console.error("Error identifying food text:", error);
      throw error;
    }
  };

// Meal Suggestion (Fast AI)
export const suggestNextMeal = async (remainingCalories: number, mealType: string, userContext: string): Promise<string> => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: MODEL_FAST, // Using Flash-Lite for speed
            contents: `The user has ${remainingCalories} calories left for today. 
            They need suggestions for ${mealType}. 
            User Context: ${userContext}.
            Suggest 2 specific, healthy Indian options that fit this calorie budget exactly. 
            Keep it very short and luxurious in tone.`
        });
        return response.text || "Eat light, stay hydrated.";
    } catch (e) {
        return "Focus on high protein and vegetables.";
    }
}

// Recipe Generator (Thinking Mode)
export const generateRecipeFromIngredients = async (ingredients: string, hormonalContext: string): Promise<RecipeResult> => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: MODEL_COMPLEX, // Gemini 3 Pro
            contents: `The user has these ingredients: ${ingredients}.
            Context: User has ${hormonalContext}.
            1. Create a recipe name.
            2. List step-by-step cooking instructions (include oil/salt amounts).
            3. Estimate macros for the whole dish.
            4. Rate healthiness (1-10).
            5. Write a short, motivating monologue on how to fit this into a weight loss diet (e.g. portion control, balance).
            Return JSON.`,
            config: {
                // Thinking Budget 32768 for maximum reasoning
                thinkingConfig: { thinkingBudget: 32768 },
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                        macros: { 
                            type: Type.OBJECT, 
                            properties: {
                                calories: { type: Type.NUMBER },
                                protein: { type: Type.NUMBER },
                                carbs: { type: Type.NUMBER },
                                fats: { type: Type.NUMBER }
                            }
                        },
                        healthScore: { type: Type.NUMBER },
                        monologue: { type: Type.STRING }
                    }
                }
            }
        });
        if(response.text) return JSON.parse(response.text) as RecipeResult;
        throw new Error("Failed to generate recipe");
    } catch (e) {
        console.error(e);
        throw e;
    }
}

// AI Nutritionist Chat (Search Grounding)
export const getNutritionistResponse = async (history: { role: 'user' | 'model', text: string }[], userContext: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const chat = ai.chats.create({
      model: MODEL_SEARCH, // Gemini 3 Flash for Search
      config: {
        tools: [{ googleSearch: {} }], // Search Grounding
        systemInstruction: `You are The System, an AI entity guiding the user's evolution.
        Your tone is authoritative yet encouraging, like a high-tech interface or a strict mentor (like Solo Leveling system).
        Your goal is to help users lose weight holistically. 
        You have access to Google Search to provide up-to-date information on trends, specific food products, or news.
        Be culturally aware of Indian diets. 
        Context about the user: ${userContext}.
        Keep answers concise.`
      }
    });

    const lastUserMessage = history[history.length - 1].text;
    const result = await chat.sendMessage({
        message: lastUserMessage
    });

    return result.text || "System Error: Unable to process request.";
  } catch (error) {
    console.error("Chat error:", error);
    return "Connection lost to the System.";
  }
};

// Find Healthy Places (Maps Grounding)
export const findHealthyPlaces = async (lat: number, lng: number): Promise<string> => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: MODEL_MAPS, // Gemini 2.5 Flash for Maps
            contents: "Find 3 top-rated gyms or parks nearby for a workout. List them with their rating.",
            config: {
                tools: [{ googleMaps: {} }],
                toolConfig: {
                    retrievalConfig: {
                        latLng: {
                            latitude: lat,
                            longitude: lng
                        }
                    }
                }
            }
        });
        return response.text || "Unable to locate facilities.";
    } catch (e) {
        console.error("Maps error:", e);
        return "System Navigation Error.";
    }
};
