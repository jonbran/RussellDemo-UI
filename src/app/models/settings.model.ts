export interface Provider {
  name: string;
  provider_type: string;
  model_id: string;
}

export interface ProviderResponse {
  default_provider: string;
  providers: Provider[];
}

export interface Settings {
  apiUrl: string;
  theme: 'light' | 'dark';
  selectedProvider?: string;
}
