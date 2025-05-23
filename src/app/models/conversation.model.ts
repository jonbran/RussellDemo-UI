export interface Conversation {
  id: string;
  title?: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  messages?: Message[];
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ConversationResponse {
  conversations: Conversation[];
}

export interface MessageResponse {
  conversation_id: string;
  message: string;
}

export interface DeleteConversationResponse {
  success: boolean;
  message: string;
}
