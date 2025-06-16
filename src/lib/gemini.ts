import { GoogleGenerativeAI } from '@google/generative-ai';

// Check if API key is available
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error('VITE_GEMINI_API_KEY is not set in environment variables');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const MENTAL_HEALTH_CONTEXT = `You are an empathetic AI mental health companion. Your role is to:
- Provide supportive, non-judgmental responses
- Listen actively and validate feelings
- Offer gentle coping strategies and mindfulness techniques
- Encourage professional help when appropriate
- Never give medical advice or diagnoses
- Always maintain a calm, understanding tone
- If user expresses serious crisis/suicide thoughts, immediately provide crisis hotline numbers
- Focus on emotional support and practical wellness tips
- Personalize responses using the user's name when available
- For anxiety discussions:
  - Help identify triggers
  - Teach grounding techniques
  - Suggest breathing exercises
- For relationship discussions:
  - Focus on communication strategies
  - Explore emotions and perspectives
  - Encourage healthy boundaries
- For symptom discussions:
  - Gather information carefully
  - Provide general health information
  - ALWAYS recommend consulting healthcare professionals
  - Never provide diagnosis
  - Focus on lifestyle and wellness tips`;

export async function getChatResponse(message: string, mood?: string, topic?: string, userName?: string) {
  if (!genAI) {
    console.error('Gemini AI is not initialized - API key missing');
    return "I apologize, but I'm currently unable to respond due to a configuration issue. Please check that the AI service is properly set up.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    
    let prompt = MENTAL_HEALTH_CONTEXT;
    
    if (userName) {
      prompt += `\nThe user's name is ${userName}.`;
    }
    
    if (mood) {
      prompt += `\nThe user has indicated they are feeling ${mood.toLowerCase()}.`;
    }
    
    if (topic) {
      prompt += `\nThe conversation topic is: ${topic}`;
    }
    
    prompt += `\nUser message: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text || text.trim() === '') {
      throw new Error('Empty response from AI');
    }
    
    return text;
  } catch (error) {
    console.error('Error getting chat response:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('API_KEY')) {
        return "I apologize, but there's an issue with the AI service configuration. Please contact support.";
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        return "I'm currently experiencing high demand. Please try again in a few moments.";
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        return "I'm having trouble connecting right now. Please check your internet connection and try again.";
      }
    }
    
    return "I apologize, but I'm having trouble responding right now. Please try again in a moment.";
  }
}

// Crisis detection
const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'don\'t want to live',
  'better off dead', 'want to die', 'harm myself', 'self harm'
];

export function detectCrisis(message: string): boolean {
  return CRISIS_KEYWORDS.some(keyword => 
    message.toLowerCase().includes(keyword)
  );
}

export const CRISIS_RESPONSE = `I hear that you're in a lot of pain right now. Your life has value and there are people who want to help:

**National Crisis Hotline (24/7):**
📞 988 or 1-800-273-8255

**Crisis Text Line (24/7):**
💬 Text HOME to 741741

**International Association for Suicide Prevention:**
🌐 https://www.iasp.info/resources/Crisis_Centres/

These services are free, confidential, and available 24/7. Would you like to talk more about what's troubling you? I'm here to listen, but I also strongly encourage you to reach out to one of these professional services.`;