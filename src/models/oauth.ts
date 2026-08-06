export interface JiraTokenResponse {
  access_token: string;

  refresh_token?: string;

  expires_in: number;

  token_type: string;

  scope: string;
}

export interface JiraSession {
  accessToken: string;
  refreshToken?: string;
  cloudId: string;
  expiresAt: number;
  user?: any;
  siteUrl?: string;
}
