export interface ChatMessage {
  id: string;
  sessionId: string;
  senderType: 'user' | 'admin';
  content: string;
  attachment?: string | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  userId?: string | null;
  guestId: string;
  userName?: string | null;
  status: 'active' | 'closed';
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface QuickAnswer {
  question: string;
  answer: string;
}