"use strict";

var log = console.log.bind(console);
var err = console.error.bind(console);
this.onerror = err;

// Moves the contents of one named cached into another.
var cacheCopy = function(source, destination) {
  return caches.delete(destination).then(function() {
    return Promise.all([
      caches.open(source),
      caches.open(destination)
      ]).then(function(results) {
      var sourceCache = results[0];
      var destCache = results[1];

      return sourceCache.keys().then(function(requests) {
        return Promise.all(requests.map(function(request) {
          return sourceCache.match(request).then(function(response) {
            return destCache.put(request, response);
          });
        }));
      });
    });
  });
}

var fetchAndCache = function(request, cache) {
  if (!(request instanceof Request)) {
    request = new Request(request);
  }

  return fetch(request.clone()).then(function(response) {
    cache.put(request, response.clone());
    return response;
  });
};

var baseUrl = (new URL("./", this.location.href) + "");

var scope;
if (self.registration) {
  scope = self.registration.scope;
  } else {
  scope = self.scope || baseUrl;
}

var resourceUrls = [
  "",
  "images/1.png",
  "images/2.png",
  "images/3.png",
  "images/4.png",
  "images/5.png",
  "images/6.png",
  "images/7.png",
  "style.css",
  "script.js",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://fonts.gstatic.com/s/materialicons/v17/2fcrYFNaTjcS6g4U3t-Y5UEw0lE80llgEseQY3FEmqw.woff2"
];

this.addEventListener("install", function(e) {
  e.waitUntil(caches.delete("test-waiting").then(function() {
    return caches.open("test-waiting").then(function(test) {

      return Promise.all(resourceUrls.map(function(resourceUrl) {
        return fetchAndCache(resourceUrl, test);
      }));
    });
  }));
});


this.addEventListener("activate", function(e) {
  // Copy the newly installed cache to the active cache
  e.waitUntil(cacheCopy("test-waiting", "test"));
});

this.addEventListener("fetch", function(e) {
  var request = e.request;

  // Basic read-through caching.
  e.respondWith(
  caches.open("test").then(function(test) {
    return test.match(request).then(function(response) {
      if (response) {
        log("Found in cache: ", response);
        return response;
      }

      // we didn't have it in the cache, so add it to the cache and return it
      log("runtime caching:", request.url);

      return fetchAndCache(request, test);
    });
  })
  );
});
