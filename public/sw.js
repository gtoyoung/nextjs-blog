<<<<<<< HEAD
if(!self.define){let e,s={};const n=(n,c)=>(n=new URL(n+".js",c).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(c,i)=>{const a=e||("document"in self?document.currentScript.src:"")||location.href;if(s[a])return;let r={};const t=e=>n(e,a),o={module:{uri:a},exports:r,require:t};s[a]=Promise.all(c.map((e=>o[e]||t(e)))).then((e=>(i(...e),r)))}}define(["./workbox-1846d813"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/brNeZEGCk_7Hp_3JQPWv7/_buildManifest.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/brNeZEGCk_7Hp_3JQPWv7/_ssgManifest.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/29107295.158623e8e793589af5f6.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/32ee23b9495e52f11e17da1b34e77fda7bbe2cbc.327808eeeb257f2e887b.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/75fc9c18.53aa92612060399ef9a2.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/8d18139f.dd91d1d7cf5d7505dd7f.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/a198fdd9.6b22be7df76a302b98b3.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/a3b3083b194d14d147f43a5888810d6a54b5f202.651186498c16d15f1e91.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/ba950247d3def9347eaede707b5969cdd611997e.ed2bc553b7fcd4b1c00c.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/bd52d5ffa98065d6ccdf6fda3672729a5cb8a21d.0b1fa28ff4b0cd708675.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/bfa37fcd0818edd0d3354ea585e5d4d4b3e87fa4.cf37cbefe4e7e9a97ac9.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/c9787b2e67d04485ea556b79e503c7f6cc1ff4d5.5cf73da3ae6245cc0519.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/commons.2259961aad754e8d3372.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/d09f71c2771447e62661a7b2e7969c57ce47c1dd.413e368927745f093ec7.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/df07f30f88020ae9a43ba49d6de38e2113b2c611.8de61891757ef1df137a.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/e3050ea9595e4042a1e8c98157f0d2af73473253.eed475cda9a5360f447e.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/f0bbf60afcc4304456bf378847d0a93110d3f0b4.5246d189ad97018d4acf.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/ff4ddc26bce763b4f8f8e5cbb1ad48de00c33791.12eb898aa01d6b5a16b8.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/framework.ae3781fe50e43492a499.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/main-53428f6083b4a4e7d145.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/pages/_app-cc54403b8796d2480737.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/pages/_error-66d42075af463a259c2d.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/pages/admin-19985c390e30519b4cd5.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/pages/blog-d0bdd30926a75aa087ed.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/pages/blog/%5Bslug%5D-29cd733bdd200792a626.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/pages/chat-924a57900a068757d2d4.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/pages/experiment-a40a447cbca2b0689d2d.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/pages/index-f519b314d28f3b5b2f77.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/pages/map-101c5fbcdb9a6d9a3549.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/pages/photo-88961a0d133d4af3e8ce.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/pages/space-01856ffa52eeb5b59af6.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/pages/todo-4fce8f08c97844725b4a.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/polyfills-f592d1bdd69a8058bb80.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/styles.993b2869187f2c1cecad.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/chunks/webpack-b14d8505300bbaaeab98.js",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/_next/static/css/styles.1ded940a.chunk.css",revision:"brNeZEGCk_7Hp_3JQPWv7"},{url:"/firebase-messaging-sw.js",revision:"31d4613ffdb94a924f8f2b0d28b530a5"},{url:"/icon/android-icon-144x144.png",revision:"dfa2bb86ae902dda6b2c3f54cc86515e"},{url:"/icon/android-icon-192x192.png",revision:"74f26d66b51f609880951bf289754e2e"},{url:"/icon/android-icon-36x36.png",revision:"105f574d7094b20e7f6d107c5d30408b"},{url:"/icon/android-icon-48x48.png",revision:"9e26506ae027273448859f8d885b5382"},{url:"/icon/android-icon-72x72.png",revision:"728d5e8c8f4c3e3a4197050407a1c20b"},{url:"/icon/android-icon-96x96.png",revision:"b28099020b2d4dfa21af51215e52bbc7"},{url:"/icon/apple-icon-114x114.png",revision:"547e4c148a5786fc8caeb8ce2b8e33e3"},{url:"/icon/apple-icon-120x120.png",revision:"d0d8e22536e5a3305cf0432040706b63"},{url:"/icon/apple-icon-144x144.png",revision:"c8f5b365248975f92e3eefdb83815f19"},{url:"/icon/apple-icon-152x152.png",revision:"2332b526623055928e3bc8988220f4dd"},{url:"/icon/apple-icon-180x180.png",revision:"8e5ecfbf75fdaaa3909064fedb8f3408"},{url:"/icon/apple-icon-57x57.png",revision:"1ff8641df826a155fbaaba736b717d77"},{url:"/icon/apple-icon-60x60.png",revision:"1e82bed89a7dcaef1d456b1d9ed399eb"},{url:"/icon/apple-icon-72x72.png",revision:"120f7443c767284bc9180e0c5adf43f8"},{url:"/icon/apple-icon-76x76.png",revision:"168b1b49ca082a9cae66518e7ec3001d"},{url:"/icon/apple-icon.png",revision:"c10be233442b033c3baa4f31e6eef497"},{url:"/icon/favicon-16x16.png",revision:"952fbef9e49beeef1245348e8acd3e10"},{url:"/icon/favicon-32x32.png",revision:"cc1959023eac2285f50a95dfc195fd43"},{url:"/icon/favicon-96x96.png",revision:"649e5a6cc785e349423f30f6a764e3cc"},{url:"/icon/favicon.ico",revision:"58520771ef07cd797e9a2cd18be46b7e"},{url:"/icon/icon-192x192.png",revision:"ffe35ac0b125f85ec7b1d74d23caa3ba"},{url:"/icon/icon-256x256.png",revision:"62f797538fd3fcac245d502c75838a12"},{url:"/icon/icon-384x384.png",revision:"3aec6eb3ba380ed656d40c98422123e5"},{url:"/icon/icon-512x512.png",revision:"f98c29d55f89b03a8aa291e5a0ece3b6"},{url:"/icon/ms-icon-144x144.png",revision:"c8f5b365248975f92e3eefdb83815f19"},{url:"/icon/ms-icon-150x150.png",revision:"0905474dfe1192f356dc3707ecaa3fc5"},{url:"/icon/ms-icon-310x310.png",revision:"417725d09923c07842dbdc2873856332"},{url:"/icon/ms-icon-70x70.png",revision:"42f0fcff3a90987a1870478a1644d54c"},{url:"/img/monophy.gif",revision:"37fc2d460c2ab5ce225e15fb29959ac7"},{url:"/manifest.json",revision:"8cb1de4227286c6bc90e43d4926e087c"},{url:"/trees/index.html",revision:"104039449906656e3b4f521d25236fc7"},{url:"/trees/src/css/style.css",revision:"ee9778e17218c00ac20455895397adfe"},{url:"/trees/src/img/cloud.gif",revision:"bfe124083f3acdfb46569a38a83b6bf2"},{url:"/trees/src/js/app.js",revision:"bd364790539ab88a2b2ce8a432cbf07c"},{url:"/trees/src/js/branch.js",revision:"b861ff499f1e76fe4a40c4caacf16e02"},{url:"/trees/src/js/space.js",revision:"054e7e6a1193cd8c2e4b6611eb66a321"},{url:"/trees/src/js/tree.js",revision:"eaa9f0fdf93654790a2981982b1bd182"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:c})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
=======
/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-9a8b0a38'], (function (workbox) { 'use strict';

  /**
  * Welcome to your Workbox-powered service worker!
  *
  * You'll need to register this file in your web app.
  * See https://goo.gl/nhQhGp
  *
  * The rest of the code is auto-generated. Please don't update this file
  * directly; instead, make changes to your Workbox build configuration
  * and re-run your build process.
  * See https://goo.gl/2aRDsh
  */

  importScripts();
  self.skipWaiting();
  workbox.clientsClaim();
  workbox.registerRoute("/", new workbox.NetworkFirst({
    "cacheName": "start-url",
    plugins: [{
      cacheWillUpdate: async ({
        request,
        response,
        event,
        state
      }) => {
        if (response && response.type === 'opaqueredirect') {
          return new Response(response.body, {
            status: 200,
            statusText: 'OK',
            headers: response.headers
          });
        }

        return response;
      }
    }]
  }), 'GET');
  workbox.registerRoute(/.*/i, new workbox.NetworkOnly({
    "cacheName": "dev",
    plugins: []
  }), 'GET');

}));
//# sourceMappingURL=sw.js.map
>>>>>>> develop
