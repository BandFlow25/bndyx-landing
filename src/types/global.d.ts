// Global type definitions for the application

// Auth code store for secure token exchange
declare global {
  var authCodeStore: Map<string, { token: string; expires: number }>;
}

export {};
