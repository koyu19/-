const CACHE_NAME = 'quiz-app-v1';
const urlsToCache = [
  './', // アプリのルート（index.html）
  'index.html',
  'style.css',
  'script.js',
  'images/icon-192x192.png', // manifest.jsonで指定したアイコン
  'images/icon-512x512.png'  // manifest.jsonで指定したアイコン
  // 必要であれば、その他の静的アセット（画像、フォントなど）もここに追加
];

// Service Worker のインストール
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// リソースのフェッチ（取得）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュにリソースがあればそれを使う
        if (response) {
          return response;
        }
        // なければネットワークから取得し、キャッシュに追加
        return fetch(event.request).then(
          (response) => {
            // レスポンスが不正な場合（例: 404）はキャッシュしない
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

// キャッシュのクリア（新しいバージョンがインストールされた時）
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // ホワイトリストにないキャッシュを削除
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
