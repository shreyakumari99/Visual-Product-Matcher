import { GoogleGenAI, Type } from "@google/genai";
import { BrandInfo, NamedProductLink } from "../types";

const ai = new GoogleGenAI({apiKey: process.env.API_KEY!});

// Schema for the initial analysis
const initialAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    identifiedProduct: {
      type: Type.STRING,
      description: "A short, descriptive name for the main product identified in the image (e.g., 'brown leather handbag', 'men's white running shoe')."
    },
    directLinks: {
      type: Type.ARRAY,
      description: "A list of direct links to product pages for items that are a high-confidence visual match to the item in the image.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "The name of the product." },
          productUrl: { type: Type.STRING, description: "The direct URL to the product page." },
          imageUrl: { type: Type.STRING, description: "A direct URL to an image of the product." },
        },
        required: ["name", "productUrl", "imageUrl"]
      }
    },
    brands: {
      type: Type.ARRAY,
      description: "A list of popular, well-regarded brands known for making the type of product identified in the image.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "The name of the brand." },
          description: { type: Type.STRING, description: "A brief, one-sentence description of the brand or why it's a good recommendation." },
        },
        required: ["name", "description"]
      }
    }
  },
  required: ["identifiedProduct", "directLinks", "brands"]
};

export const initialImageAnalysis = async (image: { mimeType: string, data: string }): Promise<{ identifiedProduct: string; directLinks: NamedProductLink[]; brands: BrandInfo[] }> => {
  const prompt = `Analyze the provided image to identify the primary commercial product shown.
  
  1. First, provide a short, descriptive name for the product itself.
  2. Second, provide a list of direct URLs to purchase the exact item or very close visual matches, including a product image URL for each.
  3. Third, provide a list of popular and well-regarded brands that are known for making this type of product.
  
  Return an empty array if no items are found for a specific category. Ensure the response adheres strictly to the provided JSON schema.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { inlineData: { mimeType: image.mimeType, data: image.data } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: initialAnalysisSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result;

  } catch (error) {
    console.error("Error calling Gemini API for initial analysis:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to analyze image: ${error.message}`);
    }
    throw new Error("An unknown error occurred during initial analysis.");
  }
};

export const findProductsForBrand = async (image: { mimeType: string, data: string }, identifiedProduct: string, brandName: string): Promise<NamedProductLink[]> => {
  const prompt = `The user has uploaded an image of a "${identifiedProduct}". They are interested in the brand "${brandName}". 
  
  Search the web for products from "${brandName}" that are visually similar to the item in the image. 
  
  Return your response as a valid JSON array of objects. Each object must have three keys: "name" (a string for the product name), "productUrl" (a string for the direct URL to the product page), and "imageUrl" (a string for a direct public URL to an image of the product).
  
  Do not include any other text, markdown formatting, or explanations outside of the JSON array.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { inlineData: { mimeType: image.mimeType, data: image.data } },
          { text: prompt }
        ]
      },
      config: {
        temperature: 0.5,
        tools: [{googleSearch: {}}],
      },
    });

    const jsonText = response.text.trim();
    // The response might be wrapped in markdown backticks, so we need to remove them.
    const cleanedJsonText = jsonText.replace(/^```json\n?/, '').replace(/```$/, '');
    const result = JSON.parse(cleanedJsonText);
    return result;

  } catch (error) {
    console.error(`Error calling Gemini API for brand "${brandName}":`, error);
    if (error instanceof Error) {
        throw new Error(`Failed to find products for ${brandName}: ${error.message}`);
    }
    throw new Error(`An unknown error occurred while searching for products from ${brandName}.`);
  }
};
