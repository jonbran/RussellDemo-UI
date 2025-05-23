import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ConversationService } from '../../services/conversation.service';
import { Conversation, Message } from '../../models/conversation.model';
import { MessageComponent } from '../message/message.component';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MessageComponent],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.scss'
})
export class ConversationComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('titleInput') titleInput!: ElementRef;
  
  conversationId!: string;
  conversation: Conversation | null = null;
  messageForm!: FormGroup;
  titleForm!: FormGroup;
  loading = false;
  sending = false;
  error = '';
  shouldScroll = true;
  isTyping = false;
  isEditingTitle = false;
  savingTitle = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private conversationService: ConversationService
  ) {}
  
  ngOnInit() {
    this.messageForm = this.formBuilder.group({
      message: ['', Validators.required]
    });
    
    this.titleForm = this.formBuilder.group({
      title: ['', Validators.required]
    });
    
    this.route.params.subscribe(params => {
      this.conversationId = params['id'];
      this.loadConversation();
    });
  }
  
  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }
  
  loadConversation() {
    this.loading = true;
    this.error = '';
    
    this.conversationService.getConversation(this.conversationId)
      .subscribe({
        next: (data) => {
          this.conversation = data;
          this.loading = false;
          this.shouldScroll = true;
        },
        error: (error) => {
          this.error = error?.error?.detail || 'Failed to load conversation';
          this.loading = false;
          
          // If 404, conversation may have been deleted
          if (error.status === 404) {
            setTimeout(() => {
              this.router.navigate(['/conversations']);
            }, 3000);
          }
        }
      });
  }
  
  handleEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter' && !keyboardEvent.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
  
  sendMessage() {
    if (this.messageForm.invalid || this.sending) {
      return;
    }
    
    const messageContent = this.messageForm.value.message;
    this.sending = true;
    this.isTyping = true;
    this.error = '';
    
    // Add the user message to the UI immediately for better UX
    const userMessage: Message = {
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString()
    };
    
    if (this.conversation?.messages) {
      this.conversation.messages.push(userMessage);
      this.shouldScroll = true;
    }
    
    this.messageForm.reset();
    
    // Send the message to the server
    this.conversationService.sendMessage(this.conversationId, messageContent)
      .subscribe({
        next: (response) => {
          // Add the assistant's response to the UI
          const assistantMessage: Message = {
            role: 'assistant',
            content: response.message,
            timestamp: new Date().toISOString()
          };
          
          if (this.conversation?.messages) {
            // Simulate a typing delay for better UX
            setTimeout(() => {
              if (this.conversation?.messages) {
                this.conversation.messages.push(assistantMessage);
                if (this.conversation.message_count) {
                  this.conversation.message_count += 2; // +2 for both user and assistant messages
                }
              }
              
              this.sending = false;
              this.isTyping = false;
              this.shouldScroll = true;
            }, 500); // 500ms delay to simulate typing completion
          }
        },
        error: (error) => {
          this.error = error?.error?.detail || 'Failed to send message';
          this.sending = false;
          
          // If the request failed, remove the user message from the UI
          if (this.conversation?.messages && this.conversation.messages.length > 0) {
            this.conversation.messages.pop();
          }
        }
      });
  }
  
  scrollToBottom() {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  // Title editing methods
  startEditingTitle() {
    this.isEditingTitle = true;
    // Set the current value in the form
    this.titleForm.patchValue({
      title: this.conversation?.title || ''
    });
    
    // Focus on the input after Angular rendering cycle completes
    setTimeout(() => {
      if (this.titleInput) {
        this.titleInput.nativeElement.focus();
        this.titleInput.nativeElement.select();
      }
    });
  }

  cancelEditingTitle() {
    this.isEditingTitle = false;
    this.titleForm.reset();
  }

  saveTitle() {
    if (this.titleForm.invalid || this.savingTitle || !this.conversation) {
      return;
    }

    const newTitle = this.titleForm.value.title?.trim();
    
    if (newTitle === this.conversation?.title) {
      this.isEditingTitle = false;
      return;
    }

    this.savingTitle = true;
    this.error = '';

    this.conversationService.updateConversationTitle(this.conversationId, newTitle)
      .subscribe({
        next: (updatedConversation) => {
          this.conversation = updatedConversation;
          this.isEditingTitle = false;
          this.savingTitle = false;
        },
        error: (error) => {
          this.error = error?.error?.detail || 'Failed to update conversation title';
          this.savingTitle = false;
        }
      });
  }
}
