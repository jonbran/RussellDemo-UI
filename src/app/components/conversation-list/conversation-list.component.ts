import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ConversationService } from '../../services/conversation.service';
import { Conversation } from '../../models/conversation.model';

@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './conversation-list.component.html',
  styleUrl: './conversation-list.component.scss'
})
export class ConversationListComponent implements OnInit {
  conversations: Conversation[] = [];
  loading = false;
  error = '';
  newConversationMessage = '';
  creatingConversation = false;
  
  // Pagination
  limit = 10;
  offset = 0;
  hasMore = false;
  
  constructor(
    private router: Router,
    private conversationService: ConversationService
  ) {}
  
  ngOnInit() {
    this.loadConversations();
  }
  
  loadConversations() {
    this.loading = true;
    this.error = '';
    
    this.conversationService.getConversations(this.limit, this.offset)
      .subscribe({
        next: (data) => {
          this.conversations = data.conversations;
          // If we got a full page of results, there might be more
          this.hasMore = data.conversations.length >= this.limit;
          this.loading = false;
        },
        error: (error) => {
          this.error = error?.error?.detail || 'Failed to load conversations';
          this.loading = false;
        }
      });
  }
  
  loadMore() {
    if (this.loading) return;
    
    this.offset += this.limit;
    this.loading = true;
    
    this.conversationService.getConversations(this.limit, this.offset)
      .subscribe({
        next: (data) => {
          this.conversations = [...this.conversations, ...data.conversations];
          this.hasMore = data.conversations.length >= this.limit;
          this.loading = false;
        },
        error: (error) => {
          this.error = error?.error?.detail || 'Failed to load more conversations';
          this.loading = false;
          // Revert the offset change on error
          this.offset -= this.limit;
        }
      });
  }
  
  createNewConversation() {
    if (!this.newConversationMessage.trim() && !confirm('Start a new conversation without an initial message?')) {
      return;
    }
    
    this.creatingConversation = true;
    const initialMessage = this.newConversationMessage.trim();
    
    this.conversationService.createConversation(initialMessage || undefined)
      .subscribe({
        next: (response) => {
          this.creatingConversation = false;
          this.newConversationMessage = '';
          // Navigate to the new conversation
          this.router.navigate(['/conversations', response.conversation_id]);
        },
        error: (error) => {
          this.error = error?.error?.detail || 'Failed to create conversation';
          this.creatingConversation = false;
        }
      });
  }
  
  deleteConversation(event: Event, conversationId: string) {
    // Prevent navigation to conversation detail
    event.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this conversation?')) {
      return;
    }
    
    this.conversationService.deleteConversation(conversationId)
      .subscribe({
        next: () => {
          this.conversations = this.conversations.filter(c => c.id !== conversationId);
        },
        error: (error) => {
          this.error = error?.error?.detail || 'Failed to delete conversation';
        }
      });
  }
  
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}
