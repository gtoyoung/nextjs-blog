if(!self.define){let e,c={};const n=(n,s)=>(n=new URL(n+".js",s).href,c[n]||new Promise((c=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=c,document.head.appendChild(e)}else e=n,importScripts(n),c()})).then((()=>{let e=c[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,i)=>{const a=e||("document"in self?document.currentScript.src:"")||location.href;if(c[a])return;let f={};const d=e=>n(e,a),t={module:{uri:a},exports:f,require:d};c[a]=Promise.all(s.map((e=>t[e]||d(e)))).then((e=>(i(...e),f)))}}define(["./workbox-1846d813"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/KdRZ1zxf3Rc08Ln2Lf8zP/_buildManifest.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/KdRZ1zxf3Rc08Ln2Lf8zP/_ssgManifest.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/29107295.ba0fc54a8b82d0f4d901.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/32ee23b9495e52f11e17da1b34e77fda7bbe2cbc.a077803225ecaa32825d.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/56c87bed6df02e67b89032d114d0129adc1f9f69.e956f8d22348b573db07.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/56d3b36c5d40011428e004bcb1091ea11c60ad57.424fe35fb1e687b45210.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/75fc9c18.a34826c8ee0de8524b0b.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/80cc2112ada37b1d99404b8f39a17058ed2b5c26.4a6930c0c2d6391590a9.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/8d18139f.dd91d1d7cf5d7505dd7f.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/a198fdd9.629f86317ca7216babaa.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/ba950247d3def9347eaede707b5969cdd611997e.ed2bc553b7fcd4b1c00c.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/bd52d5ffa98065d6ccdf6fda3672729a5cb8a21d.20280600bfd250a26c81.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/bfa37fcd0818edd0d3354ea585e5d4d4b3e87fa4.3569d5d72c2cec735ea1.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/c9787b2e67d04485ea556b79e503c7f6cc1ff4d5.f80822abef0678d1d5f6.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/commons.2259961aad754e8d3372.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/d09f71c2771447e62661a7b2e7969c57ce47c1dd.e9cb37a6d2f5306727c4.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/ead3bdbba26848105720edd265e4c2928173e56e.8feae46d858ad655c39e.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/f0bbf60afcc4304456bf378847d0a93110d3f0b4.fa202a5f89721925984e.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/ff4ddc26bce763b4f8f8e5cbb1ad48de00c33791.12eb898aa01d6b5a16b8.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/framework.ae3781fe50e43492a499.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/main-f3f3fc886f1a2b23d061.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/pages/_app-940a8cca700f0cb44fac.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/pages/_error-7c9d9169e2d456a924b9.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/pages/admin-e0a5b3efe74fa06fccd0.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/pages/blog-63eef72379fa4c7d9487.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/pages/blog/%5Bslug%5D-b8cea04cb3ea58b37e1e.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/pages/chat-deb11105ca569ea75c01.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/pages/experiment-6f32c679ee627ad33958.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/pages/index-ed7cf91802ce6db351ce.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/pages/map-12bad7f8a6a2c42bb0f4.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/pages/photo-73fae17e6a948eae5e6c.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/pages/space-610be37d748bb5c274a4.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/pages/todo-e4d1412112e0469d0170.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/polyfills-eaad56c3ccfb2655d56e.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/styles.b4aa7efcf516e4c3351c.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/chunks/webpack-b14d8505300bbaaeab98.js",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/_next/static/css/styles.dfd2582f.chunk.css",revision:"KdRZ1zxf3Rc08Ln2Lf8zP"},{url:"/firebase-messaging-sw.js",revision:"31d4613ffdb94a924f8f2b0d28b530a5"},{url:"/icon/android-icon-144x144.png",revision:"dfa2bb86ae902dda6b2c3f54cc86515e"},{url:"/icon/android-icon-192x192.png",revision:"74f26d66b51f609880951bf289754e2e"},{url:"/icon/android-icon-36x36.png",revision:"105f574d7094b20e7f6d107c5d30408b"},{url:"/icon/android-icon-48x48.png",revision:"9e26506ae027273448859f8d885b5382"},{url:"/icon/android-icon-72x72.png",revision:"728d5e8c8f4c3e3a4197050407a1c20b"},{url:"/icon/android-icon-96x96.png",revision:"b28099020b2d4dfa21af51215e52bbc7"},{url:"/icon/apple-icon-114x114.png",revision:"547e4c148a5786fc8caeb8ce2b8e33e3"},{url:"/icon/apple-icon-120x120.png",revision:"d0d8e22536e5a3305cf0432040706b63"},{url:"/icon/apple-icon-144x144.png",revision:"c8f5b365248975f92e3eefdb83815f19"},{url:"/icon/apple-icon-152x152.png",revision:"2332b526623055928e3bc8988220f4dd"},{url:"/icon/apple-icon-180x180.png",revision:"8e5ecfbf75fdaaa3909064fedb8f3408"},{url:"/icon/apple-icon-57x57.png",revision:"1ff8641df826a155fbaaba736b717d77"},{url:"/icon/apple-icon-60x60.png",revision:"1e82bed89a7dcaef1d456b1d9ed399eb"},{url:"/icon/apple-icon-72x72.png",revision:"120f7443c767284bc9180e0c5adf43f8"},{url:"/icon/apple-icon-76x76.png",revision:"168b1b49ca082a9cae66518e7ec3001d"},{url:"/icon/apple-icon.png",revision:"c10be233442b033c3baa4f31e6eef497"},{url:"/icon/favicon-16x16.png",revision:"952fbef9e49beeef1245348e8acd3e10"},{url:"/icon/favicon-32x32.png",revision:"cc1959023eac2285f50a95dfc195fd43"},{url:"/icon/favicon-96x96.png",revision:"649e5a6cc785e349423f30f6a764e3cc"},{url:"/icon/favicon.ico",revision:"58520771ef07cd797e9a2cd18be46b7e"},{url:"/icon/icon-192x192.png",revision:"ffe35ac0b125f85ec7b1d74d23caa3ba"},{url:"/icon/icon-256x256.png",revision:"62f797538fd3fcac245d502c75838a12"},{url:"/icon/icon-384x384.png",revision:"3aec6eb3ba380ed656d40c98422123e5"},{url:"/icon/icon-512x512.png",revision:"f98c29d55f89b03a8aa291e5a0ece3b6"},{url:"/icon/ms-icon-144x144.png",revision:"c8f5b365248975f92e3eefdb83815f19"},{url:"/icon/ms-icon-150x150.png",revision:"0905474dfe1192f356dc3707ecaa3fc5"},{url:"/icon/ms-icon-310x310.png",revision:"417725d09923c07842dbdc2873856332"},{url:"/icon/ms-icon-70x70.png",revision:"42f0fcff3a90987a1870478a1644d54c"},{url:"/img/keyboard.gif",revision:"e5bd3a2f2cf2f6f4dad0f531b92564be"},{url:"/img/monophy.gif",revision:"37fc2d460c2ab5ce225e15fb29959ac7"},{url:"/manifest.json",revision:"8cb1de4227286c6bc90e43d4926e087c"},{url:"/trees/index.html",revision:"104039449906656e3b4f521d25236fc7"},{url:"/trees/src/css/style.css",revision:"ee9778e17218c00ac20455895397adfe"},{url:"/trees/src/img/cloud.gif",revision:"bfe124083f3acdfb46569a38a83b6bf2"},{url:"/trees/src/js/app.js",revision:"bd364790539ab88a2b2ce8a432cbf07c"},{url:"/trees/src/js/branch.js",revision:"b861ff499f1e76fe4a40c4caacf16e02"},{url:"/trees/src/js/space.js",revision:"054e7e6a1193cd8c2e4b6611eb66a321"},{url:"/trees/src/js/tree.js",revision:"eaa9f0fdf93654790a2981982b1bd182"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:c,event:n,state:s})=>c&&"opaqueredirect"===c.type?new Response(c.body,{status:200,statusText:"OK",headers:c.headers}):c}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const c=e.pathname;return!c.startsWith("/api/auth/")&&!!c.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
