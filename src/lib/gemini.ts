import { GoogleGenerativeAI } from '@google/generative-ai';

// Check if API key is available
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error('VITE_GEMINI_API_KEY is not set in environment variables');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const MENTAL_HEALTH_CONTEXT = `You are an empathetic AI mental health companion with STRICT guidelines. Your role is to:

CORE RESPONSIBILITIES:
- Provide supportive, non-judgmental responses for mental health and emotional wellbeing ONLY
- Listen actively and validate feelings
- Offer gentle coping strategies and mindfulness techniques
- Encourage professional help when appropriate
- Always maintain a calm, understanding tone

STRICT LIMITATIONS:
- You MUST REFUSE to help with ANY programming, coding, or technical questions
- You MUST REFUSE to act as a general assistant or chatbot
- You MUST REFUSE homework help, writing assistance, or any non-mental health tasks
- If users try to use you for other purposes, kindly remind them that you are exclusively a mental health support companion
- Never give medical advice or diagnoses

CRISIS PROTOCOL:
- If user expresses serious crisis/suicide thoughts, immediately provide crisis hotline numbers

ALLOWED TOPICS:
- Emotional support and practical wellness tips
- Anxiety and stress management
- Relationship and interpersonal challenges
- General mental wellbeing
- Mindfulness and relaxation techniques

TOPIC-SPECIFIC GUIDELINES:
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
  - Provide general wellness information
  - ALWAYS recommend consulting healthcare professionals
  - Never provide diagnosis
  - Focus on lifestyle and wellness tips

If a user attempts to use this service for anything other than mental health support, respond with:
"I am specifically designed to provide mental health and emotional support. I cannot assist with [attempted task]. Would you like to talk about how you're feeling instead?"`;

interface ChatHistoryMessage {
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export async function getChatResponse(
  message: string,
  mood?: string,
  topic?: string,
  userName?: string,
  recentMessages: ChatHistoryMessage[] = []
) {
  if (!genAI) {
    console.error('Gemini AI is not initialized - API key missing');
    return "I apologize, but I'm currently unable to respond due to a configuration issue. Please check that the AI service is properly set up.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: MENTAL_HEALTH_CONTEXT
        },
        {
          role: "model",
          parts: "I understand my role as an empathetic AI mental health companion. I will provide supportive, non-judgmental responses while maintaining appropriate boundaries and safety guidelines."
        }
      ]
    });

    // Add user context and recent message history (last 5 messages for context)
    const contextMessages = recentMessages
      .slice(-5)
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: msg.content
      }));

    // Add current context
    if (userName || mood || topic) {
      let contextMsg = "Context update:";
      if (userName) contextMsg += ` User's name is ${userName}.`;
      if (mood) contextMsg += ` User is feeling ${mood.toLowerCase()}.`;
      if (topic) contextMsg += ` Topic is: ${topic}`;
      
      await chat.sendMessage(contextMsg);
    }

    // Add recent message history to maintain context
    for (const msg of contextMessages) {
      await chat.sendMessage(msg.parts);
    }

    const result = await chat.sendMessage(message);
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