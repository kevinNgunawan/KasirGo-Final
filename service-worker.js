/* ═══════════════════════════════════════════════════════
   KasirGO — Service Worker v3
   ═══════════════════════════════════════════════════════ */

const CACHE_VERSION = "kasirgo-v4";
const OFFLINE_PAGE = "offline.html";

// Aset lokal — pakai path relatif terhadap scope
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./offline.html",
  "./manifest.json",
  "./style.css",
  "./app.js",
  "./icons/favicon.ico",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192x192.png",
  "./icons/icon-512x512.png",
];

const CDN_ASSETS = [
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css",
  "https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css",
  "https://cdn.datatables.net/1.13.7/css/dataTables.bootstrap5.min.css",
  "https://code.jquery.com/jquery-3.6.0.min.js",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
  "https://cdn.jsdelivr.net/npm/sweetalert2@11",
  "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js",
  "https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js",
  "https://cdn.datatables.net/1.13.7/js/dataTables.bootstrap5.min.js",
];

/* ── INSTALL ──────────────────────────────────────────── */
self.addEventListener("install", event => {
  console.log("[KasirGO SW] Install", CACHE_VERSION);
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_VERSION).then(async cache => {
      // Cache aset lokal satu per satu agar tidak gagal total
      for (const asset of STATIC_ASSETS) {
        await cache.add(asset).catch(() => console.warn("[SW] Skip:", asset));
      }
      // Cache CDN — opsional, gagal tidak masalah
      await Promise.allSettled(CDN_ASSETS.map(u => cache.add(u).catch(() => { })));
      console.log("[KasirGO SW] Cache selesai.");
    })
  );
});

/* ── ACTIVATE ─────────────────────────────────────────── */
self.addEventListener("activate", event => {
  console.log("[KasirGO SW] Activate", CACHE_VERSION);
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_VERSION).map(k => {
          console.log("[SW] Hapus cache lama:", k);
          return caches.delete(k);
        })
      ))
      .then(() => self.clients.claim())
  );
});

/* ── FETCH ────────────────────────────────────────────── */
self.addEventListener("fetch", event => {
  const { request } = event;
  const url = new URL(request.url);

  // Abaikan non-GET & chrome-extension
  if (request.method !== "GET") return;
  if (url.protocol === "chrome-extension:") return;

  // Biarkan Google Fonts dihandle browser (streaming)
  if (url.hostname === "fonts.googleapis.com" ||
    url.hostname === "fonts.gstatic.com") return;

  /* Navigasi halaman → Network-first, fallback offline.html */
  if (request.mode === "navigate" || request.headers.get("accept").includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then(res => {
          caches.open(CACHE_VERSION).then(c => c.put(request, res.clone()));
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(request, { ignoreSearch: true });
          if (cached) return cached;
          return caches.match(new URL(OFFLINE_PAGE, self.location).href, { ignoreSearch: true });
        })
    );
    return;
  }

  /* Aset lokal (same-origin) → Cache-first */
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request, { ignoreSearch: true }).then(cached => {
        if (cached) return cached;
        return fetch(request).then(res => {
          caches.open(CACHE_VERSION).then(c => c.put(request, res.clone()));
          return res;
        }).catch(() => {
          // Jangan kembalikan offline.html untuk JS/CSS agar tidak blank/error syntax
          return new Response("", { status: 408, statusText: "Offline" });
        });
      })
    );
    return;
  }

  /* CDN / Eksternal → Stale-While-Revalidate */
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then(cached => {
      const networkFetch = fetch(request).then(res => {
        caches.open(CACHE_VERSION).then(c => c.put(request, res.clone()));
        return res;
      }).catch(() => cached);
      return cached || networkFetch;
    })
  );
});

/* ── BACKGROUND SYNC ──────────────────────────────────── */
self.addEventListener("sync", event => {
  if (event.tag === "sync-transaksi") {
    console.log("[KasirGO SW] Background sync: transaksi...");
    event.waitUntil(Promise.resolve());
  }
});

/* ── PERIODIC SYNC ────────────────────────────────────── */
self.addEventListener("periodicsync", event => {
  if (event.tag === "update-kasirgo") {
    console.log("[KasirGO SW] Periodic sync...");
    event.waitUntil(Promise.resolve());
  }
});

/* ── PUSH NOTIFICATION ────────────────────────────────── */
self.addEventListener("push", event => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title ?? "KasirGO", {
      body: data.body ?? "Ada notifikasi baru dari KasirGO.",
      icon: "./icons/icon-192x192.png",
      badge: "./icons/icon-192x192.png",
      tag: "kasirgo-notif",
      renotify: true,
      data: { url: data.url ?? self.registration.scope },
    })
  );
});

/* ── NOTIFICATION CLICK ───────────────────────────────── */
self.addEventListener("notificationclick", event => {
  event.notification.close();
  const target = event.notification.data?.url ?? self.registration.scope;
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
      const win = list.find(c => c.url.startsWith(self.registration.scope) && "focus" in c);
      return win ? win.focus() : clients.openWindow(target);
    })
  );
});
