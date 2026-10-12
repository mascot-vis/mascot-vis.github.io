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

.gallery-loading {
    align-items: center;
    background: #fff;
    color: #1d2d35;
    display: flex;
    flex-direction: column;
    font-size: 1.25rem;
    font-weight: 700;
    gap: 16px;
    justify-content: center;
    left: 0;
    min-height: calc(100vh - 3.5625rem);
    min-height: calc(100dvh - 3.5625rem);
    position: fixed;
    right: 0;
    top: 3.5625rem;
    z-index: 2;
}

.gallery-loading-icon {
    animation: galleryLoadingSpin 1s linear infinite;
    border: 3px solid #e5e8ef;
    border-top-color: #3C692F;
    border-radius: 50%;
    height: 34px;
    width: 34px;
}

.gallery-loading.is-hidden {
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
}

@keyframes galleryLoadingSpin {
    to {
        transform: rotate(360deg);
    }
}

@media (min-width: 768px) {
    iframe {
        top: 4rem;
        height: calc(100vh - 4rem);
        height: calc(100dvh - 4rem);
    }

    .gallery-loading {
        min-height: calc(100vh - 4rem);
        min-height: calc(100dvh - 4rem);
        top: 4rem;
    }
}
</style>

<script>
    (function () {
        // The gallery itself (static/gallery.html) keeps its state in the query string
        // (?demo=...&mark=...&behavior=...&q=...) and navigates with history.pushState.
        // This wrapper forwards the parent URL's query/hash to the iframe on load, and
        // mirrors the iframe's URL back into the parent so links can be shared.
        function initGallerySync() {
            const frame = document.getElementById("galleryFrame");
            const loading = document.getElementById("galleryLoading");
            if (!frame) return;

            const basePath = "/gallery.html";

            function showLoading() {
                if (loading) loading.classList.remove("is-hidden");
            }

            function hideLoading() {
                if (loading) loading.classList.add("is-hidden");
            }

            function iframeTargetFromParent() {
                return basePath + window.location.search + window.location.hash;
            }

            function currentIframeUrl() {
                try {
                    const loc = frame.contentWindow.location;
                    if (loc && loc.pathname.endsWith(basePath)) return loc.pathname + loc.search + loc.hash;
                } catch (err) {
                    // Ignore cross-context access issues while iframe is loading.
                }
                return frame.getAttribute("src") || "";
            }

            // Parent URL -> iframe (initial load, and Back/Forward on parent-only entries).
            function syncIframeFromParent() {
                const target = iframeTargetFromParent();
                if (currentIframeUrl() === target) return;
                showLoading();
                frame.setAttribute("src", target);
            }

            // Iframe URL -> parent (keeps the address bar shareable).
            function syncParentFromIframe() {
                try {
                    const loc = frame.contentWindow.location;
                    if (!loc || !loc.pathname.endsWith(basePath)) return;
                    const next = window.location.pathname + loc.search + loc.hash;
                    const current = window.location.pathname + window.location.search + window.location.hash;
                    if (next !== current) window.history.replaceState(null, "", next);
                } catch (err) {
                    // Ignore cross-context access issues while iframe is loading.
                }
            }

            frame.addEventListener("load", function () {
                hideLoading();
                syncParentFromIframe();

                try {
                    const win = frame.contentWindow;
                    // The gallery uses pushState/replaceState, which fire no events, so wrap them.
                    ["pushState", "replaceState"].forEach(function (name) {
                        const original = win.history[name];
                        win.history[name] = function () {
                            const result = original.apply(this, arguments);
                            syncParentFromIframe();
                            return result;
                        };
                    });
                    win.addEventListener("popstate", syncParentFromIframe);
                    win.addEventListener("hashchange", syncParentFromIframe);
                } catch (err) {
                    // Ignore cross-context access issues while iframe is loading.
                }
            });

            window.addEventListener("popstate", syncIframeFromParent);
            window.addEventListener("hashchange", syncIframeFromParent);

            // Load the iframe with the parent's query/hash, e.g. /gallery/?demo=IsotypeComparison.
            syncIframeFromParent();
        }

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", initGallerySync);
        } else {
            initGallerySync();
        }
    })();
</script>

<div id="galleryLoading" class="gallery-loading" role="status" aria-live="polite">
    <span class="gallery-loading-icon" aria-hidden="true"></span>
    <span>Loading Demos</span>
</div>
<iframe id="galleryFrame"></iframe>

<!-- <div style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%;"> --> 
    
<!-- </div> -->
