import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const MENTAL_HEALTH_CONTEXT = `You are an empathetic AI mental health companion. Your role is to:
- Provide supportive, non-judgmental responses
- Listen actively and validate feelings
- Offer gentle coping strategies and mindfulness techniques
- Encourage professional help when appropriate
- Never give medical advice or diagnoses
- Always maintain a calm, understanding tone
- If user expresses serious crisis/suicide thoughts, immediately provide crisis hotline numbers
- Focus on emotional support and practical wellness tips`;

export async function getChatResponse(message: string, mood?: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    let prompt = MENTAL_HEALTH_CONTEXT;
    if (mood) {
      prompt += `\nThe user has indicated they are feeling ${mood.toLowerCase()}.`;
    }
    prompt += `\nUser message: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error getting chat response:', error);
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

National Crisis Hotline (24/7):
📞 988 or 1-800-273-8255

Crisis Text Line (24/7):
💬 Text HOME to 741741

These services are free, confidential, and available 24/7. Would you like to talk more about what's troubling you? I'm here to listen, but I also strongly encourage you to reach out to one of these professional services.`;