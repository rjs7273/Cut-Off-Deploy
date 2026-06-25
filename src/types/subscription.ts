export interface SubscriptionDetail {
  id: number;
  store: string;
  productId: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  willAutoRenew: boolean;
}

export interface SubscriptionResponse {
  subscription: SubscriptionDetail | null;
}
