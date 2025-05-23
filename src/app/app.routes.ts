import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { ConversationListComponent } from './components/conversation-list/conversation-list.component';
import { ConversationComponent } from './components/conversation/conversation.component';
import { SettingsComponent } from './components/settings/settings.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'conversations', 
    component: ConversationListComponent, 
    canActivate: [authGuard]
  },
  { 
    path: 'conversations/:id', 
    component: ConversationComponent, 
    canActivate: [authGuard]
  },
  { 
    path: 'settings', 
    component: SettingsComponent, 
    canActivate: [authGuard]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
