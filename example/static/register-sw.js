/* eslint-disable no-var, prefer-arrow-callback */

"use strict";

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").then(function (reg) {
        // updatefound is fired if service-worker.js changes.
        reg.onupdatefound = function () {
            // The updatefound event implies that reg.installing is set; see
            // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
            var installingWorker = reg.installing;

            installingWorker.onstatechange = function () {
                switch (installingWorker.state) {
                    case "installed":
                        if (navigator.serviceWorker.controller) {
                            // At this point, the old content will have been purged and the fresh content will
                            // have been added to the cache.
                            // It"s the perfect time to display a "New content is available; please refresh."
                            // message in the page"s interface.
                            console.log("New or updated content is available.");
                        } else {
                            // At this point, everything has been precached.
                            // It"s the perfect time to display a "Content is cached for offline use." message.
                            console.log("Content is now available offline!");
                        }
                        break;

                    case "redundant":
                        console.error("The installing service worker became redundant.");
                        break;
                }
            };
        };
    }).catch(function (e) {
        console.error("Error during service worker registration:", e);
    });
}
