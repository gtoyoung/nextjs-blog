if(!self.define){let e,n={};const s=(s,c)=>(s=new URL(s+".js",c).href,n[s]||new Promise((n=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=n,document.head.appendChild(e)}else e=s,importScripts(s),n()})).then((()=>{let e=n[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(c,i)=>{const a=e||("document"in self?document.currentScript.src:"")||location.href;if(n[a])return;let o={};const t=e=>s(e,a),r={module:{uri:a},exports:o,require:t};n[a]=Promise.all(c.map((e=>r[e]||t(e)))).then((e=>(i(...e),o)))}}define(["./workbox-1846d813"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/aPMtIKmz_HHT2Wcx6TRos/_buildManifest.js",revision:"aPMtIKmz_HHT2Wcx6TRos"},{url:"/_next/static/aPMtIKmz_HHT2Wcx6TRos/_ssgManifest.js",revision:"aPMtIKmz_HHT2Wcx6TRos"},{url:"/_next/static/chunks/418ea8eae7f11b017806f9d3520cbe973473af3b.638bcd85e2d6a81ce573.js",revision:"aPMtIKmz_HHT2Wcx6TRos"},{url:"/_next/static/chunks/4cf8b569b0c911a2e7b5da2ba101d2640f181393.338556e35d9c88d81a1f.js",revision:"aPMtIKmz_HHT2Wcx6TRos"},{url:"/_next/static/chunks/75fc9c18.76ec80392d0ebcb604d4.js",revision:"aPMtIKmz_HHT2Wcx6TRos"},{url:"/_next/static/chunks/bfa37fcd0818edd0d3354ea585e5d4d4b3e87fa4.0ca188ec31f21c6b6aea.js",revision:"aPMtIKmz_HHT2Wcx6TRos"},{url:"/_next/static/chunks/c9787b2e67d04485ea556b79e503c7f6cc1ff4d5.b124145147f4ff223500.js",revision:"aPMtIKmz_HHT2Wcx6TRos"},{url:"/_next/static/chunks/commons.0ad5f420dff3a0811547.js",revision:"aPMtIKmz_HHT2Wcx6TRos"},{url:"/_next/static/chunks/framework.ae3781fe50e43492a499.js",revision:"aPMtIKmz_HHT2Wcx6TRos"},{url:"/_next/static/chunks/main-c9b779c45aa7d5a9e73f.js",revision:"aPMtIKmz_HHT2Wcx6TRos"},{url:"/_next/static/chunks/pages/_app-f87782683eb91cc70ecb.js",revision:"aPMtIKmz_HHT2Wcx6TRos"},{url:"/_next/static/chunks/pages/_error-711bc11160ffeadbe2a7.js",revision:"aPMtIKmz_HHT2Wcx6TRos"},{url:"/_next/static/chunks/pages/blog-df58a76e8cc05633aa72.js",revision:"aPMtIKmz_HHT2Wcx6TRos"},{url:"/_next/static/chunks/pages/blog/%5Bslug%5D-9d720d385c1e217e10a0.js",revision:"aPMtIKmz_HHT2Wcx6TRos"},{url:"/_next/static/chunks/pages/index-522a62ee94aff1cd3b82.js",revision:"aPMtIKmz_HHT2Wcx6TRos"},{url:"/_next/static/chunks/pages/photo-61172fa19951d4aaa388.js",revision:"aPMtIKmz_HHT2Wcx6TRos"},{url:"/_next/static/chunks/polyfills-ee8b6a435fbaa7581564.js",revision:"aPMtIKmz_HHT2Wcx6TRos"},{url:"/_next/static/chunks/styles.aebaf25547d8e062ded5.js",revision:"aPMtIKmz_HHT2Wcx6TRos"},{url:"/_next/static/chunks/webpack-e45562d28b2d27534479.js",revision:"aPMtIKmz_HHT2Wcx6TRos"},{url:"/_next/static/css/styles.6a644e81.chunk.css",revision:"aPMtIKmz_HHT2Wcx6TRos"},{url:"/icon/android-icon-144x144.png",revision:"dfa2bb86ae902dda6b2c3f54cc86515e"},{url:"/icon/android-icon-192x192.png",revision:"74f26d66b51f609880951bf289754e2e"},{url:"/icon/android-icon-36x36.png",revision:"105f574d7094b20e7f6d107c5d30408b"},{url:"/icon/android-icon-48x48.png",revision:"9e26506ae027273448859f8d885b5382"},{url:"/icon/android-icon-72x72.png",revision:"728d5e8c8f4c3e3a4197050407a1c20b"},{url:"/icon/android-icon-96x96.png",revision:"b28099020b2d4dfa21af51215e52bbc7"},{url:"/icon/apple-icon-114x114.png",revision:"547e4c148a5786fc8caeb8ce2b8e33e3"},{url:"/icon/apple-icon-120x120.png",revision:"d0d8e22536e5a3305cf0432040706b63"},{url:"/icon/apple-icon-144x144.png",revision:"c8f5b365248975f92e3eefdb83815f19"},{url:"/icon/apple-icon-152x152.png",revision:"2332b526623055928e3bc8988220f4dd"},{url:"/icon/apple-icon-180x180.png",revision:"8e5ecfbf75fdaaa3909064fedb8f3408"},{url:"/icon/apple-icon-57x57.png",revision:"1ff8641df826a155fbaaba736b717d77"},{url:"/icon/apple-icon-60x60.png",revision:"1e82bed89a7dcaef1d456b1d9ed399eb"},{url:"/icon/apple-icon-72x72.png",revision:"120f7443c767284bc9180e0c5adf43f8"},{url:"/icon/apple-icon-76x76.png",revision:"168b1b49ca082a9cae66518e7ec3001d"},{url:"/icon/apple-icon.png",revision:"c10be233442b033c3baa4f31e6eef497"},{url:"/icon/favicon-16x16.png",revision:"952fbef9e49beeef1245348e8acd3e10"},{url:"/icon/favicon-32x32.png",revision:"cc1959023eac2285f50a95dfc195fd43"},{url:"/icon/favicon-96x96.png",revision:"649e5a6cc785e349423f30f6a764e3cc"},{url:"/icon/favicon.ico",revision:"58520771ef07cd797e9a2cd18be46b7e"},{url:"/icon/icon-192x192.png",revision:"ffe35ac0b125f85ec7b1d74d23caa3ba"},{url:"/icon/icon-256x256.png",revision:"62f797538fd3fcac245d502c75838a12"},{url:"/icon/icon-384x384.png",revision:"3aec6eb3ba380ed656d40c98422123e5"},{url:"/icon/icon-512x512.png",revision:"f98c29d55f89b03a8aa291e5a0ece3b6"},{url:"/icon/ms-icon-144x144.png",revision:"c8f5b365248975f92e3eefdb83815f19"},{url:"/icon/ms-icon-150x150.png",revision:"0905474dfe1192f356dc3707ecaa3fc5"},{url:"/icon/ms-icon-310x310.png",revision:"417725d09923c07842dbdc2873856332"},{url:"/icon/ms-icon-70x70.png",revision:"42f0fcff3a90987a1870478a1644d54c"},{url:"/manifest.json",revision:"fe8ddb608195402c90e198adeb68e387"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:n,event:s,state:c})=>n&&"opaqueredirect"===n.type?new Response(n.body,{status:200,statusText:"OK",headers:n.headers}):n}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const n=e.pathname;return!n.startsWith("/api/auth/")&&!!n.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
