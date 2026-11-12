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
#venue-page .vp-aside:not(.vp-open) .vp-sheet{max-width:230px;transition:max-width .25s;overflow:visible;box-shadow:none}#venue-page .vp-aside:not(.vp-open) .vp-sheet-bar{padding:11px 18px;font-size:15px;justify-content:center;gap:8px;background:#182218;color:var(--vp-brass);border:1.5px solid var(--vp-brass);animation:vpTempt 2.8s ease-in-out infinite}#venue-page .vp-aside:not(.vp-open) .vp-sheet-bar svg{color:var(--vp-brass)}#venue-page .vp-aside:not(.vp-open) .vp-sheet-bar.vp-pulse{animation:vpPulse .9s ease-out 2}#venue-page .vp-aside:not(.vp-open) .vp-sheet:has(.vp-bar-msg){max-width:340px}#venue-page .vp-aside:not(.vp-open) .vp-sheet{width:max-content;max-width:min(360px,calc(100vw - 32px))}#venue-page .vp-aside:not(.vp-open) .vp-sheet-bar{font-size:14px;line-height:1.3;text-align:center}#venue-page .vp-aside:not(.vp-open) .vp-sheet-bar:not(.vp-bar-msg){white-space:nowrap}#venue-page .vp-aside:not(.vp-open) .vp-sheet-bar:not(.vp-bar-msg) span{min-width:0;overflow:hidden;text-overflow:ellipsis}@keyframes vpTempt{0%,100%{box-shadow:0 6px 20px rgba(0,0,0,.45),0 0 0 0 rgba(235,252,114,.45)}50%{box-shadow:0 6px 20px rgba(0,0,0,.45),0 0 0 9px rgba(235,252,114,0)}}@media (prefers-reduced-motion:reduce){#venue-page .vp-aside:not(.vp-open) .vp-sheet-bar{animation:none}}\
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
    h += '<header class="vp-hero"><img src="' + img(v.heroImg || v.cardImg, 2500) + '" alt="' + esc(v.name) + '"' + (v.heroPos ? ' style="object-position:' + esc(v.heroPos) + '"' : '') + '>';
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
      + '<div class="vp-elist" hidden><span class="vp-elist-t">Also in your enquiry</span><div class="vp-el-bubbles"></div><ul></ul></div>'
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
            var hls = new window.Hls({ autoStartLoad: false, abrEwmaDefaultEstimate: 6000000, capLevelToPlayerSize: false, maxBufferLength: 10, startFragPrefetch: true, testBandwidth: false });
            // Always start in the top quality (1080p), on phones too, instead of letting the phone pick the low 360p version first
            hls.on(window.Hls.Events.MANIFEST_PARSED, function (ev, d) {
              var top = 0; (d.levels || hls.levels).forEach(function (l, li) { if ((l.height || 0) > ((d.levels || hls.levels)[top].height || 0)) top = li; });
              hls.startLevel = top;
            });
            try { el.disableRemotePlayback = true; } catch (e) {}  // lets iPhones (iOS 17.1+) use this player rather than their own
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
