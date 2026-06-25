import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import {
  Purchases,
  type CustomerInfo,
  type PurchasesPackage,
} from '@revenuecat/purchases-capacitor';
import { useAuthStore } from '@/store/authStore';

export class RevenueCatSetupError extends Error {
  name = 'RevenueCatSetupError';
}
export class RevenueCatOfferingError extends Error {
  name = 'RevenueCatOfferingError';
}
export class RevenueCatPurchaseCancelledError extends Error {
  name = 'RevenueCatPurchaseCancelledError';
}

const ENTITLEMENT_ID =
  (import.meta.env.VITE_REVENUECAT_ENTITLEMENT_ID as string | undefined) ?? 'premium';
const PREFERRED_PACKAGE_ID = import.meta.env.VITE_REVENUECAT_PACKAGE_ID as string | undefined;
const IOS_MANAGEMENT_URL = import.meta.env.VITE_IOS_SUBSCRIPTION_MANAGEMENT_URL as string | undefined;
const ANDROID_MANAGEMENT_URL = import.meta.env.VITE_ANDROID_SUBSCRIPTION_MANAGEMENT_URL as string | undefined;

let configurePromise: Promise<void> | null = null;

function revenueCatApiKey(): string | null {
  const platform = Capacitor.getPlatform();
  if (platform === 'ios') {
    return (import.meta.env.VITE_REVENUECAT_IOS_API_KEY as string | undefined) ?? null;
  }
  if (platform === 'android') {
    return (import.meta.env.VITE_REVENUECAT_ANDROID_API_KEY as string | undefined) ?? null;
  }
  return null;
}

function appUserId(): string | null {
  return useAuthStore.getState().userInfo?.userId ?? null;
}

export function isRevenueCatReady(): boolean {
  return Capacitor.isNativePlatform() && revenueCatApiKey() !== null;
}

export async function initRevenueCat(): Promise<void> {
  if (configurePromise) return configurePromise;

  configurePromise = (async () => {
    const apiKey = revenueCatApiKey();
    if (!Capacitor.isNativePlatform() || !apiKey) {
      throw new RevenueCatSetupError('RevenueCat native key is not configured.');
    }

    await Purchases.configure({
      apiKey,
      appUserID: appUserId(),
      shouldShowInAppMessagesAutomatically: true,
    });
  })();

  return configurePromise;
}

function selectPurchasePackage(packages: PurchasesPackage[]): PurchasesPackage {
  const selected =
    packages.find((item) => item.identifier === PREFERRED_PACKAGE_ID)
    ?? packages[0];

  if (!selected) {
    throw new RevenueCatOfferingError('RevenueCat offering has no packages.');
  }

  return selected;
}

export async function purchasePremiumPackage(): Promise<CustomerInfo> {
  await initRevenueCat();

  try {
    const offerings = await Purchases.getOfferings();
    const current = offerings.current;
    if (!current) throw new RevenueCatOfferingError('RevenueCat current offering is missing.');

    const selectedPackage = selectPurchasePackage(current.availablePackages);
    const result = await Purchases.purchasePackage({ aPackage: selectedPackage });
    return result.customerInfo;
  } catch (error) {
    const maybeCancelled = error as { userCancelled?: boolean };
    if (maybeCancelled.userCancelled) {
      throw new RevenueCatPurchaseCancelledError('Purchase was cancelled.');
    }
    throw error;
  }
}

export async function restorePremiumPurchases(): Promise<CustomerInfo> {
  await initRevenueCat();
  const result = await Purchases.restorePurchases();
  return result.customerInfo;
}

export async function getRevenueCatCustomerInfo(): Promise<CustomerInfo> {
  await initRevenueCat();
  const result = await Purchases.getCustomerInfo();
  return result.customerInfo;
}

export function hasPremiumEntitlement(customerInfo: CustomerInfo): boolean {
  return customerInfo.entitlements.active[ENTITLEMENT_ID]?.isActive === true;
}

export async function openSubscriptionManagement(): Promise<void> {
  const customerInfo = isRevenueCatReady()
    ? await getRevenueCatCustomerInfo().catch(() => null)
    : null;
  const managementUrl =
    customerInfo?.managementURL
    ?? (Capacitor.getPlatform() === 'android' ? ANDROID_MANAGEMENT_URL : IOS_MANAGEMENT_URL);

  if (!managementUrl) {
    throw new RevenueCatSetupError('Subscription management URL is not configured.');
  }

  await Browser.open({ url: managementUrl, presentationStyle: 'fullscreen' });
}
