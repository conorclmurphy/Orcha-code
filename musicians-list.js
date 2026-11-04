/* Orcha Events "Our musicians" page
   Usage in a Squarespace Code block on /musicians:
     <div id="musicians-list"></div>
     <script>
     fetch('https://raw.githubusercontent.com/conorclmurphy/Orcha-code/main/musicians-list.js', {cache: 'no-cache'})
       .then(function (r) { return r.text(); })
       .then(function (t) { var s = document.createElement('script'); s.textContent = t; document.body.appendChild(s); });
     </script>
   Musicians come from musicians.json, so new musicians appear here automatically.
   Photos are loaded at card size (not the full original), so the page stays fast. */
(function () {
  var DATA_URL = 'https://raw.githubusercontent.com/conorclmurphy/Orcha-code/main/musicians.json';
  var root = document.getElementById('musicians-list');
  if (!root) return;

  // Keep the site's photo-link script from turning this whole block into one link
  for (var blk = root; blk && blk !== document.body; blk = blk.parentElement) {
    if (blk.classList && blk.classList.contains('sqs-block')) { blk.wd2Wired = true; break; }
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  if (!document.getElementById('vp-fonts')) {
    var f = document.createElement('link');
    f.id = 'vp-fonts'; f.rel = 'stylesheet';
    f.href = 'https://fonts.googleapis.com/css2?family=Sansita:wght@400;700&family=Nunito+Sans:wght@400;600;700&display=swap';
    document.head.appendChild(f);
  }
  var st = document.createElement('style');
  st.textContent = [
    '#musicians-list{--c-bg:#212e21;--c-surface:#2c3b2c;--c-line:#3d503d;--c-ink:#f4f3e8;--c-muted:#c4c3b2;--c-cyan:#ebfc72;background:var(--c-bg);color:var(--c-ink);font-family:"Nunito Sans",Arial,sans-serif;padding:4px clamp(12px,2.5vw,32px) 56px}',
    '#musicians-list *{box-sizing:border-box}',
    '#musicians-list .ml-wrap{max-width:1600px;margin:0 auto}',
    '#musicians-list .ml-eye{font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--c-cyan);margin:0 0 8px}',
    '#musicians-list h1{font-family:"Sansita",Georgia,serif;font-weight:400;font-size:clamp(30px,4.4vw,48px);line-height:1.08;margin:0;color:var(--c-cyan)}',
    '#musicians-list .ml-from{display:inline-flex;align-items:baseline;gap:8px;margin:0;padding:0;color:var(--c-cyan)}',
    '#musicians-list .ml-from span{font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--c-cyan);opacity:.8}',
    '#musicians-list .ml-from strong{font-family:"Sansita",Georgia,serif;font-weight:400;font-size:28px;line-height:1}',
    '#musicians-list .ml-top{display:flex;flex-wrap:wrap;align-items:center;gap:12px 22px;margin:0 0 22px}',
    '#musicians-list .ml-head{flex:1 1 420px;min-width:0}',
    '#musicians-list .ml-intro{margin:8px 0 0;max-width:720px;font-size:15px;line-height:1.55;color:var(--c-muted)}',
    '#musicians-list .ml-top{align-items:flex-end}',
    '#musicians-list .ml-chips{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 0 auto;justify-content:flex-end}',
    '#musicians-list .ml-chip{font:inherit;font-size:13px;cursor:pointer;padding:6px 13px;border-radius:999px;color:#f4f3e8;background:rgba(244,243,232,.08);-webkit-backdrop-filter:blur(12px) saturate(140%);backdrop-filter:blur(12px) saturate(140%);border:1px solid rgba(244,243,232,.28);box-shadow:inset 0 1px 0 rgba(255,255,255,.12);transition:background .2s,border-color .2s,color .2s}',
    '#musicians-list .ml-chip:hover{background:rgba(244,243,232,.16)}',
    '#musicians-list .ml-chip.on{background:rgba(235,252,114,.28);border-color:#ebfc72;color:#fff}',
    '#musicians-list .ml-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:26px 18px}',
    '#musicians-list .ml-card,#musicians-list .ml-card.wd2-hover,#musicians-list .ml-card.wd2-hover:hover{display:grid;gap:8px;text-decoration:none!important;color:var(--c-ink)!important;box-shadow:none!important;transform:none!important;border-radius:0!important;overflow:visible!important}',
    '#musicians-list .ml-card[hidden]{display:none}',
    '#musicians-list .ml-img{position:relative;aspect-ratio:3/4;border-radius:16px;overflow:hidden;background:var(--c-line);transition:box-shadow .25s}',
    '#musicians-list .ml-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s}',
    '#musicians-list .ml-img:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 55%,rgba(0,0,0,.75) 100%)}',
    '#musicians-list .ml-card:hover .ml-img{box-shadow:0 0 0 3px var(--c-cyan),0 12px 30px rgba(0,0,0,.35)}',
    '#musicians-list .ml-card:hover .ml-img img{transform:scale(1.04)}',
    '#musicians-list .ml-name{position:absolute;left:14px;bottom:11px;z-index:1;font-family:"Sansita",Georgia,serif;font-size:24px;color:#f4f3e8}',
    '#musicians-list img.ml-wm{position:absolute;inset:auto 12px 12px auto;width:30px;height:auto;object-fit:contain;z-index:2;opacity:.85;filter:drop-shadow(0 1px 3px rgba(0,0,0,.6));pointer-events:none;transform:none!important}',
    '#musicians-list .ml-xc img.ml-wm{inset:auto 14px 14px auto;width:30px;height:auto}',
    '#musicians-list .ml-tags{position:absolute;top:9px;left:9px;right:9px;z-index:1;display:flex;flex-wrap:wrap;gap:4px}',
    '#musicians-list .ml-tag{font-size:10.5px;line-height:1;padding:4px 7px;border-radius:999px;color:#f4f3e8;background:rgba(0,0,0,.35);-webkit-backdrop-filter:blur(8px) saturate(140%);backdrop-filter:blur(8px) saturate(140%);border:1px solid rgba(244,243,232,.3)}',
    '#musicians-list .ml-more{position:absolute;right:50px;bottom:12px;z-index:1;font-size:10px;letter-spacing:.04em;color:rgba(244,243,232,.8)}',
    '#musicians-list .ml-card:hover .ml-more{color:#ebfc72}',
    '#musicians-list .ml-about{margin-top:28px;border:1px solid var(--c-line);border-radius:14px;background:rgba(244,243,232,.04)}',
    '#musicians-list .ml-about summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;font-size:15px;font-weight:600;color:var(--c-ink)}',
    '#musicians-list .ml-about summary::-webkit-details-marker{display:none}',
    '#musicians-list .ml-about summary:after{content:"+";font-size:20px;line-height:1;color:var(--c-cyan);transition:transform .25s}',
    '#musicians-list .ml-about[open] summary:after{transform:rotate(45deg)}',
    '#musicians-list .ml-about p{margin:0;padding:0 16px 14px;font-size:14.5px;line-height:1.6;color:var(--c-muted)}',
    '#musicians-list .ml-more3{margin-top:44px}',
    '#musicians-list .ml-more3 h2{font-family:"Sansita",Georgia,serif;font-weight:400;font-size:clamp(22px,2.6vw,30px);margin:0 0 16px;color:var(--c-ink)}',
    '#musicians-list .ml-x{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}#musicians-list .ml-more3>.ml-x{grid-template-columns:repeat(4,minmax(0,1fr))}@media (max-width:1100px){#musicians-list .ml-more3>.ml-x{grid-template-columns:repeat(2,minmax(0,1fr))}}@media (max-width:760px){#musicians-list .ml-more3>.ml-x{grid-template-columns:1fr}}',
    '#musicians-list .ml-xc{position:relative;display:flex;flex-direction:column;justify-content:flex-end;min-height:260px;padding:20px;border-radius:18px;overflow:hidden;text-decoration:none!important;color:#f4f3e8!important;font:inherit;text-align:left;cursor:pointer;border:1px solid rgba(244,243,232,.14);background:#212e21;transition:box-shadow .25s,transform .25s}',
    '#musicians-list .ml-xc:hover{box-shadow:0 0 0 3px #ebfc72,0 12px 30px rgba(0,0,0,.35);transform:translateY(-2px)}',
    '#musicians-list .ml-xc img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .5s}',
    '#musicians-list .ml-xc:hover img{transform:scale(1.04)}',
    '#musicians-list .ml-xc:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 35%,rgba(0,0,0,.85) 100%)}',
    '#musicians-list .ml-xc>span{position:relative;z-index:1;display:block}',
    '#musicians-list .ml-xe{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#ebfc72;margin-bottom:4px}',
    '#musicians-list .ml-xt{font-family:"Sansita",Georgia,serif;font-size:26px;line-height:1.1}',
    '#musicians-list .ml-xs{font-size:13.5px;color:rgba(244,243,232,.8);margin-top:4px}',
    '#musicians-list .ml-xk{display:grid;gap:6px;align-content:start;text-align:left;font:inherit;color:#f4f3e8!important;background:none;border:0;padding:0;cursor:pointer;text-decoration:none!important}',
    '#musicians-list .ml-xi{position:relative;display:block;aspect-ratio:4/3;border-radius:16px;overflow:hidden;background:#212e21;transition:box-shadow .25s}',
    '#musicians-list .ml-xi img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s}',
    '#musicians-list .ml-xk:hover .ml-xi{box-shadow:0 0 0 3px #ebfc72,0 8px 24px rgba(0,0,0,.35)}',
    '#musicians-list .ml-xk:hover .ml-xi img:not(.ml-wm){transform:scale(1.04)}',
    '#musicians-list .ml-xk strong{font-family:"Sansita",Georgia,serif;font-weight:400;font-size:24px;line-height:1.2;margin-top:8px}',
    '#musicians-list .ml-xp{font-size:15px;color:var(--c-muted)}',
    '#musicians-list .ml-xi img.ml-wm{inset:auto 12px 12px auto;width:30px;height:auto}',
    '#musicians-list .ml-more3 .ml-xg{min-height:0;aspect-ratio:4/3;align-self:start}',
    '#musicians-list .ml-xg{background:rgba(244,243,232,.08);-webkit-backdrop-filter:blur(14px) saturate(140%);backdrop-filter:blur(14px) saturate(140%);border-color:rgba(244,243,232,.28);justify-content:center}',
    '#musicians-list .ml-xg:after{display:none}',
    '#musicians-list .ml-xb{align-self:flex-start;display:inline-flex;gap:6px;align-items:center;margin-top:14px;padding:9px 20px;border-radius:999px;background:#ebfc72;color:#212e21;font-weight:600;font-size:14px;animation:mlBounce 2.6s ease-in-out infinite}',
    '@keyframes mlBounce{0%,60%,100%{transform:translateY(0)}70%{transform:translateY(-5px)}80%{transform:translateY(0)}88%{transform:translateY(-2px)}}',
    '@media (prefers-reduced-motion:reduce){#musicians-list .ml-xb{animation:none}}',
    '#musicians-list .ml-pop{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.82);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px}',
    '#musicians-list .ml-pop[hidden]{display:none}',
    '#musicians-list .ml-pop-in{width:100%;max-width:980px;text-align:center}',
    '#musicians-list .ml-pop h3{font-family:"Sansita",Georgia,serif;font-weight:400;font-size:clamp(26px,3.4vw,38px);margin:0 0 6px;color:#f4f3e8}',
    '#musicians-list .ml-pop p{margin:0 0 20px;color:rgba(244,243,232,.8)}',
    '#musicians-list .ml-pop .ml-x{text-align:left}',
    '#musicians-list .ml-pop-x{position:absolute;top:16px;right:18px;width:42px;height:42px;border-radius:50%;border:0;background:rgba(244,243,232,.12);color:#f4f3e8;font-size:24px;cursor:pointer}',
    '@media (max-width:760px){#musicians-list .ml-x{grid-template-columns:1fr;gap:12px}#musicians-list .ml-xc{min-height:170px}#musicians-list .ml-xg{min-height:0}#musicians-list .ml-pop .ml-xc{min-height:120px}#musicians-list .ml-xt{font-size:22px}}',
    '@media (max-width:1000px){#musicians-list .ml-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}',
    '@media (max-width:700px){#musicians-list{padding-top:0}#musicians-list .ml-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 12px}#musicians-list .ml-name{font-size:19px;bottom:9px;left:11px}#musicians-list .ml-img img.ml-wm{width:24px;inset:auto 9px 9px auto}#musicians-list .ml-more{display:none}#musicians-list .ml-tag{font-size:9.5px;padding:3px 6px}#musicians-list .ml-tags{top:7px;left:7px;right:7px;gap:3px}#musicians-list .ml-top{gap:10px 14px;margin-bottom:14px}#musicians-list .ml-from strong{font-size:23px}#musicians-list .ml-from span{font-size:11.5px}#musicians-list .ml-chips{margin:0;justify-content:flex-start;width:100%}#musicians-list .ml-intro{font-size:13.5px;margin-top:6px}#musicians-list .ml-chip{font-size:12.5px;padding:6px 12px}}'
  ].join('');
  document.head.appendChild(st);

  // Same photos, crop points and order as the original /musicians grid.
  // Musicians not listed here still appear (after these), using their profile photo.
  var LIST_PHOTOS = {
    lee: ['b1d790f4-10b1-49e6-8a3f-d0954b2f1279/0311.jpg', '56% 34%'],
    mathew: ['7f6fbbd3-9308-4647-9a18-d1527e8013a7/2539bfd9-d4db-4962-b79d-9dd152ae4956.jpg', '50% 50%'],
    conorc: ['fed5839c-74d5-4278-951e-aa553f73d566/75d322ea-b351-4ce0-92ed-a0d32b85adfa.jpeg', '57% 32%'],
    josh: ['4e446b89-d89b-4969-85d7-4aa409a8fd4f/%F0%9F%93%B8+%40classytrebor+%23music+%23explorepage+%23foryou+%23jqmusic.jpg', '50% 50%'],
    conort: ['f31ae8b7-63ec-4fd3-aed6-a5e726ad9a41/IMG_0023.jpeg', '50% 50%'],
    cathal: ['bf3659bf-44dc-46c9-be99-e1f9363c15c0/image00002.jpg', '30% 46%'],
    alan: ['93d97748-02ee-4529-9ec7-eb6dd6aeb793/DSC00499_Original.jpg', '39% 54%'],
    craig: ['8039f4a9-6f54-45a8-82a0-acfdc307e41d/e62b1481-6b94-4eec-9d3b-fe878f830d69.png', '0% 67%'],
    karl: ['fc1cc265-3a0e-4cd8-a1a1-bb0402957f35/copy_E566B8C9-484D-45D3-BE09-3864F0978D28.JPEG', '50% 50%'],
    emmett: ['054bee54-e90c-4a94-af76-a20731daa6c4/c8d73e3d-736f-455c-9022-a15527a6d0dd.jpg', '50% 50%'],
    pauric: ['3979008e-db26-424d-8d96-cf31dd9a98ac/WhatsApp+Image+2026-06-02+at+21.59.01.jpg', '31% 68%'],
    phil: ['2135872b-f92c-431c-8435-81225d5fb05c/A66F302B-E872-4BA5-94C3-7CA3ED1B7BA6.JPG', '9% 14%'],
    cian: ['fafe5387-96fe-4348-b492-b14472244729/Cian+Morrin+Photo.jpeg', '50% 50%'],
    james: ['3ece3c6f-4934-4054-8f70-b7eed1dfe7c2/1c21f9d0-4dfe-42c6-979a-a7682324140b.png', '50% 50%'],
    paddy: ['027205ec-38d3-4b68-87b2-8af1fc1b2bfe/IMG_5893.png', '50% 50%'],
    andrew: ['5a74b1f4-88b4-4ac1-b385-dc9f339e8bc5/The+Waterfront+Hall+on+Friday+night+supporting+Bonnie+Tyler.+Surreal+experience+to+say+the+least.jpg', '50% 50%']
  };
  var ORDER_SLUGS = Object.keys(LIST_PHOTOS);
  var H1 = 'Live Musicians for Events Across Ireland';
  var INTRO = 'Find live musicians for corporate events, private parties and celebrations, in Dublin and across Ireland. Browse performer profiles, then tell Orcha Events your date, venue and what you have in mind. We’ll check availability and help you find suitable options.';
  var WM = '<img class="ml-wm" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" alt="" aria-hidden="true">';  // small Orcha Events logo
  var IMG = 'https://images.squarespace-cdn.com/content/v1/68e3e2b74d7ab5214f499b88/';
  var VENUES_URL = 'https://raw.githubusercontent.com/conorclmurphy/Orcha-code/main/venues.json';
  var DJ_IMG = '94137cf3-c61b-4326-9a8a-4cd0fc2344de/3.jpg';  // same photo as the DJ card on the home page
  var DJS = [  // the same three options as the home page DJ pop-up
    ["DJ's", '/djs', IMG + '1790699637462-NX43EIAYBZJ73ZH5245J/unsplash-image-ttv1pX6tk7o.jpg?format=750w'],
    ['DJ & Sax', '/djsax', IMG + 'cca93cb1-94fe-4860-a650-152bf3cd2039/sax+dj%281%29.jpg?format=750w'],
    ['Karaoke', '/karaoke', IMG + '1790699848604-H16VA8BSP7PD0RD8C0KQ/unsplash-image-6_1tYvLLZqo.jpg?format=750w']
  ];

  var OIMG = 'https://images.squarespace-cdn.com/content/v1/6a731d922765f009f402b3fd/';  // photos stored on the Orcha site
  var BANDS_IMG = IMG + '0f16f2b1-d018-4881-9200-3d4fccb2bbd9/780dba9a-26a9-4f8b-9bbd-9b30d045d6d2.JPG?format=750w';
  var BANDS = [
    ['Modern Trad Band', '/trad', BANDS_IMG],
    ['Jazz Band', '/jazz', OIMG + '1790357190913-GUWDC1C99LY0HFU40NJD/unsplash-image-dBWvUqBoOU8.jpg?format=750w'],
    ['Show Band', '/showband', OIMG + '1789614005659-BZNJFI0ZP9S01FK68GO6/unsplash-image-Cknyec2RnrE.jpg?format=750w']
  ];

  function render(D) {
    var L = D.eventLabels || {}, ORDER = ['ceremony', 'day2', 'afterdinner'];
    var list = D.musicians.filter(function (o) { return o.live && o.url && o.listed !== false && o.photo && o.events; });
    var rank = function (o) { var i = ORDER_SLUGS.indexOf(o.slug); return i === -1 ? 999 : i; };
    list.sort(function (a, b) { return rank(a) - rank(b); });
    var SHARPER = { cathal: 1500, alan: 1500 };  // wide photos cropped into tall cards, so they need the bigger version
    var size = 500;  // card-sized photos (about 1.4MB for the whole page, instead of 8MB+)
    var DJC = D.djCard || {};  // same DJ card as on the musician pages
    var filters = [['all', 'All musicians'], ['ceremony', L.ceremony || 'Ceremony & drinks reception'], ['day2', L.day2 || 'Day 2'], ['afterdinner', L.afterdinner || 'After dinner']];
    var h = '<div class="ml-wrap"><div class="ml-top"><div class="ml-head"><h1>' + esc(H1) + '</h1></div>'

      + '</div><div class="ml-grid">';
    list.forEach(function (o, i) {
      var lp = LIST_PHOTOS[o.slug];
      var ev = ORDER.filter(function (e) { return o.events.indexOf(e) !== -1; });
      var tags = ev.map(function (e) { return e === 'ceremony' ? 'Ceremony' : (L[e] || e); });
      h += '<a class="ml-card" href="' + esc(o.url) + '" data-tags="' + esc(ev.concat(o.duo ? ['duo'] : []).concat(o.tradBand ? ['tradBand'] : []).join(' ')) + '">'
        + '<div class="ml-img"><img src="' + esc(D.imageBase + (lp ? lp[0] : o.photo) + '?format=' + (SHARPER[o.slug] || size) + 'w') + '" alt="' + esc(o.name) + '" loading="' + (i < 4 ? 'eager' : 'lazy') + '" decoding="async"'
        + ' style="object-position:' + esc(lp ? lp[1] : (o.cardPosition || o.photoPosition || 'center')) + '"><span class="ml-tags">' + tags.map(function (t) { return '<span class="ml-tag">' + esc(t) + '</span>'; }).join('') + '</span>' + WM + '<span class="ml-name">' + esc(o.name) + '</span><span class="ml-more">View profile →</span></div></a>';
    });
    h += '</div><details class="ml-about"><summary>About our musicians</summary><p>' + esc(INTRO) + '</p></details><div class="ml-more3"><h2>Explore more</h2><div class="ml-x">'
      + '<a class="ml-xk ml-venue" href="/venues"><span class="ml-xi"></span><strong>Our venues</strong><span class="ml-xp">Find the perfect place for your event</span></a>'
      + '<button type="button" class="ml-xk ml-dj"><span class="ml-xi"><img src="' + IMG + (DJC.image || DJ_IMG) + '?format=750w" alt="" loading="lazy">' + WM + '</span><strong>' + esc(DJC.title || 'Our DJ options') + '</strong><span class="ml-xp">' + esc(DJC.text || 'DJs, DJ & Sax and Karaoke') + '</span></button>'
      + '<button type="button" class="ml-xk ml-bands"><span class="ml-xi"><img src="' + esc(BANDS_IMG) + '" alt="" loading="lazy">' + WM + '</span><strong>Our bands</strong><span class="ml-xp">Modern trad, jazz band and show band</span></button>'
      + '<a class="ml-xc ml-xg" href="/packages"><span class="ml-xt">Build your own package</span><span class="ml-xs">Pick your musician, add a band or DJ, and get an estimated price.</span><span class="ml-xb">Start building <span aria-hidden="true">→</span></span></a>'
      + '</div></div></div>'
      + '<div class="ml-pop" hidden><button type="button" class="ml-pop-x" aria-label="Close">&times;</button><div class="ml-pop-in"><h3></h3><p>Pick an option to see what\'s available.</p><div class="ml-x"></div></div></div>';
    root.innerHTML = h;

    // Stop the site's photo-link script from taking over these links and photos
    var claim = function () { Array.prototype.forEach.call(root.querySelectorAll('a, img, button'), function (el) { el.wd2Wired = true; }); };
    claim();

    // DJ card opens the three DJ options
    var pop = root.querySelector('.ml-pop');
    var closePop = function () { pop.hidden = true; document.body.style.overflow = ''; };
    var openPop = function (title, list) {
      pop.querySelector('h3').textContent = title;
      pop.querySelector('.ml-x').innerHTML = list.map(function (d) { return '<a class="ml-xc" href="' + d[1] + '"><img src="' + d[2] + '" alt="" loading="lazy">' + WM + '<span class="ml-xt">' + d[0] + '</span></a>'; }).join('');
      claim(); pop.hidden = false; document.body.style.overflow = 'hidden';
    };
    root.querySelector('.ml-dj').addEventListener('click', function () { openPop('DJ Packages', DJS); });
    root.querySelector('.ml-bands').addEventListener('click', function () { openPop('Our Bands', BANDS); });
    pop.querySelector('.ml-pop-x').addEventListener('click', closePop);
    pop.addEventListener('click', function (e) { if (e.target === pop) closePop(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !pop.hidden) closePop(); });

    // Venue card shows a different random venue each visit
    fetch(VENUES_URL, { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (V) {
      var vs = (V.venues || []).filter(function (v) { return String(v.live) !== 'false' && v.url && (v.cardImg || v.heroImg); });
      if (!vs.length) return;
      var seenV = [];  // skip venues this visitor has already looked at, unless they've seen them all
      try { seenV = JSON.parse(localStorage.getItem('orchaSeenVenues') || '[]'); } catch (e) {}
      var fresh = vs.filter(function (x) { return seenV.indexOf(x.slug) === -1; });
      if (fresh.length) vs = fresh;
      var v = vs[Math.floor(Math.random() * vs.length)], card = root.querySelector('.ml-venue');
      card.href = v.url;
      card.innerHTML = '<span class="ml-xi"><img src="' + esc((V.imageBase || IMG) + (v.cardImg || v.heroImg) + '?format=750w') + '" alt="" loading="lazy">' + WM + '</span><strong>' + esc(v.name) + '</strong><span class="ml-xp">' + esc(v.area || v.county || '') + '</span>';
      claim();
    }).catch(function () {});

    Array.prototype.forEach.call(root.querySelectorAll('.ml-chip'), function (c) {
      c.addEventListener('click', function () {
        var f = c.getAttribute('data-f');
        Array.prototype.forEach.call(root.querySelectorAll('.ml-chip'), function (x) { x.classList.toggle('on', x === c); });
        Array.prototype.forEach.call(root.querySelectorAll('.ml-card'), function (card) {
          card.hidden = f !== 'all' && (' ' + card.getAttribute('data-tags') + ' ').indexOf(' ' + f + ' ') === -1;
        });
      });
    });
  }

  // Paint the whole Squarespace section dark too, so there's no lighter band around the grid
  var sec = root.closest('section');
  if (sec) {
    sec.style.backgroundColor = '#212e21';
    var sb = sec.querySelector('.section-background');
    if (sb) { sb.style.backgroundColor = '#212e21'; Array.prototype.forEach.call(sb.children, function (c) { c.style.opacity = '0'; }); }
  }

  // Shimmering placeholder cards while the musician list loads
  root.innerHTML = '<style>@keyframes wd2Shim{0%{background-position:-400px 0}100%{background-position:400px 0}}.wd2-sk{background:#2c3b2c linear-gradient(90deg,rgba(244,243,232,0) 0,rgba(244,243,232,.07) 50%,rgba(244,243,232,0) 100%) no-repeat;background-size:400px 100%;animation:wd2Shim 1.3s ease-in-out infinite;border-radius:14px}@media (prefers-reduced-motion:reduce){.wd2-sk{animation:none}}</style><div class="ml-wrap"><div class="wd2-sk" style="height:44px;width:min(300px,70%);margin-bottom:22px"></div><div class="ml-grid">' + new Array(9).join('<div class="wd2-sk" style="aspect-ratio:3/4;border-radius:16px"></div>') + '</div></div>';

  (window.WD2_MUSICIANS ? Promise.resolve(window.WD2_MUSICIANS) : fetch(DATA_URL, { cache: 'no-cache' }).then(function (r) { return r.json(); }))
    .then(render)
    .catch(function () { root.innerHTML = '<p style="padding:30px">Musicians could not be loaded. Please refresh the page.</p>'; });
})();
