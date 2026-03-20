export interface Stock {
  id: string;
  symbol: string;
  company: string;
  minLimit: number;
  maxLimit: number;
  notificationsEnabled: boolean;
  currentPrice: number;
  basePrice: number;
}

export interface Notification {
  id: string;
  message: string;
  type: 'min' | 'max';
}
