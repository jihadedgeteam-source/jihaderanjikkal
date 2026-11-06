const CACHE_NAME = "jihad-portfolio-offline-v27";
const CORE_FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./images/BG.PNG",
    "./images/IMG_2122.PNG",
    "./Logo/insta.png",
    "./Logo/Facebook.png",
    "./Logo/Linkedin.png",
    "./Logo/snapchat.png",
    "./Logo/threads.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(
                CORE_FILES.map((file) => new Request(file, { cache: "reload" }))
            ))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName !== CACHE_NAME)
                    .map((cacheName) => caches.delete(cacheName))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    const request = event.request;
    const requestUrl = new URL(request.url);
    if (request.method !== "GET" || requestUrl.origin !== self.location.origin) {
        return;
    }

    const responsePromise = fetch(request)
        .then(async (response) => {
            if (response.ok) {
                try {
                    const cache = await caches.open(CACHE_NAME);
                    await cache.put(request, response.clone());
                } catch (error) {
                    console.error("Offline resource could not be cached.", error);
                }
            }
            return response;
        }, async () => {
            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match(request, { ignoreSearch: true });
            if (cachedResponse) {
                return cachedResponse;
            }

            if (request.mode === "navigate") {
                const homePage = await cache.match("./index.html");
                if (homePage) {
                    return homePage;
                }
            }

            return new Response("This file is not available offline yet. Open it once while connected to cache it.", {
                status: 503,
                headers: { "Content-Type": "text/plain; charset=utf-8" }
            });
        });

    event.respondWith(responsePromise);
});
