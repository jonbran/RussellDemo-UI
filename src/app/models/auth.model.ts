export interface AuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface User {
  username: string;
  isAuthenticated: boolean;
}
