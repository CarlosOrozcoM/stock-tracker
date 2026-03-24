export interface Stock {
  id: string;
  symbol: string;
  company: string;
  myStocks: number;
  minLimit: number;
  maxLimit: number;
  notificationsEnabled: boolean;
  currentPrice: number;
  basePrice: number;
  hasMaxNotificationShown?: boolean;
}

export interface Notification {
  id: string;
  message: string;
  type: 'min' | 'max';
}
