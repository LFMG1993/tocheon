/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';

declare const self: ServiceWorkerGlobalScope;

// Definición manual para el evento de cambio de suscripción
interface PushSubscriptionChangeEvent extends ExtendableEvent {
    readonly newSubscription?: PushSubscription | null;
    readonly oldSubscription?: PushSubscription | null;
}

// ---------------------------------------------------------------------------
// PRECACHE INJECTION (Requerido por vite-plugin-pwa en modo injectManifest)
// ---------------------------------------------------------------------------
clientsClaim();

// 1. Limpiar cachés viejas automáticamente
cleanupOutdatedCaches();

// 2. Precargar los assets generados por Vite (index.html, js, css, images)
precacheAndRoute(self.__WB_MANIFEST);

// ---------------------------------------------------------------------------
// LÓGICA DE NOTIFICACIONES
// ---------------------------------------------------------------------------

// 1. Event: push (CRÍTICO para push notifications)
self.addEventListener('push', (event) => {
    if (!event.data) return;

    let notificationData: any = {};

    try {
        notificationData = event.data.json();
    } catch (e) {
        notificationData = { body: event.data.text() };
    }

    const title = notificationData.title || 'Nueva Notificación';
    const options: NotificationOptions = {
        body: notificationData.body || 'Tienes una nueva notificación',
        icon: notificationData.icon || '/icon-192.png',
        badge: notificationData.badge || '/icon-192.png', // Ajusta a tus iconos reales
        tag: notificationData.tag || 'notification',
        requireInteraction: notificationData.requireInteraction || false,
        data: notificationData.data || {},
        ...notificationData
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
            .then(() => console.log('[SW] Notificación mostrada exitosamente'))
            .catch((error) => console.error('[SW] Error mostrando notificación:', error))
    );
});

// 2. Event: notificationclick
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Buscar si ya hay una ventana abierta
                for (const client of clientList) {
                    const windowClient = client as WindowClient;
                    if (windowClient.url === urlToOpen && 'focus' in windowClient) {
                        return windowClient.focus();
                    }
                }
                // Si no hay, abrir una nueva
                if (self.clients.openWindow) {
                    return self.clients.openWindow(urlToOpen);
                }
            })
            .then(() => console.log('[SW] Click procesado, navegando a:', urlToOpen))
    );
});

// 3. Event: notificationclose
self.addEventListener('notificationclose', (_event) => {
});

// 4. Event: message
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    if (event.data && event.data.type === 'PING') {
        if (event.ports && event.ports[0]) {
            event.ports[0].postMessage({ type: 'PONG' });
        }
    }
});

// 5. Event: pushsubscriptionchange
self.addEventListener('pushsubscriptionchange', (_event: PushSubscriptionChangeEvent) => {
});