import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { SettingsService } from './services/settings.service';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'MCP Host UI';
  isHealthy = false;
  checking = true;

  constructor(
    private settingsService: SettingsService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    // Apply theme based on settings
    this.settingsService.settings$.subscribe(settings => {
      document.body.classList.remove('light-theme', 'dark-theme');
      document.body.classList.add(`${settings.theme}-theme`);
    });

    // Check API health on startup
    this.checkApiHealth();
  }

  checkApiHealth() {
    this.checking = true;
    this.apiService.checkHealth().subscribe({
      next: () => {
        this.isHealthy = true;
        this.checking = false;
      },
      error: () => {
        this.isHealthy = false;
        this.checking = false;
      }
    });
  }
}
