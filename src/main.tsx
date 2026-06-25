import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { setupApiAuth } from '@/lib/setupApiAuth';

setupApiAuth();

// Service Worker 등록 - 웹(PWA) 환경에서만 활성화
// Capacitor 앱으로 실행 중일 때는 SW를 건너뜀
const isCapacitor = window.location.protocol === 'capacitor:' || (window as any).Capacitor?.isNativePlatform?.();

if ('serviceWorker' in navigator && !isCapacitor) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch((err) => {
      console.warn('[PWA] Service Worker 등록 실패:', err);
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
