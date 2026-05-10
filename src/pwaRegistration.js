const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || process.env.NODE_ENV !== 'production') {
    return;
  }

  window.addEventListener('load', () => {
    const publicUrl = new URL(process.env.PUBLIC_URL || '/', window.location.href);

    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    const serviceWorkerUrl = `${process.env.PUBLIC_URL}/sw.js`;

    if (isLocalhost) {
      navigator.serviceWorker.register(serviceWorkerUrl, { updateViaCache: 'none' }).catch(() => {});
      return;
    }

    navigator.serviceWorker.register(serviceWorkerUrl, { updateViaCache: 'none' }).catch(() => {});
  });
}
