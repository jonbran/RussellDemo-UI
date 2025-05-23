import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SettingsService } from '../../services/settings.service';
import { Settings, Provider } from '../../models/settings.model';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  settingsForm!: FormGroup;
  currentSettings!: Settings;
  saving = false;
  checkingHealth = false;
  healthStatus: string | null = null;
  providers: Provider[] = [];
  defaultProvider: string = '';
  
  constructor(
    private formBuilder: FormBuilder,
    private settingsService: SettingsService,
    private apiService: ApiService
  ) {}
  
  ngOnInit() {
    this.currentSettings = this.settingsService.loadSettings();
    this.providers = this.settingsService.getProviders();
    this.defaultProvider = this.settingsService.getDefaultProvider();
    
    // Subscribe to provider changes
    this.settingsService.providers$.subscribe(providers => {
      this.providers = providers;
    });
    
    this.settingsService.defaultProvider$.subscribe(defaultProvider => {
      this.defaultProvider = defaultProvider;
    });
    
    this.settingsForm = this.formBuilder.group({
      apiUrl: [this.currentSettings.apiUrl, [Validators.required, Validators.pattern('https?://.*')]],
      theme: [this.currentSettings.theme, Validators.required],
      selectedProvider: [this.currentSettings.selectedProvider]
    });
  }
  
  saveSettings() {
    if (this.settingsForm.invalid) {
      return;
    }
    
    this.saving = true;
    
    setTimeout(() => {
      this.settingsService.updateSettings(this.settingsForm.value);
      this.saving = false;
    }, 500);
  }
  
  checkHealth() {
    this.checkingHealth = true;
    this.healthStatus = null;
    
    this.apiService.checkHealth().subscribe({
      next: (response) => {
        this.healthStatus = response.status;
        this.checkingHealth = false;
      },
      error: () => {
        this.healthStatus = 'error';
        this.checkingHealth = false;
      }
    });
  }
  
  resetToDefaults() {
    if (confirm('Are you sure you want to reset all settings to their default values?')) {
      this.settingsService.resetSettings();
      this.currentSettings = this.settingsService.loadSettings();
      this.settingsForm.patchValue({
        apiUrl: this.currentSettings.apiUrl,
        theme: this.currentSettings.theme,
        selectedProvider: this.currentSettings.selectedProvider
      });
    }
  }
  
  toggleTheme() {
    const newTheme = this.currentSettings.theme === 'light' ? 'dark' : 'light';
    this.settingsService.updateSettings({ theme: newTheme });
    this.currentSettings = this.settingsService.loadSettings();
    this.settingsForm.patchValue({ theme: this.currentSettings.theme });
  }
}
