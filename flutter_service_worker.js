'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "7930c6ca41835cef8b771be3a4d9a184",
"assets/assets/icons/closet-wardrobe.png": "61524109205792b0af370a477e91d219",
"assets/assets/icons/couch-sofa.png": "14cea60883f546b7c2651a620cf5dec7",
"assets/assets/icons/desk-furniture-table.png": "0b0d3c9e1af45e1ff33b48078bfc65e4",
"assets/assets/icons/double-bed.png": "4244246bef69374ecc14fff7604cfa56",
"assets/assets/icons/rstars.png": "b1ac0c3c2a8f9493c760146b5256ce0a",
"assets/assets/images/bluesale.png": "207a9a286e1614c36afcff13a3195a66",
"assets/assets/images/chair3.png": "5b9ecb5c0d8dd196ae0c68f7aad32ca1",
"assets/assets/images/getstart1.png": "f577107b00d0985103bda78766b01f0a",
"assets/assets/images/gs.jpg": "41f1b5f9c250b3ce7acc11a75faa6396",
"assets/assets/images/sofa1.png": "d7ca7a5b2da830a66f966ed558a710f1",
"assets/assets/images/sofag.png": "5802d4cd7782cd672e8515d1a20d0635",
"assets/assets/images/sofaicon1.png": "b0ae34c34e105fe44d0d113049d80543",
"assets/assets/images/splash1.png": "f92889d983e3cddab99b8e7fd7873895",
"assets/assets/images/table2.png": "e407343ab7f78728752c8a11292c448b",
"assets/FontManifest.json": "eb6da0235e7c80d258fd97f4233b7004",
"assets/fonts/Abril_Fatface/AbrilFatface-Regular.ttf": "28195c14e6a271f42ca0994fac4fb0e4",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/fonts/Roboto/Roboto-Light.ttf": "6090d256d88dcd7f0244eaa4a3eafbba",
"assets/fonts/Roboto/Roboto-Regular.ttf": "f36638c2135b71e5a623dca52b611173",
"assets/NOTICES": "5e296c64adedb520420bdd74e2565626",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"favicon.ico": "3718cec3a726f960297dd43f0bc498de",
"flutter.js": "0816e65a103ba8ba51b174eeeeb2cb67",
"icons/Icon-192.png": "a6bc77bcdefa38f66ab15b9d62727f1f",
"icons/Icon-512.png": "1da6f02d4bf239deac5ed8b148bf600f",
"index.html": "9fb9650e4b1b3b2385ff555a408ab5b7",
"/": "9fb9650e4b1b3b2385ff555a408ab5b7",
"main.dart.js": "457c18b748eac69977f152fee35a2698",
"manifest.json": "486d3e8bc04bf320ad4b7daea43694fd",
"splash/img/dark-1x.png": "49030bd9a01176382591e40548423932",
"splash/img/dark-2x.png": "661716ccb71c4b8039168a906840b2d0",
"splash/img/dark-3x.png": "d1efa4ce0042b7e40915989a323abb56",
"splash/img/light-1x.png": "49030bd9a01176382591e40548423932",
"splash/img/light-2x.png": "661716ccb71c4b8039168a906840b2d0",
"splash/img/light-3x.png": "d1efa4ce0042b7e40915989a323abb56",
"splash/style.css": "2fec14392ceadc8b45659a297dd3071d",
"version.json": "6f19bc272628074f0542f6a6d2aeff85"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
