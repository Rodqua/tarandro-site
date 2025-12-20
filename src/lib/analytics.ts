"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

// Fonction pour envoyer des événements à GTM
export const trackEvent = (eventName: string, eventData?: any) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventData
    });
  }
};

// Hook pour tracker automatiquement les pages vues
export function usePageTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      trackEvent('page_view', {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [pathname, searchParams]);
}

// Fonctions de tracking spécifiques
export const trackFormSubmit = (formName: string, formData?: any) => {
  trackEvent('form_submit', {
    form_name: formName,
    ...formData
  });
};

export const trackButtonClick = (buttonName: string, buttonLocation?: string) => {
  trackEvent('button_click', {
    button_name: buttonName,
    button_location: buttonLocation
  });
};

export const trackPhoneClick = (phoneNumber: string) => {
  trackEvent('phone_click', {
    phone_number: phoneNumber,
    contact_method: 'phone'
  });
};

export const trackEmailClick = (email: string) => {
  trackEvent('email_click', {
    email: email,
    contact_method: 'email'
  });
};

export const trackServiceView = (serviceName: string) => {
  trackEvent('service_view', {
    service_name: serviceName,
    service_category: 'consultation'
  });
};

export const trackDownload = (fileName: string, fileType: string) => {
  trackEvent('file_download', {
    file_name: fileName,
    file_type: fileType
  });
};

export const trackScroll = (scrollDepth: number) => {
  trackEvent('scroll', {
    scroll_depth: scrollDepth,
    engagement_type: 'scroll'
  });
};

// Hook pour tracker le scroll
export function useScrollTracking() {
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    const depths = [25, 50, 75, 90];
    const tracked = new Set<number>();

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollPercent = Math.round(
          (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );

        depths.forEach(depth => {
          if (scrollPercent >= depth && !tracked.has(depth)) {
            tracked.add(depth);
            trackScroll(depth);
          }
        });
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);
}

export default trackEvent;
