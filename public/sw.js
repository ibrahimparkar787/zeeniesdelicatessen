const staticCache = ("static-cache-v1")
const assets = [
    "/js/app.js",
    "/css/app.css",
    "/img/logo.png",
    "/img/cart.png",
    "/img/cart-black.png",
    "/img/empty-cart.png",
    "/img/hero-cake.png",
    "/img/butter-chicken.png",
    "/img/butter-cookies.png",
    "/img/chicken-bread-roll.png",
    "/img/chicken-burger-patty.png",
    "/img/chicken-burger.png",
    "/img/chicken-crispy.png",
    "/img/chicken-roll.png",
    "/img/chicken-samosa.png",
    "/img/chocolate-cake.png",
    "/img/fried-rice.png",
    "/img/methi-laddu.png",
    "/img/pineapple-cake.png",
    "/img/roat.png",
    "/img/swiss-roll.png",
    "/img/icon.png",
    "/favicon.ico",
    "https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css",
    "https://unpkg.com/tailwindcss@%5E2/dist/tailwind.min.css"
]
const offlineCache = ("offline")
const offlineAssets = ["/offline.html"]

self.addEventListener("install", evt =>{
    //console.log("sw install")
    evt.waitUntil(
        caches.open(staticCache).then(cache => {
            cache.addAll(assets)
        })
    )
})

self.addEventListener("activate", evt =>{
    //console.log("sw activated")
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCache)
                .map(key => caches.delete(key))
            )
        })
    )
})

self.addEventListener("fetch", evt =>{
    //console.log("event fetched", evt)
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request)
            }).catch(() => {
                if (evt.request.url.indexOf(".html") > -1) {
                        caches.open(offlineCache).then(ocache => {
                            ocache.addAll(offlineAssets)
                        })
                }
            })
        )
    }) 