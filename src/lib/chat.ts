import { collection, addDoc, query, where, orderBy, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Message, ChatSession } from '../types';

export const createNewSession = async (userId: string): Promise<string> => {
  if (!userId) throw new Error('User ID is required');

  try {
    const sessionsRef = collection(db, 'chatSessions');
    const newSession = await addDoc(sessionsRef, {
      userId,
      title: 'New Chat',
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: []
    });
    return newSession.id;
  } catch (error) {
    console.error('Error creating new session:', error);
    throw error;
  }
};

export const saveChatMessage = async (sessionId: string, message: Message) => {
  if (!sessionId) throw new Error('Session ID is required');

  try {
    const sessionRef = doc(db, 'chatSessions', sessionId);
    const sessionDoc = await getDoc(sessionRef);
    
    if (!sessionDoc.exists()) {
      throw new Error('Session not found');
    }

    const sessionData = sessionDoc.data();
    const updatedMessages = [...(sessionData.messages || []), {
      id: message.id,
      content: message.content,
      sender: message.sender,
      timestamp: message.timestamp,
      isCrisis: message.isCrisis || false,
      isError: message.isError || false
    }];

    let title = sessionData.title;
    if (title === 'New Chat' && message.sender === 'user') {
      title = message.content.slice(0, 40) + (message.content.length > 40 ? '...' : '');
    }

    await updateDoc(sessionRef, {
      messages: updatedMessages,
      title,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error saving chat message:', error);
    throw error;
  }
};

export const getChatSessions = async (userId: string): Promise<ChatSession[]> => {
  if (!userId) return [];
  
  try {
    const sessionsRef = collection(db, 'chatSessions');
    const q = query(
      sessionsRef,
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
      messages: doc.data().messages.map((msg: any) => ({
        ...msg,
        timestamp: msg.timestamp.toDate()
      }))
    })) as ChatSession[];
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    return [];
  }
};

export const getChatSession = async (sessionId: string): Promise<ChatSession | null> => {
  if (!sessionId) return null;

  try {
    const sessionRef = doc(db, 'chatSessions', sessionId);
    const sessionDoc = await getDoc(sessionRef);
    
    if (!sessionDoc.exists()) {
      return null;
    }

    const data = sessionDoc.data();
    return {
      id: sessionDoc.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
      messages: data.messages.map((msg: any) => ({
        ...msg,
        timestamp: msg.timestamp.toDate()
      }))
    } as ChatSession;
  } catch (error) {
    console.error('Error fetching chat session:', error);
    return null;
  }
};