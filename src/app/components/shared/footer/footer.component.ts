import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  lastUpdated = 'May 21, 2025';
  
  constructor(private settingsService: SettingsService) {}
  
  get currentYear(): number {
    return new Date().getFullYear();
  }
  
  toggleTheme(): void {
    const currentSettings = this.settingsService.loadSettings();
    const newTheme = currentSettings.theme === 'light' ? 'dark' : 'light';
    this.settingsService.updateSettings({ theme: newTheme });
  }
}
