import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Conversation, ConversationResponse, DeleteConversationResponse, MessageResponse } from '../models/conversation.model';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  constructor(private apiService: ApiService) { }

  // Get all conversations with pagination
  getConversations(limit: number = 20, offset: number = 0): Observable<ConversationResponse> {
    return this.apiService.get<ConversationResponse>(`/conversations?limit=${limit}&offset=${offset}`);
  }

  // Get a specific conversation by ID
  getConversation(id: string): Observable<Conversation> {
    return this.apiService.get<Conversation>(`/conversations/${id}`);
  }

  // Create a new conversation with an optional initial message
  createConversation(initialMessage?: string): Observable<MessageResponse> {
    const payload = initialMessage ? { message: initialMessage } : {};
    return this.apiService.post<MessageResponse>('/conversations', payload);
  }

  // Add a message to an existing conversation
  sendMessage(conversationId: string, message: string): Observable<MessageResponse> {
    return this.apiService.post<MessageResponse>(`/conversations/${conversationId}/messages`, { message });
  }

  // Delete a conversation
  deleteConversation(conversationId: string): Observable<DeleteConversationResponse> {
    return this.apiService.delete<DeleteConversationResponse>(`/conversations/${conversationId}`);
  }

  // Update conversation title
  updateConversationTitle(conversationId: string, title: string): Observable<Conversation> {
    return this.apiService.put<Conversation>(`/conversations/${conversationId}`, { title });
  }
}
