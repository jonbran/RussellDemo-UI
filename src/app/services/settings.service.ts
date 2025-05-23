import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Settings, Provider, ProviderResponse } from '../models/settings.model';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settingsKey = 'app_settings';
  private defaultSettings: Settings = {
    apiUrl: environment.apiUrl,
    theme: 'light',
    selectedProvider: undefined
  };

  private settingsSubject = new BehaviorSubject<Settings>(this.loadSettings());
  public settings$ = this.settingsSubject.asObservable();
  
  private providersSubject = new BehaviorSubject<Provider[]>([]);
  public providers$ = this.providersSubject.asObservable();
  
  private defaultProviderSubject = new BehaviorSubject<string>('');
  public defaultProvider$ = this.defaultProviderSubject.asObservable();

  constructor(private apiService: ApiService) { 
    this.loadProviderInfo();
  }

  loadSettings(): Settings {
    const storedSettings = localStorage.getItem(this.settingsKey);
    if (storedSettings) {
      try {
        return JSON.parse(storedSettings);
      } catch (e) {
        console.error('Error parsing settings from localStorage', e);
        return this.defaultSettings;
      }
    }
    return this.defaultSettings;
  }

  private saveSettings(settings: Settings): void {
    localStorage.setItem(this.settingsKey, JSON.stringify(settings));
    this.settingsSubject.next(settings);
  }

  updateSettings(newSettings: Partial<Settings>): void {
    const currentSettings = this.settingsSubject.value;
    const updatedSettings = {
      ...currentSettings,
      ...newSettings
    };
    this.saveSettings(updatedSettings);
  }

  resetSettings(): void {
    this.saveSettings(this.defaultSettings);
  }

  getTheme(): string {
    return this.settingsSubject.value.theme;
  }

  toggleTheme(): void {
    const currentSettings = this.settingsSubject.value;
    const newTheme = currentSettings.theme === 'light' ? 'dark' : 'light';
    this.updateSettings({ theme: newTheme });
  }

  getApiUrl(): string {
    return this.settingsSubject.value.apiUrl;
  }

  setApiUrl(url: string): void {
    this.updateSettings({ apiUrl: url });
  }

  getSelectedProvider(): string | undefined {
    return this.settingsSubject.value.selectedProvider;
  }

  setSelectedProvider(provider: string): void {
    this.updateSettings({ selectedProvider: provider });
  }
  
  getProviders(): Provider[] {
    return this.providersSubject.value;
  }
  
  getDefaultProvider(): string {
    return this.defaultProviderSubject.value;
  }

  loadProviderInfo(): void {
    console.log('Attempting to load provider info from:', `${this.apiService['baseUrl']}/api/providers`);
    this.apiService.getProviders().subscribe({
      next: (response: ProviderResponse) => {
        console.log('Provider info loaded successfully:', response);
        this.providersSubject.next(response.providers);
        this.defaultProviderSubject.next(response.default_provider);
        
        // Set the default provider as the selected provider if none is selected
        const currentSettings = this.settingsSubject.value;
        if (!currentSettings.selectedProvider) {
          this.updateSettings({ selectedProvider: response.default_provider });
        }
      },
      error: (error) => {
        console.error('Failed to load provider information', error);
      }
    });
  }
}
