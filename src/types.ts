export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    isError?: boolean;
    isCrisis?: boolean;
  }
  
  export interface ChatSession {
    id: string;
    title: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    messages: Message[];
  }