import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

export type PushDeviceType = 'IOS' | 'ANDROID' | 'WEB';

export interface PushRegistrationResult {
  permission: 'granted' | 'denied';
  fcmToken: string | null;
  deviceType: PushDeviceType;
}

function deviceType(): PushDeviceType {
  const platform = Capacitor.getPlatform();
  if (platform === 'ios') return 'IOS';
  if (platform === 'android') return 'ANDROID';
  return 'WEB';
}

export async function requestPushRegistration(): Promise<PushRegistrationResult> {
  if (!Capacitor.isNativePlatform()) {
    return { permission: 'granted', fcmToken: null, deviceType: 'WEB' };
  }

  const permission = await PushNotifications.requestPermissions();
  if (permission.receive !== 'granted') {
    return { permission: 'denied', fcmToken: null, deviceType: deviceType() };
  }

  const token = await new Promise<string>((resolve, reject) => {
    let settled = false;
    let cleanup: (() => void) | null = null;

    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      cleanup?.();
      callback();
    };

    Promise.all([
      PushNotifications.addListener('registration', (registeredToken) => {
        finish(() => resolve(registeredToken.value));
      }),
      PushNotifications.addListener('registrationError', (error) => {
        finish(() => reject(new Error(error.error)));
      }),
    ])
      .then(([registrationHandle, errorHandle]) => {
        cleanup = () => {
          registrationHandle.remove().catch(() => {});
          errorHandle.remove().catch(() => {});
        };
        return PushNotifications.register();
      })
      .catch((error: unknown) => {
        finish(() => reject(error));
      });

    window.setTimeout(() => {
      finish(() => reject(new Error('Push registration timed out.')));
    }, 10000);
  });

  return { permission: 'granted', fcmToken: token, deviceType: deviceType() };
}

export async function setupPushNotificationActionRouting(
  onOpenHome: () => void,
): Promise<() => Promise<void>> {
  const handle = await PushNotifications.addListener(
    'pushNotificationActionPerformed',
    () => {
      onOpenHome();
    },
  );

  return () => handle.remove();
}
