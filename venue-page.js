/* Orcha Events venue page
   Usage in a Squarespace Code block:
     <div id="venue-page" data-venue="oneills"></div>
     <script>
     fetch('https://raw.githubusercontent.com/conorclmurphy/Orcha-code/main/venue-page.js', {cache: 'no-cache'})
       .then(function (r) { return r.text(); })
       .then(function (t) { var s = document.createElement('script'); s.textContent = t; document.body.appendChild(s); });
     </script>
   Loading straight from GitHub means updates show on the site within about 5 minutes.
   Change data-venue to the venue's "slug" from venues.json.
   The page is dark by default; add data-theme="light" to the div for the light sand version. */
(function () {
  var DATA_URL = 'https://raw.githubusercontent.com/conorclmurphy/Orcha-code/main/venues-orcha.json';
  var HLS_URL = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.13/dist/hls.min.js';
  var FORM_URL = 'https://api.web3forms.com/submit';
  var root = document.getElementById('venue-page');
  if (!root) return;

  // Paint the whole page section black so there's no patterned or lighter band around this page
  (function () {
    var sec = root.closest('section');
    if (!sec) return;
    sec.style.backgroundColor = '#212e21';
    var sb = sec.querySelector('.section-background');
    if (sb) { sb.style.backgroundColor = '#212e21'; Array.prototype.forEach.call(sb.children, function (c) { c.style.opacity = '0'; }); }
  })();
  var slug = (root.getAttribute('data-venue') || '').trim().toLowerCase();

  var FOOD = { casual: 'Casual dining', sitdown: 'Sit-down dining', both: 'Sit-down or casual' };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // First sentence for the hero, skipping full stops after initials like "J.R." or "J.L."
  function firstSentence(t) {
    t = String(t); var re = /[.!?](\s|$)/g, m;
    while ((m = re.exec(t))) { if (!/(^|[\s.])[A-Z]$/.test(t.slice(0, m.index))) return t.slice(0, m.index + 1); }
    return t;
  }

  // Fonts and styles, scoped to #venue-page so they don't affect the rest of the site.
  if (!document.getElementById('vp-fonts')) {
    var f = document.createElement('link');
    f.id = 'vp-fonts'; f.rel = 'stylesheet';
    f.href = 'https://fonts.googleapis.com/css2?family=Sansita:wght@400;700&family=Nunito+Sans:wght@400;600;700&display=swap';
    document.head.appendChild(f);
  }
  var css = '\
#venue-page{--vp-radius:14px;--vp-radius-sm:10px;--vp-bg:#212e21;--vp-surface:#2c3b2c;--vp-ink:#f4f3e8;--vp-muted:#c4c3b2;--vp-line:#3d503d;--vp-bottle:#182218;--vp-brass:#ebfc72;--vp-accent-text:#ebfc72;--vp-on-dark:#f4f3e8;\
--vp-display:"Sansita",Georgia,serif;--vp-body:"Nunito Sans",Arial,sans-serif;\
background:var(--vp-bg);color:var(--vp-ink);font-family:var(--vp-body);font-size:16px;line-height:1.65;font-weight:400;text-align:left}\
#venue-page[data-theme="light"]{--vp-bg:#f4f3e8;--vp-surface:#f7f6ec;--vp-ink:#212e21;--vp-muted:#4f5e4f;--vp-line:#dcdbc9;--vp-bottle:#212e21;--vp-accent-text:#1b7f7a}\
#venue-page *{box-sizing:border-box}\
#venue-page h1,#venue-page h2,#venue-page h3{font-family:var(--vp-display);font-weight:400;letter-spacing:-.01em;text-transform:none;color:inherit;text-wrap:balance}\
#venue-page p{margin:0}\
#venue-page .vp-pad{padding-left:max(16px,4vw);padding-right:max(16px,4vw)}\
#venue-page .vp-hero{position:relative;z-index:0;min-height:min(70vh,600px);display:flex;align-items:flex-end;color:var(--vp-on-dark);background:#212e21;overflow:hidden}\
#venue-page .vp-hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;max-width:none}\
#venue-page .vp-hero:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 35%,rgba(0,0,0,.85) 100%)}\
#venue-page .vp-hero:before{content:"";position:absolute;left:0;right:0;top:0;height:35%;z-index:1;pointer-events:none;background:linear-gradient(180deg,rgba(24,34,24,.6) 0%,rgba(24,34,24,0) 100%)}\
#venue-page .vp-hero-in{position:relative;z-index:1;width:100%;padding-top:48px;padding-bottom:40px}\
#venue-page .vp-eyebrow{font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:500}\
#venue-page .vp-hero h1{font-size:clamp(40px,7vw,76px);line-height:1.02;margin:10px 0 12px;color:var(--vp-on-dark)}\
#venue-page .vp-lede{max-width:56ch;font-size:18px;opacity:.92}\
#venue-page .vp-facts{background:var(--vp-bottle);color:var(--vp-on-dark);display:flex;flex-wrap:wrap;gap:20px 40px;align-items:center;padding-top:22px;padding-bottom:22px}\
#venue-page .vp-fact span{display:block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;opacity:.75}\
#venue-page .vp-fact strong{font-family:var(--vp-display);font-weight:400;font-size:24px;color:var(--vp-brass)}\
#venue-page .vp-btn{display:inline-block;margin-left:auto;text-decoration:none;font-weight:500;letter-spacing:.04em;padding:14px 26px;border-radius:999px;background:var(--vp-brass);color:#212e21;border:0}\
#venue-page .vp-btn:focus-visible,#venue-page button:focus-visible{outline:2px solid var(--vp-brass);outline-offset:3px}\
#venue-page .vp-body{display:grid;grid-template-columns:minmax(0,1fr) clamp(340px,26vw,400px);gap:clamp(40px,4vw,72px);align-items:start;max-width:none;margin:0;padding-top:72px;padding-bottom:72px}\
#venue-page .vp-main{display:grid;gap:72px;min-width:0;container-type:inline-size}\
#venue-page .vp-aside{position:sticky;top:var(--vp-sticky-top,24px);min-width:0}\
#venue-page .vp-main h2{font-size:clamp(28px,4vw,40px);margin:0 0 20px;color:var(--vp-ink)}\
#venue-page .vp-about p{font-size:20px;max-width:62ch}\
#venue-page .vp-split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:24px 48px;align-items:start}\
#venue-page .vp-space{display:grid;grid-template-columns:minmax(0,1fr);gap:24px 48px;padding:36px 0;border-bottom:1px solid var(--vp-line);align-items:center}\
#venue-page .vp-space.vp-has-video{grid-template-columns:minmax(0,1fr) minmax(0,1.15fr)}\
#venue-page .vp-space{align-items:start}\
#venue-page .vp-space-text{display:grid;gap:10px;min-width:0}\
#venue-page .vp-spaces{border-top:1px solid var(--vp-line)}\
#venue-page .vp-space h3{font-size:24px;margin:0}\
#venue-page .vp-cap{color:var(--vp-accent-text);font-size:14px;font-weight:500}\
#venue-page .vp-space p{color:var(--vp-muted);max-width:62ch}\
#venue-page .vp-capnote{margin-top:20px;font-weight:500;color:var(--vp-accent-text)}\
#venue-page .vp-gallery{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}\
#venue-page .vp-gallery button{padding:0;border:0;background:var(--vp-line);cursor:zoom-in;aspect-ratio:4/3;overflow:hidden;border-radius:var(--vp-radius-sm)}\
#venue-page .vp-gallery img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s}\
#venue-page .vp-gallery button:hover img{transform:scale(1.04)}\
#venue-page .vp-space-gallery{grid-column:1/-1;min-width:0}\
#venue-page .vp-gallery.vp-g6{grid-template-columns:repeat(3,minmax(0,1fr))}\
#venue-page .vp-more{margin-top:16px;font:inherit;font-weight:500;background:none;border:1px solid var(--vp-ink);border-radius:999px;color:var(--vp-ink);padding:10px 18px;cursor:pointer}\
#venue-page .vp-video{margin:0;display:grid;gap:8px;min-width:0}\
#venue-page .vp-vwrap{position:relative}\
#venue-page .vp-video video{width:100%;aspect-ratio:16/9;background:#182218;display:block;object-fit:cover;border-radius:var(--vp-radius);overflow:hidden}\
#venue-page .vp-play{position:absolute;inset:0;margin:auto;width:76px;height:76px;border-radius:50%;border:0;padding:0;background:var(--vp-brass);color:#212e21;display:grid;place-items:center;cursor:pointer;box-shadow:0 6px 24px rgba(0,0,0,.35);transition:transform .15s}\
#venue-page .vp-play:hover{transform:scale(1.08)}\
#venue-page .vp-play svg{width:28px;height:28px;margin-left:4px}\
#venue-page .vp-vwrap.vp-playing .vp-play{display:none}\
#venue-page .vp-video figcaption{font-size:13px;color:var(--vp-muted)}\
#venue-page .vp-loc p{margin-bottom:12px;color:var(--vp-muted)}\
#venue-page .vp-similar{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}\
#venue-page .vp-card{display:grid;gap:10px;text-decoration:none;color:inherit;min-width:0}\
#venue-page .vp-card-img{aspect-ratio:4/3;border-radius:var(--vp-radius);overflow:hidden;background:var(--vp-line)}\
#venue-page .vp-similar .vp-card-img{position:relative}#venue-page .vp-similar .vp-card-img:after{content:"";position:absolute;right:8px;bottom:8px;width:30px;height:31px;background:url(data:image/png;base64,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) center/contain no-repeat;opacity:.9;filter:drop-shadow(0 1px 3px rgba(0,0,0,.6));pointer-events:none;z-index:2}\
#venue-page .vp-card-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s}\
#venue-page .vp-card:hover .vp-card-img img{transform:scale(1.04)}\
#venue-page .vp-card h3{font-size:22px;margin:0}\
#venue-page .vp-card p{margin:0;color:var(--vp-muted);font-size:14px}\
#venue-page .vp-card .vp-cap{margin-top:-4px}\
#venue-page .vp-card:focus-visible{outline:2px solid var(--vp-brass);outline-offset:4px;border-radius:var(--vp-radius)}\
@container (max-width:460px){#venue-page .vp-similar{grid-template-columns:1fr}}\
#venue-page .vp-loc a{color:var(--vp-accent-text);font-weight:500}\
#venue-page .vp-map{width:100%;max-width:640px;height:300px;border:1px solid var(--vp-line);border-radius:var(--vp-radius);display:block;margin-bottom:12px;background:var(--vp-line)}\
#venue-page .vp-form{background:var(--vp-surface);border:1px solid var(--vp-line);border-radius:20px;padding:20px 22px;display:grid;gap:9px;scroll-margin-top:24px}\
#venue-page .vp-form h2{font-size:22px;margin:0 0 2px}\
#venue-page .vp-form .vp-sub{color:var(--vp-muted);font-size:14px;margin-top:-6px}\
#venue-page .vp-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}\
#venue-page .vp-field{display:grid;gap:4px;min-width:0}\
#venue-page .vp-field label{font-size:12.5px;font-weight:500;color:var(--vp-ink)}\
#venue-page .vp-field label i{font-style:normal;color:var(--vp-muted);font-weight:400}\
#venue-page .vp-field input,#venue-page .vp-field select,#venue-page .vp-field textarea{font:inherit;font-size:15px;width:100%;padding:7px 13px;border:1px solid var(--vp-line);border-radius:var(--vp-radius-sm);background:var(--vp-bg);color:var(--vp-ink);color-scheme:dark}\
#venue-page[data-theme="light"] .vp-field input,#venue-page[data-theme="light"] .vp-field select,#venue-page[data-theme="light"] .vp-field textarea{color-scheme:light}\
#venue-page .vp-field textarea{min-height:58px;resize:vertical}\
#venue-page .vp-field input,#venue-page .vp-field select{display:block;height:40px;min-height:40px;line-height:22px;margin:0;-webkit-appearance:none;-moz-appearance:none;appearance:none}\
#venue-page .vp-field input[type=date]{text-align:left;min-width:0}\
#venue-page .vp-field input[type=date]::-webkit-date-and-time-value{text-align:left;margin:0}\
#venue-page .vp-field input[type=date]::-webkit-datetime-edit{padding:0;line-height:22px}\
#venue-page .vp-field input[type=date]::-webkit-calendar-picker-indicator{opacity:.7;cursor:pointer;filter:invert(1)}\
#venue-page[data-theme="light"] .vp-field input[type=date]::-webkit-calendar-picker-indicator{filter:none}\
#venue-page .vp-field select{padding-right:36px;cursor:pointer;background-repeat:no-repeat;background-position:right 13px center;background-size:12px;background-image:url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 12 8%27%3E%3Cpath d=%27M1 1l5 5 5-5%27 fill=%27none%27 stroke=%27%23ebfc72%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E")}\
#venue-page .vp-field input:focus,#venue-page .vp-field select:focus,#venue-page .vp-field textarea:focus{outline:2px solid var(--vp-brass);outline-offset:0;border-color:transparent}\
#venue-page .vp-form .vp-btn{padding-top:12px;padding-bottom:12px;margin:4px 0 0;width:100%;font:inherit;font-weight:500;cursor:pointer}\
#venue-page .vp-form .vp-btn[disabled]{opacity:.6;cursor:wait}\
#venue-page .vp-status{font-size:14px;margin:0}\
#venue-page .vp-status a{color:inherit;text-decoration:underline}\
#venue-page .vp-status.vp-err{color:#f0a48c}\
#venue-page .vp-done{display:grid;gap:8px}\
#venue-page .vp-done h2{color:var(--vp-brass)}\
#venue-page .vp-hp{position:absolute!important;left:-9999px!important;width:1px;height:1px;overflow:hidden}@media (min-width:1001px){#venue-page .vp-aside .vp-form{max-height:calc(100vh - 48px);overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:rgba(235,252,114,.5) transparent}}@keyframes vpField{0%{box-shadow:0 0 0 0 rgba(235,252,114,0);background-color:inherit}30%{box-shadow:0 0 0 3px rgba(235,252,114,.7);background-color:rgba(235,252,114,.22)}100%{box-shadow:0 0 0 0 rgba(235,252,114,0)}}#venue-page .vp-form .vp-flashfield{animation:vpField 1.3s ease-out;border-color:var(--vp-brass)!important}#venue-page .vp-elist{border:1px dashed rgba(235,252,114,.5);background:rgba(235,252,114,.07);border-radius:14px;padding:10px 14px;margin:2px 0 6px}#venue-page .vp-elist[hidden]{display:none}#venue-page .vp-elist-t{display:block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--vp-brass);margin-bottom:6px}#venue-page .vp-elist ul{list-style:none;margin:0;padding:0;display:grid;gap:6px}#venue-page .vp-elist li{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;font-size:14px;color:var(--vp-on-dark);line-height:1.35}#venue-page .vp-elist li button{font:inherit;background:none;border:0;color:var(--vp-muted);cursor:pointer;padding:0 2px;font-size:13px}#venue-page .vp-add{font:inherit;cursor:pointer;width:100%;margin:0;padding:11px 18px;font-size:15px;text-align:center;background:transparent;color:var(--vp-brass);border:1.5px solid var(--vp-brass);border-radius:999px}#venue-page .vp-add-note{margin:0;font-size:13px;color:var(--vp-muted);line-height:1.45}#venue-page .vp-add-note a{color:var(--vp-brass)}#venue-page .vp-add-note[hidden]{display:none}\
@container (max-width:640px){#venue-page .vp-space.vp-has-video,#venue-page .vp-split{grid-template-columns:1fr}}\
#venue-page .vp-sheet-bar{display:none}\
@media (max-width:1000px){\
#venue-page .vp-body{grid-template-columns:1fr;padding-bottom:110px}\
#venue-page .vp-aside{position:fixed;left:0;right:0;bottom:0;top:auto;z-index:9998;pointer-events:none;padding:0 max(12px,env(safe-area-inset-right,0px)) calc(12px + env(safe-area-inset-bottom,0px)) max(12px,env(safe-area-inset-left,0px))}\
#venue-page .vp-sheet{pointer-events:auto;max-width:560px;margin:0 auto;display:flex;flex-direction:column;border-radius:20px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,.4)}\
#venue-page .vp-sheet-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;padding:15px 22px;border:0;border-radius:999px;background:var(--vp-brass);color:#212e21;font:inherit;font-weight:600;font-size:16px;cursor:pointer;text-align:left}\
#venue-page .vp-sheet-bar svg{width:20px;height:20px;flex:none;transition:transform .2s}\
#venue-page .vp-sheet .vp-form{display:none}\
#venue-page .vp-open .vp-sheet{background:var(--vp-surface);border:1px solid var(--vp-line);max-height:calc(100vh - var(--vp-sheet-top,24px) - 12px);max-height:calc(100dvh - var(--vp-sheet-top,24px) - 12px)}\
#venue-page .vp-open .vp-sheet-bar{border-radius:0;background:var(--vp-surface);color:var(--vp-ink);border-bottom:1px solid var(--vp-line);font-family:var(--vp-display);font-weight:400;font-size:20px}\
#venue-page .vp-open .vp-sheet-bar svg{transform:rotate(180deg);color:var(--vp-brass)}\
#venue-page .vp-open .vp-sheet .vp-form{display:grid;border:0;border-radius:0;overflow-y:auto;overscroll-behavior:contain}\
#venue-page .vp-sheet .vp-form h2{display:none}\
#venue-page .vp-aside:not(.vp-open) .vp-sheet{max-width:230px;transition:max-width .25s;overflow:visible;box-shadow:none}#venue-page .vp-aside:not(.vp-open) .vp-sheet-bar{padding:11px 18px;font-size:15px;justify-content:center;gap:8px;background:#182218;color:var(--vp-brass);border:1.5px solid var(--vp-brass);animation:vpTempt 2.8s ease-in-out infinite}#venue-page .vp-aside:not(.vp-open) .vp-sheet-bar svg{color:var(--vp-brass)}#venue-page .vp-aside:not(.vp-open) .vp-sheet-bar.vp-pulse{animation:vpPulse .9s ease-out 2}#venue-page .vp-aside:not(.vp-open) .vp-sheet:has(.vp-bar-msg){max-width:340px}@keyframes vpTempt{0%,100%{box-shadow:0 6px 20px rgba(0,0,0,.45),0 0 0 0 rgba(235,252,114,.45)}50%{box-shadow:0 6px 20px rgba(0,0,0,.45),0 0 0 9px rgba(235,252,114,0)}}@media (prefers-reduced-motion:reduce){#venue-page .vp-aside:not(.vp-open) .vp-sheet-bar{animation:none}}\
}\
#venue-page .vp-lb{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.96);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:16px}\
#venue-page .vp-lb[hidden]{display:none}\
#venue-page .vp-slider{position:relative;border-radius:var(--vp-radius);overflow:hidden;background:#182218}\
#venue-page .vp-sl-track{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;-webkit-overflow-scrolling:touch}\
#venue-page .vp-sl-track::-webkit-scrollbar{display:none}\
#venue-page .vp-sl-slide{position:relative;flex:0 0 100%;scroll-snap-align:start;aspect-ratio:16/10;padding:0;border:0;background:#182218;cursor:zoom-in}\
@media (min-width:900px){#venue-page .vp-sl-track{gap:8px}#venue-page .vp-sl-slide{flex:0 0 calc((100% - 16px) / 3);aspect-ratio:4/3;border-radius:var(--vp-radius-sm,10px);overflow:hidden}#venue-page .vp-slider{background:none}}\
#venue-page .vp-sl-slide>img:first-child{width:100%;height:100%;object-fit:cover;display:block}\
#venue-page .vp-sl-slide .vp-wm{width:40px!important;right:12px;bottom:12px}\
#venue-page .vp-sl-arr,#venue-page .vp-lb-arr{position:absolute;top:50%;transform:translateY(-50%);z-index:2;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;cursor:pointer;color:#f4f3e8;background:rgba(0,0,0,.45);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border:1px solid rgba(244,243,232,.35);transition:opacity .2s,background .2s}\
#venue-page .vp-sl-arr svg,#venue-page .vp-lb-arr svg{width:22px;height:22px}\
#venue-page .vp-sl-arr:hover,#venue-page .vp-lb-arr:hover{background:rgba(235,252,114,.45);border-color:#ebfc72}\
#venue-page .vp-sl-arr:disabled{opacity:0;pointer-events:none}\
#venue-page .vp-sl-prev{left:12px}#venue-page .vp-sl-next{right:12px}\
#venue-page .vp-sl-count{position:absolute;left:12px;bottom:12px;z-index:2;padding:4px 10px;border-radius:999px;font-size:12px;color:#f4f3e8;background:rgba(0,0,0,.55);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);pointer-events:none}\
#venue-page .vp-lb{flex-direction:row}\
#venue-page .vp-lb-prev{left:18px}#venue-page .vp-lb-next{right:18px}\
#venue-page .vp-lb-arr{width:52px;height:52px}\
#venue-page .vp-lb.vp-lb-one .vp-lb-arr{display:none}\
#venue-page .vp-lb-x{position:absolute;top:16px;right:18px;z-index:2;width:44px;height:44px;border-radius:50%;border:0;background:rgba(244,243,232,.12);color:#f4f3e8;font-size:26px;line-height:1;cursor:pointer}\
#venue-page .vp-lb .vp-count{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);color:#f4f3e8;font-size:14px;opacity:.8}\
#venue-page .vp-lb-pic>img:first-child{max-height:84vh;max-width:calc(100vw - 150px)}\
@media (max-width:640px){#venue-page .vp-sl-arr{width:36px;height:36px}#venue-page .vp-sl-arr svg{width:18px;height:18px}#venue-page .vp-lb-pic>img:first-child{max-width:100%;max-height:80vh}#venue-page .vp-lb-arr{width:40px;height:40px;background:rgba(0,0,0,.6)}#venue-page .vp-lb-prev{left:8px}#venue-page .vp-lb-next{right:8px}}\
#venue-page .vp-lb-pic{position:relative;display:inline-block;max-width:100%;line-height:0}\
#venue-page .vp-lb-pic>img:first-child{max-height:78vh;max-width:100%;object-fit:contain;border-radius:var(--vp-radius)}\
#venue-page .vp-gallery button{position:relative}\
#venue-page .vp-wm{position:absolute;right:6px;bottom:6px;width:30px!important;height:auto!important;object-fit:contain!important;opacity:.85;filter:drop-shadow(0 1px 3px rgba(0,0,0,.6));pointer-events:none;transform:none!important}\
#venue-page .vp-lb-pic .vp-wm{width:60px!important;right:12px;bottom:12px}\
#venue-page .vp-lb-bar{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;align-items:center;color:var(--vp-on-dark)}\
#venue-page .vp-lb-bar button{font:inherit;border-radius:999px;background:none;border:1px solid rgba(244,243,232,.4);color:var(--vp-on-dark);padding:8px 14px;cursor:pointer}\
#venue-page .vp-msg{padding:40px 16px;color:var(--vp-muted)}\
@media (max-width:760px){#venue-page .vp-space.vp-has-video,#venue-page .vp-split{grid-template-columns:1fr}}\
@media (max-width:640px){#venue-page .vp-gallery,#venue-page .vp-gallery.vp-g6{grid-template-columns:repeat(2,minmax(0,1fr))}#venue-page .vp-play{width:60px;height:60px}#venue-page .vp-row{gap:10px}#venue-page .vp-main{gap:56px}#venue-page .vp-body{padding-top:52px;padding-bottom:52px;gap:56px}#venue-page .vp-btn{margin-left:0}}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  var keyHandler = null;

  function load() {
    slug = (root.getAttribute('data-venue') || '').trim().toLowerCase();
    root.innerHTML = '<style>@keyframes wd2Shim{0%{background-position:-400px 0}100%{background-position:400px 0}}.wd2-sk{background:#2c3b2c linear-gradient(90deg,rgba(244,243,232,0) 0,rgba(244,243,232,.07) 50%,rgba(244,243,232,0) 100%) no-repeat;background-size:400px 100%;animation:wd2Shim 1.3s ease-in-out infinite;border-radius:14px}@media (prefers-reduced-motion:reduce){.wd2-sk{animation:none}}</style><div style="background:#212e21;padding:0 0 40px"><div class="wd2-sk" style="height:min(62vh,560px);border-radius:0"></div><div style="max-width:1100px;margin:0 auto;padding:28px clamp(16px,4vw,48px);display:grid;gap:12px"><div class="wd2-sk" style="height:34px;width:min(320px,70%)"></div><div class="wd2-sk" style="height:14px;width:min(620px,95%)"></div><div class="wd2-sk" style="height:14px;width:min(540px,85%)"></div><div class="wd2-sk" style="height:14px;width:min(460px,75%)"></div></div></div>';
    // A preview page can supply the data directly; the live site fetches it from GitHub.
    var getData = window.WD2_VENUES ? Promise.resolve(window.WD2_VENUES)
      : fetch(DATA_URL, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
    getData
      .then(function (DATA) {
        var v = null;
        for (var i = 0; i < DATA.venues.length; i++) if (DATA.venues[i].slug === slug) v = DATA.venues[i];
        if (!v) { root.innerHTML = '<div class="vp-msg">No venue called "' + esc(slug) + '" in venues.json. Check the data-venue name in this code block.</div>'; return; }
        render(DATA, v);
      })
      .catch(function () {
        root.innerHTML = '<div class="vp-msg">Venue details could not be loaded. Please refresh the page.</div>';
      });
  }
  window.WD2VenuePageReload = load;
  load();

  function render(DATA, v) {
    var img = function (p, w) { return /^https?:/.test(p) ? p : DATA.imageBase + p + '?format=' + w + 'w'; };  // full web addresses are used as they are
    var sets = [];  // each photo set (a room's gallery, or the venue's) gets its own viewer
    var rooms = v.rooms || [];
    var vids = v.videos || [];
    var enq = DATA.enquireUrl;
    var area = v.area || ('Co. ' + v.county);

    var facts = [['Guests', 'Up to ' + v.capacity], ['Food', FOOD[v.foodStyle] || 'Ask the venue']];
    if (rooms.length) facts.push(['Private spaces', String(rooms.length)]);

    var h = '';
    h += '<header class="vp-hero"><img src="' + img(v.heroImg || v.cardImg, 2500) + '" alt="' + esc(v.name) + '">';
    h += '<div class="vp-hero-in vp-pad"><div class="vp-eyebrow">' + esc(area) + ' · Co. ' + esc(v.county) + '</div>';
    h += '<h1>' + esc(v.name) + '</h1><p class="vp-lede">' + esc(firstSentence(v.intro)) + '</p></div></header>';

    h += '<div class="vp-facts vp-pad">';
    facts.forEach(function (f) { h += '<div class="vp-fact"><span>' + f[0] + '</span><strong>' + esc(f[1]) + '</strong></div>'; });
    h += '<a class="vp-btn" href="#vp-enquire">Get a quote</a></div>';

    var allVideos = [];
    function videoTag(x, label) {
      var mm = Math.floor(x.seconds / 60) + ':' + ('0' + (x.seconds % 60)).slice(-2);
      allVideos.push(x);
      return '<figure class="vp-video"><div class="vp-vwrap"><video data-v="' + (allVideos.length - 1) + '" playsinline preload="none" poster="' + (x.base || DATA.videoBase) + x.id + '/thumbnail" aria-label="Walk-around video of ' + esc(label) + '"></video>'
        + '<button type="button" class="vp-play" aria-label="Play walk-around of ' + esc(label) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 4l15 8-15 8z"/></svg></button></div><figcaption>Walk-around of ' + esc(label) + ' · ' + mm + '</figcaption></figure>';
    }

    var ARW_L = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var ARW_R = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    // Small Orcha Events logo in the bottom corner of every gallery photo
    var WM_TAG = '<img class="vp-wm" src="data:image/png;base64,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" alt="" aria-hidden="true" loading="lazy" onerror="this.remove()">';

    function galleryTag(list, label) {
      if (!list || !list.length) return '';
      // Swipeable slider: one big photo at a time, arrows either side, tap to open full screen
      var si = sets.push(list) - 1, n = list.length;
      var g = '<div class="vp-slider" data-set="' + si + '"><div class="vp-sl-track">';
      list.forEach(function (p, i) {
        g += '<button type="button" class="vp-sl-slide" data-set="' + si + '" data-i="' + i + '" aria-label="Open photo ' + (i + 1) + ' of ' + n + ' of ' + esc(label) + '"><img src="' + img(p, 1000) + '" alt="' + esc(label) + ' photo ' + (i + 1) + '"' + (i > 1 ? ' loading="lazy"' : '') + ' decoding="async">' + WM_TAG + '</button>';
      });
      g += '</div>';
      if (n > 1) g += '<button type="button" class="vp-sl-arr vp-sl-prev" aria-label="Previous photo">' + ARW_L + '</button><button type="button" class="vp-sl-arr vp-sl-next" aria-label="Next photo">' + ARW_R + '</button><span class="vp-sl-count">1 / ' + n + '</span>';
      g += '</div>';
      return g;
    }

    h += '<div class="vp-body vp-pad"><div class="vp-main">';
    // The header already shows the first sentence, so "About the venue" only shows what comes after it
    var aboutText = v.intro ? String(v.intro).slice(firstSentence(v.intro).length).trim() : '';
    if (v.intro && (aboutText || vids.length)) {
      var aboutP = aboutText ? '<p>' + esc(aboutText) + '</p>' : '';
      if (vids.length) h += '<section class="vp-about vp-split"><div><h2>About the venue</h2>' + aboutP + '</div>' + videoTag(vids[0], v.name) + '</section>';
      else h += '<section class="vp-about"><h2>About the venue</h2>' + aboutP + '</section>';
    }

    if (rooms.length) {
      h += '<section><h2>The spaces</h2><div class="vp-spaces">';
      rooms.forEach(function (r) {
        h += '<div class="vp-space' + (r.video ? ' vp-has-video' : '') + '"><div class="vp-space-text"><h3>' + esc(r.name) + '</h3>'
          + (r.capacity ? '<div class="vp-cap">' + esc(r.capacity) + '</div>' : '')
          + '<p>' + esc(r.description) + '</p></div>'
          + (r.video ? videoTag(r.video, r.name) : '')
          + (r.gallery && r.gallery.length ? '<div class="vp-space-gallery">' + galleryTag(r.gallery, r.name) + '</div>' : '') + '</div>';
      });
      h += '</div>' + (v.capacityNote ? '<p class="vp-capnote">' + esc(v.capacityNote) + '</p>' : '') + '</section>';
    }

    if (v.gallery && v.gallery.length) h += '<section><h2>Gallery</h2>' + galleryTag(v.gallery, v.name) + '</section>';

    var q = encodeURIComponent(v.mapQuery || (v.name + ', ' + (v.area || '') + ', ' + v.county));
    h += '<section class="vp-loc"><h2>Location</h2><p>' + esc(v.name) + ', ' + esc(area) + '</p>';
    h += '<iframe class="vp-map" title="Map showing ' + esc(v.name) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=' + q + '&z=15&output=embed"></iframe>';
    h += '</section>';

    // Similar venues: two other live venues, closest in guest numbers, same food style first.
    // Venues this visitor has already opened go to the back of the queue
    var seenV = [];
    try { seenV = JSON.parse(localStorage.getItem('orchaSeenVenues') || '[]'); } catch (e) {}
    if (seenV.indexOf(v.slug) === -1) seenV.push(v.slug);
    try { localStorage.setItem('orchaSeenVenues', JSON.stringify(seenV)); } catch (e) {}
    var others = DATA.venues.filter(function (o) { return o.live && o.url && o.slug !== v.slug; });
    others.sort(function (a, b) {
      var da = Math.abs(a.capacity - v.capacity) + (a.foodStyle === v.foodStyle ? 0 : 60) + (seenV.indexOf(a.slug) !== -1 ? 100000 : 0);
      var db = Math.abs(b.capacity - v.capacity) + (b.foodStyle === v.foodStyle ? 0 : 60) + (seenV.indexOf(b.slug) !== -1 ? 100000 : 0);
      return da - db;
    });
    others = others.slice(0, 2);
    if (others.length) {
      h += '<section><h2>Similar venues</h2><div class="vp-similar">';
      others.forEach(function (o) {
        h += '<a class="vp-card" href="' + esc(o.url) + '"><div class="vp-card-img"><img loading="lazy" src="' + img(o.heroImg || o.cardImg, 750) + '" alt="' + esc(o.name) + '"></div>'
          + '<h3>' + esc(o.name) + '</h3><p>' + esc(o.area || ('Co. ' + o.county)) + '</p><div class="vp-cap">Up to ' + esc(o.capacity) + ' guests</div></a>';
      });
      h += '</div></section>';
    }

    h += '</div>';  // end of main column

    // Enquiry form: stays in view beside the content on wide screens, sits at the end on phones.
    var today = new Date(); today = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    h += '<aside class="vp-aside"><div class="vp-sheet">'
      + '<button type="button" class="vp-sheet-bar" aria-expanded="false" aria-controls="vp-enquire"><span>Enquire about ' + esc(v.name) + '</span>'
      + '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" d="M6 15l6-6 6 6"/></svg></button>'
      + '<form class="vp-form" id="vp-enquire" novalidate>'
      + '<h2>Enquire about ' + esc(v.name) + '</h2>'
      + '<div class="vp-elist" hidden><span class="vp-elist-t">Also in your enquiry</span><ul></ul></div>'
      + '<div class="vp-row"><div class="vp-field"><label for="vp-fname">First name</label><input id="vp-fname" name="First name" autocomplete="given-name" required></div>'
      + '<div class="vp-field"><label for="vp-lname">Last name</label><input id="vp-lname" name="Last name" autocomplete="family-name" required></div></div>'
      + '<div class="vp-field"><label for="vp-email">Email</label><input id="vp-email" name="email" type="email" autocomplete="email" required></div>'
      + '<div class="vp-field"><label for="vp-date">Event date <i>(optional)</i></label><input id="vp-date" name="Event date" type="date" min="' + today + '"></div>'
      + '<div class="vp-field"><label for="vp-venue">Venue(s) you are interested in</label><input id="vp-venue" name="Venue" value="' + esc(v.name) + '"></div>'
      + '<div class="vp-field"><label for="vp-music">Interested in our live music or karaoke options?</label><select id="vp-music" name="Live music / karaoke"><option value="">Select an option</option><option>Yes</option><option>No</option></select></div>'
      + '<div class="vp-field"><label for="vp-heard">How did you hear about us?</label><select id="vp-heard" name="How they heard about us"><option value="">Select an option</option><option>Instagram</option><option>Google Search</option><option>Musician referral</option><option>Friends or family</option><option>Other</option></select></div>'
      + '<div class="vp-field"><label for="vp-msg">Let us know how we can help <i>(optional)</i></label><textarea id="vp-msg" name="Message" placeholder="Guest numbers, questions, anything else"></textarea></div>'
      + '<input type="checkbox" name="botcheck" class="vp-hp" tabindex="-1" autocomplete="off" aria-hidden="true">'
      + '<button class="vp-btn" type="submit">Send enquiry</button><button type="button" class="vp-btn vp-btn-ghost vp-add">+ Add to my enquiry and keep browsing</button><p class="vp-add-note" hidden></p><p class="vp-status" role="status" aria-live="polite"></p>'
      + '</form></div></aside>';
    h += '</div>';  // end of body

    h += '<div class="vp-lb" hidden><button type="button" class="vp-lb-x" data-a="close" aria-label="Close">&times;</button><button type="button" class="vp-lb-arr vp-lb-prev" data-a="prev" aria-label="Previous photo">' + ARW_L + '</button><div class="vp-lb-pic"><img alt="">' + WM_TAG + '</div><button type="button" class="vp-lb-arr vp-lb-next" data-a="next" aria-label="Next photo">' + ARW_R + '</button><span class="vp-count"></span></div>';

    // The site's photo-link script turns a whole block into a link when it spots a known photo in it.
    // Mark this block as already handled so clicks inside it work normally.
    for (var blk = root; blk && blk !== document.body; blk = blk.parentElement) {
      if (blk.classList && blk.classList.contains('sqs-block')) { blk.wd2Wired = true; break; }
    }
    root.innerHTML = h;

    // Slide the main photo up to the very top of the page, underneath the site's see-through header.
    var hero = root.querySelector('.vp-hero');
    function pullUp() {
      // Squarespace code blocks hide anything outside them; let the banner show above the block.
      for (var el = root.parentElement; el && el !== document.body && !(el.matches && el.matches('section')); el = el.parentElement) {
        var ov = getComputedStyle(el).overflowY;
        if (el.classList) el.classList.remove('wd2-hover');  // the site's photo hover-ring script also clips and rounds blocks
        if (ov === 'hidden' || ov === 'clip') el.style.setProperty('overflow', 'visible', 'important');
      }
      hero.style.marginTop = ''; hero.style.paddingTop = '';
      var gap = Math.round(hero.getBoundingClientRect().top + window.pageYOffset);
      if (gap > 0 && gap < 400) { hero.style.marginTop = -gap + 'px'; hero.style.paddingTop = gap + 'px'; }
    }
    pullUp();
    setTimeout(pullUp, 600); setTimeout(pullUp, 2000);
    window.__vpPull = pullUp;
    if (!window.__vpPullBound) { window.__vpPullBound = true; window.addEventListener('load', function () { if (window.__vpPull) window.__vpPull(); }); window.addEventListener('resize', function () { if (window.__vpPull) window.__vpPull(); }); }

    // Lightbox
    var lb = root.querySelector('.vp-lb'), lbImg = lb.querySelector('img'), count = lb.querySelector('.vp-count'), idx = 0, cur = [];
    var BIG = window.innerWidth < 700 ? 1000 : 1500, cache = {};
    function preload(p) { if (!p) return; var u = img(p, BIG); if (!cache[u]) { cache[u] = new Image(); cache[u].src = u; } }
    function open(i) {
      if (!cur.length) return;
      idx = (i + cur.length) % cur.length;
      var p = cur[idx], big = img(p, BIG);
      // show the slider-size photo straight away (already loaded), then swap in the sharper one
      lbImg.src = (cache[big] && cache[big].complete) ? big : img(p, 1000);
      if (lbImg.src.indexOf(big) === -1) { preload(p); cache[big].onload = function () { if (cur[idx] === p) lbImg.src = big; }; }
      count.textContent = (idx + 1) + ' / ' + cur.length;
      lb.classList.toggle('vp-lb-one', cur.length < 2);
      lb.hidden = false;
      preload(cur[(idx + 1) % cur.length]); preload(cur[(idx - 1 + cur.length) % cur.length]);
    }
    // swipe left/right in the full-screen viewer
    var sx = null;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 40) open(idx + (dx < 0 ? 1 : -1)); });
    // on-page sliders: arrows, counter
    Array.prototype.forEach.call(root.querySelectorAll('.vp-slider'), function (sl) {
      var tr = sl.querySelector('.vp-sl-track'), ct = sl.querySelector('.vp-sl-count'), n = tr.children.length;
      // one photo per step on phones, two side by side on desktop
      var step = function () { var a = tr.children[0], b = tr.children[1]; return b ? b.offsetLeft - a.offsetLeft : tr.clientWidth; };
      var per = function () { return Math.max(1, Math.round(tr.clientWidth / step())); };
      var at = function () { return Math.round(tr.scrollLeft / step()); };
      var go = function (d) { var i = Math.max(0, Math.min(n - per(), at() + d)); tr.scrollTo({ left: i * step(), behavior: 'smooth' }); };
      var upd = function () { var i = at(), k = per(); if (ct) ct.textContent = (k > 1 ? (i + 1) + '–' + Math.min(n, i + k) : (i + 1)) + ' / ' + n; var p = sl.querySelector('.vp-sl-prev'), q = sl.querySelector('.vp-sl-next'); if (p) p.disabled = i === 0; if (q) q.disabled = i >= n - k; };
      var pv = sl.querySelector('.vp-sl-prev'), nx = sl.querySelector('.vp-sl-next');
      if (pv) pv.addEventListener('click', function () { go(-1); });
      if (nx) nx.addEventListener('click', function () { go(1); });
      tr.addEventListener('scroll', function () { window.requestAnimationFrame(upd); }, { passive: true });
      upd();
    });
    root.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-set]');
      if (b && root.contains(b)) { cur = sets[+b.getAttribute('data-set')] || []; open(+b.getAttribute('data-i')); }
    });
    lb.addEventListener('click', function (e) {
      var t = e.target.closest('[data-a]'), a = t && t.getAttribute('data-a');
      if (a === 'prev') open(idx - 1); else if (a === 'next') open(idx + 1); else if (a === 'close' || e.target === lb) lb.hidden = true;
    });
    if (keyHandler) document.removeEventListener('keydown', keyHandler);
    keyHandler = function (e) {
      if (e.key === 'Escape' && lb.hidden) { var a = root.querySelector('.vp-aside.vp-open'); if (a) a.querySelector('.vp-sheet-bar').click(); return; }
      if (lb.hidden) return;
      if (e.key === 'Escape') lb.hidden = true; else if (e.key === 'ArrowRight') open(idx + 1); else if (e.key === 'ArrowLeft') open(idx - 1);
    };
    document.addEventListener('keydown', keyHandler);

    // Keep the whole form visible: if it is taller than the window, let it stick by its bottom edge.
    var aside = root.querySelector('.vp-aside');
    var mobileQ = window.matchMedia('(max-width:1000px)');
    // Desktop: the form stays pinned near the top and fits the screen; if it's taller than the screen it scrolls inside itself, so nothing gets cut off
    function fitSticky() { if (mobileQ.matches) return; root.style.setProperty('--vp-sticky-top', '24px'); }
    if ('ResizeObserver' in window) new ResizeObserver(function () { fitSticky(); }).observe(aside);

    // Phones: a bar pinned to the bottom opens and closes the form.
    var sheetBar = aside.querySelector('.vp-sheet-bar'), sheetLabel = sheetBar.querySelector('span'), openLabel = sheetLabel.textContent;
    function setSheet(open) {
      if (open) {
        // Keep the open form below the site's logo and menu button.
        var hd = document.querySelector('#header') || document.querySelector('header:not(.vp-hero)'), top = 24;
        if (hd) {
          var r = hd.getBoundingClientRect();
          if (r.bottom > 0) top = Math.max(top, Math.round(r.bottom) + 8);
          var logo = hd.querySelector('.header-title, .header-burger, .header-display-mobile');
          if (logo) { var lr = logo.getBoundingClientRect(); if (lr.bottom > 0 && lr.height) top = Math.max(top, Math.round(lr.bottom) + 8); }
        }
        root.style.setProperty('--vp-sheet-top', Math.min(top, Math.round(window.innerHeight * 0.4)) + 'px');
      }
      aside.classList.toggle('vp-open', open);
      if (window.__vpKbFit) window.__vpKbFit();
      sheetBar.setAttribute('aria-expanded', open ? 'true' : 'false');
      sheetBar.setAttribute('aria-label', open ? 'Close the enquiry form' : openLabel);
    }
    sheetBar.addEventListener('click', function () { setSheet(!aside.classList.contains('vp-open')); });
    // Phones: keep the open form sitting above the keyboard, and keep the box being typed in visible
    (function () {
      var vv = window.visualViewport;
      var fit = function () {
        if (!vv || !aside.classList.contains('vp-open')) { aside.style.removeProperty('bottom'); aside.style.removeProperty('top'); return; }
        var kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
        aside.style.bottom = kb + 'px';
        aside.style.top = (vv.offsetTop + (kb > 80 ? 8 : parseInt(getComputedStyle(root).getPropertyValue('--vp-sheet-top')) || 12)) + 'px';
      };
      if (vv) { vv.addEventListener('resize', fit); vv.addEventListener('scroll', fit); }
      aside.addEventListener('focusin', function (e) {
        if (!mobileQ.matches || !/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
        setTimeout(function () { fit(); try { e.target.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (x) { e.target.scrollIntoView(); } }, 320);
      });
      aside.addEventListener('focusout', function () { setTimeout(fit, 200); });
      window.__vpKbFit = fit;
    })();
    root.querySelector('.vp-facts .vp-btn').addEventListener('click', function (e) { if (mobileQ.matches) { e.preventDefault(); setSheet(true); } });
    fitSticky();
    if (!window.__vpFitBound) { window.__vpFitBound = true; window.addEventListener('resize', function () { if (window.__vpFit) window.__vpFit(); }); }
    window.__vpFit = fitSticky;

    // Enquiry form
    // Visitors arriving from an Instagram link get "How did you hear about us?" filled in for them
    (function () {
      var src = (location.search.match(/[?&]utm_source=([^&]+)/) || [])[1] || '';
      var heard = root.querySelector('#vp-heard');
      if (heard && /instagram|^ig$/i.test(decodeURIComponent(src)) && !heard.value) heard.value = 'Instagram';
    })();
    // Remember the couple's details on this device, so the form is already filled in on the next musician or venue page
    (function () {
      var KEY = 'orchaEnquiryDetails', ids = ['vp-fname', 'vp-lname', 'vp-email', 'vp-date', 'vp-time', 'vp-heard', 'vp-msg'], saved = {};
      try { saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) {}
      ids.forEach(function (id) {
        var f = root.querySelector('#' + id); if (!f) return;
        if (saved[id] && !f.value) {
          if (f.tagName === 'SELECT') { if (Array.prototype.some.call(f.options, function (o) { return o.value === saved[id]; })) f.value = saved[id]; }
          else if (!(f.type === 'date' && f.min && saved[id] < f.min)) f.value = saved[id];
        }
        var keep = function () {
          try { var d = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; d[id] = f.value; localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {}
        };
        f.addEventListener('input', keep); f.addEventListener('change', keep);
      });
    })();

    // ===== Enquiry list: couples add several musicians / packages / venues and send ONE enquiry =====
    var ELIST = 'orchaVenueEnquiryList';  // venues have their own list, separate from musicians and packages
    var getList = function () { try { return JSON.parse(localStorage.getItem(ELIST) || '[]') || []; } catch (e) { return []; } };
    var setList = function (l) { try { localStorage.setItem(ELIST, JSON.stringify(l)); } catch (e) {} };
    var curItem = function () { return { key: 'v:' + v.slug, label: 'Venue: ' + v.name, url: location.pathname }; };
    var elistBox = root.querySelector('.vp-elist'), addBtn = root.querySelector('.vp-add'), addNote = root.querySelector('.vp-add-note');
    var renderList = function () {
      var me = curItem(), others = getList().filter(function (x) { return !me || x.key !== me.key; });
      elistBox.hidden = !others.length;
      elistBox.querySelector('ul').innerHTML = others.map(function (x) { return '<li><span>' + esc(x.label) + '</span><button type="button" data-key="' + esc(x.key) + '" aria-label="Remove ' + esc(x.label) + '">✕</button></li>'; }).join('');
      Array.prototype.forEach.call(elistBox.querySelectorAll('button'), function (b) { b.addEventListener('click', function () { setList(getList().filter(function (x) { return x.key !== b.getAttribute('data-key'); })); renderList(); }); });
      var inList = me && getList().some(function (x) { return x.key === me.key; });
      addBtn.disabled = !me;
      addBtn.textContent = inList ? '✓ In your enquiry. Keep browsing' : '+ Add to my enquiry and keep browsing';
      var bar = root.querySelector('.vp-sheet-bar span');
      if (bar && !bar.parentNode.classList.contains('vp-bar-msg')) {
        var base = bar.getAttribute('data-base') || bar.textContent; bar.setAttribute('data-base', base);
        bar.textContent = base + (others.length ? ' + ' + others.length + ' more' : ''); bar.setAttribute('data-label', bar.textContent);
      }
    };
    addBtn.addEventListener('click', function () {
      var me = curItem(); if (!me) return;
      var l = getList().filter(function (x) { return x.key !== me.key; }); l.push(me); setList(l);
      renderList();
      addNote.hidden = false;
      addNote.innerHTML = 'Added. Have a look at our other <a href="/venues">venues</a>, then send one enquiry for all of them. Your details are saved.';
    });
    window.addEventListener('pageshow', renderList);
    renderList();
    var form = root.querySelector('.vp-form'), status = form.querySelector('.vp-status'), sendBtn = form.querySelector('button[type=submit]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'vp-status'; status.textContent = '';
      var missing = [];
      ['vp-fname', 'vp-lname', 'vp-email'].forEach(function (id) { var f = form.querySelector('#' + id); if (!f.value.trim()) missing.push(f); });
      var em = form.querySelector('#vp-email');
      if (missing.length) { status.className = 'vp-status vp-err'; status.textContent = 'Please fill in your first name, last name and email.'; missing[0].focus(); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim())) { status.className = 'vp-status vp-err'; status.textContent = 'Please check your email address.'; em.focus(); return; }
      if (!DATA.formAccessKey) { status.className = 'vp-status vp-err'; status.innerHTML = 'Online enquiries are not switched on yet. Please use our <a href="' + enq + '">enquiry page</a>.'; return; }
      var payload = { access_key: DATA.formAccessKey, page: location.href };
      Array.prototype.forEach.call(form.elements, function (f) { if (f.name && f.type !== 'checkbox') payload[f.name] = f.value.trim(); });
      // Email subject reads like "Aoife Byrne - J.R. Mahon's Enquiry"; the sender shows as the person's name.
      var fullName = payload['First name'] + ' ' + payload['Last name'];
      // Same subject for every enquiry from the same couple, so their emails land in one thread;
      // what they asked about goes in the body instead.
      var tidy = fullName.replace(/\s+/g, ' ').trim().toLowerCase().replace(/(^|[\s'-])([a-z])/g, function (a, b, c) { return b + c.toUpperCase(); });
      payload.subject = tidy + ' - Orcha Events Enquiry';
      var me = curItem(), all = getList().filter(function (x) { return x.key !== me.key; }); all.push(me);
      payload['Enquiry about'] = all.map(function (x, i) { return (all.length > 1 ? (i + 1) + '. ' : '') + x.label; }).join('\n');
      payload.from_name = fullName;
      payload.botcheck = form.querySelector('[name=botcheck]').checked;
      sendBtn.disabled = true; sendBtn.textContent = 'Sending…';
      fetch(FORM_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res.success) throw new Error(res.message || 'failed');
          setTimeout(fitSticky, 0);
          setList([]);
          // tell the Meta pixel a lead came in (for Instagram/Facebook ads)
          try { if (window.fbq) window.fbq('track', 'Lead', { content_name: v.name, content_category: 'Venue' }); } catch (x) {}
          form.innerHTML = '<div class="vp-done"><h2>Thanks, ' + esc(payload['First name']) + '</h2><p>We have your enquiry' + (all.length > 1 ? ' about ' + all.length + ' options' : ' about ' + esc(v.name)) + ' and will be in touch soon by email.</p></div>';
        })
        .catch(function () {
          sendBtn.disabled = false; sendBtn.textContent = 'Send enquiry';
          status.className = 'vp-status vp-err';
          status.innerHTML = 'Your enquiry did not send. Please try again, or use our <a href="' + enq + '">enquiry page</a>.';
        });
    });

    // Videos: stream with hls.js where needed; the video only downloads once someone presses play.
    if (allVideos.length) {
      var setup = function () {
        allVideos.forEach(function (x, i) {
          var el = root.querySelector('video[data-v="' + i + '"]'), src = (x.base || DATA.videoBase) + x.id + '/playlist.m3u8';
          if (!el || el.getAttribute('data-ready')) return;  // page re-drawn or already set up
          el.setAttribute('data-ready', '1');
          var wrap = el.parentNode, btn = wrap.querySelector('.vp-play');
          btn.addEventListener('click', function () { var pr = el.play(); if (pr && pr.catch) pr.catch(function () {}); });
          el.addEventListener('play', function () { wrap.classList.add('vp-playing'); el.setAttribute('controls', ''); });
          el.addEventListener('ended', function () { wrap.classList.remove('vp-playing'); });
          if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({ autoStartLoad: false, abrEwmaDefaultEstimate: 6000000, capLevelToPlayerSize: false, maxBufferLength: 10, startFragPrefetch: true });  // start in good quality instead of the lowest
            hls.loadSource(src); hls.attachMedia(el);
            // Start buffering the first few seconds as the video scrolls near the screen, so it plays straight away when tapped
            var started = false, kick = function () { if (!started) { started = true; hls.startLoad(); } };
            el.addEventListener('play', kick, { once: true });
            if ('IntersectionObserver' in window) {
              var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { kick(); io.disconnect(); } }); }, { rootMargin: '300px 0px' });
              io.observe(el);
            }
          } else { el.src = src; }
        });
      };
      if (window.Hls) setup();
      else { var s = document.createElement('script'); s.src = HLS_URL; s.onload = setup; s.onerror = setup; document.head.appendChild(s); }
    }
  }
})();
