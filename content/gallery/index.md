---
title: "Gallery"
description: "We do not use cookies and we do not collect any personal data."
date: 2020-08-27T19:23:18+02:00
lastmod: 2020-08-27T19:23:18+02:00
draft: false
layout: "gallery"
images: []
---
<style>
.wrap {
    margin: 0 !important;  /* Removes all margins */
    padding: 0 !important; /* Removes all padding (optional) */
}
.content {
    margin: 0 !important;  /* Removes all margins */
    padding: 0 !important; /* Removes all padding (optional) */
}

body {
    height:100%;
    overflow:hidden;
}

iframe {
    position: fixed;
    left: 0;
    right: 0;
    top: 3.5625rem;
    width: 100%;
    height: calc(100vh - 3.5625rem);
    height: calc(100dvh - 3.5625rem);
    margin-top: 0;
    border: 1px solid #ccc;
}

@media (min-width: 768px) {
    iframe {
        top: 4rem;
        height: calc(100vh - 4rem);
        height: calc(100dvh - 4rem);
    }
}
</style>

<script>
    (function () {
        function initGallerySync() {
            const frame = document.getElementById("galleryFrame");
            if (!frame) return;

            const basePath = "/gallery-static.html";
            let syncingFromIframe = false;
            let syncingFromParent = false;

            function buildIframeUrlFromParent() {
                const parentUrl = new URL(window.location.href);
                const mode = parentUrl.searchParams.get("category");
                const frameUrl = new URL(basePath, window.location.origin);

                if (mode === "static" || mode === "interactive") {
                    frameUrl.searchParams.set("category", mode);
                }

                frameUrl.hash = window.location.hash || "";
                return frameUrl.pathname + frameUrl.search + frameUrl.hash;
            }

            function syncIframeFromParent() {
                if (syncingFromIframe) return;

                const target = buildIframeUrlFromParent();
                const current = frame.getAttribute("src") || "";
                if (current === target) return;

                syncingFromParent = true;
                frame.setAttribute("src", target);
                syncingFromParent = false;
            }

            function syncParentFromIframe() {
                if (syncingFromParent) return;

                try {
                    const frameLoc = frame.contentWindow.location;
                    if (!frameLoc || !frameLoc.pathname.endsWith("/gallery-static.html")) return;

                    const parentUrl = new URL(window.location.href);
                    const frameMode = new URLSearchParams(frameLoc.search).get("category");

                    if (frameMode === "static" || frameMode === "interactive") {
                        parentUrl.searchParams.set("category", frameMode);
                    } else {
                        parentUrl.searchParams.delete("category");
                    }

                    parentUrl.hash = frameLoc.hash || "";

                    const next = parentUrl.pathname + parentUrl.search + parentUrl.hash;
                    const current = window.location.pathname + window.location.search + window.location.hash;
                    if (next === current) return;

                    syncingFromIframe = true;
                    window.history.replaceState(null, "", next);
                    syncingFromIframe = false;
                } catch (err) {
                    // Ignore cross-context access issues while iframe is loading.
                }
            }

            frame.addEventListener("load", function () {
                syncParentFromIframe();

                try {
                    frame.contentWindow.addEventListener("hashchange", syncParentFromIframe);
                } catch (err) {
                    // Ignore cross-context access issues while iframe is loading.
                }
            });

            window.addEventListener("hashchange", syncIframeFromParent);
            window.addEventListener("popstate", syncIframeFromParent);

            syncIframeFromParent();
        }

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", initGallerySync);
        } else {
            initGallerySync();
        }
    })();
</script>

<iframe id="galleryFrame" src="/gallery-static.html"></iframe>

<!-- <div style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%;"> --> 
    
<!-- </div> -->