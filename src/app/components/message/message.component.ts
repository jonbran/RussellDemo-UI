import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownComponent, provideMarkdown } from 'ngx-markdown';
import { Message } from '../../models/conversation.model';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, MarkdownComponent],
  providers: [provideMarkdown()],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  @Input() message!: Message;
  
  get formattedTimestamp(): string {
    return new Date(this.message.timestamp).toLocaleString();
  }
  
  get isUser(): boolean {
    return this.message.role === 'user';
  }
}
