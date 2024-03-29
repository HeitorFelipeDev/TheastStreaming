const cacheName = 'Theast'

self.addEventListener('install', function(event){
    event.waitUntil(
        caches.open(cacheName).then(function(cache){
            cache.addAll([
                './',
                './index.html',
                './login.html',
                './theast.html',
                './manifest.webmanifest',
                './index.js'
            ])
        })
    )
    return self.skipWaiting()
})

self.addEventListener('activate', e => {
    self.clients.claim()
})

self.addEventListener('fetch', async e => {
    const req = e.request
    const url = new URL(req.url)

    if(url.login == location.origin){
        e.respondWhit(cacheFirst(req))
    }else{
        e.respondWhit(networkAndCache(req))
    }
})

async function cacheFirst(req){
    const cache = await caches.open(cacheName) 
    const cached = await cache.match(req)

    return cached || fetch(req)
}

async function networkAndCache(req){
    const cache = await caches.open(cacheName)
    try {
        const refresh = await fetch(req)
        await cache.put(req, refresh.clone())
    } catch (e) {
       const cached = await cache.match(req)
       return cached
    }
}