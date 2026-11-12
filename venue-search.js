/* Orcha Events venue search
   Usage in the Squarespace Code block on the Venues page:
     <div id="wd2-venues-root"></div>
     <script>
     fetch('https://raw.githubusercontent.com/conorclmurphy/Orcha-code/main/venue-search.js', {cache: 'no-cache'})
       .then(function (r) { return r.text(); })
       .then(function (t) { var s = document.createElement('script'); s.textContent = t; document.body.appendChild(s); });
     </script>
   Venues come from venues.json (the same file the venue pages use), so a venue
   added or changed there shows up here automatically. */
(function () {
  var DATA_URL = 'https://raw.githubusercontent.com/conorclmurphy/Orcha-code/main/venues-orcha.json';
  // Small Orcha Events logo shown in the corner of each venue photo
  var WD2_MARK_TAG = '<img class="wdvs-mark" src="data:image/png;base64,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" alt="" aria-hidden="true">';
  var WATERMARK_LOGO_URL = 'https://images.squarespace-cdn.com/content/v1/68e3e2b74d7ab5214f499b88/d0f816a6-5802-418f-bd11-37ddd18df645/logo2027transparent.png?format=500w';

  var root = document.getElementById('wd2-venues-root');
  if (!root) return;

  // Paint the whole page section black so the search runs right up to the top, with no patterned strip above it
  var sec = root.closest('section');
  if (sec) {
    sec.style.backgroundColor = '#212e21';
    var sb = sec.querySelector('.section-background');
    if (sb) { sb.style.backgroundColor = '#212e21'; Array.prototype.forEach.call(sb.children, function (c) { c.style.opacity = '0'; }); }
  }

  if (!document.getElementById('wdvs-search-fonts')) {
    var f = document.createElement('link');
    f.id = 'wdvs-search-fonts'; f.rel = 'stylesheet';
    f.href = 'https://fonts.googleapis.com/css2?family=Sansita:wght@400;700&family=Nunito+Sans:wght@400;600;700&display=swap';
    document.head.appendChild(f);
  }

  var css = '\
#wd2-venues-root{--ink:#f7f6ec;--cream:#212e21;--card:#2c3b2c;--sage:#ebfc72;--sage-dark:#f3fdb0;--brass:#ffffff;--rose:#d9a394;--line:#3d503d;--radius:14px;\
font-family:"Nunito Sans","Work Sans",-apple-system,BlinkMacSystemFont,sans-serif;color:var(--ink);background:var(--cream);padding:10px clamp(12px,2.5vw,32px) 56px;box-sizing:border-box;position:relative;overflow:hidden;border:0;border-radius:0}\
#wd2-venues-root .wdvs-watermark{position:absolute;top:50%;left:50%;width:min(1100px,140vw);transform:translate(-50%,-50%);opacity:.05;filter:brightness(0) invert(1);pointer-events:none;z-index:0;user-select:none}\
#wd2-venues-root>.wdvs-head,#wd2-venues-root>.wdvs-filters,#wd2-venues-root>.wdvs-reset,#wd2-venues-root>.wdvs-count,#wd2-venues-root>.wdvs-grid,#wd2-venues-root>.wdvs-empty{position:relative;z-index:1}\
#wd2-venues-root *,#wd2-venues-root *::before,#wd2-venues-root *::after{box-sizing:border-box}\
#wd2-venues-root .wdvs-head{max-width:1600px;margin:0 auto 18px;text-align:center}\
#wd2-venues-root .wdvs-eyebrow{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--brass);font-weight:600;margin-bottom:8px}\
#wd2-venues-root .wdvs-title{font-family:"Sansita",Georgia,serif;font-optical-sizing:auto;font-weight:500;font-size:clamp(28px,4vw,42px);margin:0 0 8px;color:var(--sage-dark)}\
#wd2-venues-root .wdvs-sub{font-size:15px;color:#b7b2a1;margin:0}\
#wd2-venues-root .wdvs-filters{max-width:1600px;margin:0 auto 30px;background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:20px 22px;display:grid;gap:16px;grid-template-columns:1.3fr 1fr 1fr}\
@media (max-width:720px){#wd2-venues-root .wdvs-filters{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px 12px;padding:16px}#wd2-venues-root .wdvs-filters>.wdvs-field:nth-child(n+3){grid-column:1 / -1}#wd2-venues-root .wdvs-field input[type="text"],#wd2-venues-root .wdvs-field select{min-width:0;text-overflow:ellipsis}}\
#wd2-venues-root .wdvs-field label{display:block;font-size:11px;letter-spacing:.1em;text-transform:uppercase;font-weight:600;color:var(--sage-dark);margin-bottom:7px}\
#wd2-venues-root .wdvs-field input[type="text"],#wd2-venues-root .wdvs-field select{width:100%;padding:9px 12px;border:1px solid var(--line);border-radius:8px;font-family:inherit;font-size:16px;background:var(--cream);color:var(--ink)}\
#wd2-venues-root .wdvs-field input[type="text"]:focus,#wd2-venues-root .wdvs-field select:focus{outline:2px solid var(--sage);outline-offset:1px}\
#wd2-venues-root .wdvs-chiprow{display:flex;flex-wrap:wrap;gap:8px}\
#wd2-venues-root .wdvs-chip{-webkit-appearance:none;appearance:none;margin:0;padding:8px 14px;line-height:1.2;border-radius:999px;border:1px solid var(--line);background:var(--cream);background-clip:padding-box;box-shadow:none;text-decoration:none;text-shadow:none;font-size:13px;cursor:pointer;font-family:inherit;color:var(--ink);transition:none;-webkit-tap-highlight-color:transparent;outline:none}\
#wd2-venues-root .wdvs-chip:hover{border-color:var(--sage)}\
#wd2-venues-root .wdvs-chip:focus{outline:none}\
#wd2-venues-root .wdvs-chip:focus-visible{outline:2px solid var(--sage);outline-offset:2px}\
#wd2-venues-root .wdvs-chip::before,#wd2-venues-root .wdvs-chip::after{content:none;display:none}\
#wd2-venues-root .wdvs-chip[aria-pressed="true"]{background:var(--sage);border-color:var(--sage);color:#212e21}\
#wd2-venues-root .wdvs-capacity-row{display:flex;align-items:center;gap:10px}\
#wd2-venues-root .wdvs-capacity-row input[type="range"]{flex:1;accent-color:var(--sage)}\
#wd2-venues-root .wdvs-capacity-val{font-size:13px;font-weight:600;color:var(--sage-dark);min-width:74px;text-align:right}\
#wd2-venues-root .wdvs-reset{max-width:1600px;margin:-14px auto 26px;text-align:right}\
#wd2-venues-root .wdvs-reset button{background:none;border:none;font-family:inherit;font-size:13px;color:var(--brass);cursor:pointer;text-decoration:underline}\
#wd2-venues-root .wdvs-count{max-width:1600px;margin:0 auto 16px;font-size:13px;color:#b7b2a1}\
#wd2-venues-root .wdvs-grid{max-width:1600px;margin:0 auto;display:grid;gap:22px;grid-template-columns:repeat(auto-fill,minmax(240px,1fr))}\
#wd2-venues-root .wdvs-card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;display:flex;flex-direction:column;text-decoration:none;color:inherit;transition:transform .18s ease,box-shadow .18s ease;aspect-ratio:auto;max-width:none;margin:0;min-height:0;width:auto;position:relative}\
@media (hover:hover){#wd2-venues-root .wdvs-card.wdvs-live:hover{transform:translateY(-3px);border-color:#ebfc72;box-shadow:0 0 0 2px #ebfc72,0 12px 30px rgba(0,0,0,.45)}#wd2-venues-root .wdvs-card.wdvs-live:hover .wdvs-card-img{transform:scale(1.04)}}#wd2-venues-root .wdvs-card-img{transition:transform .5s}#wd2-venues-root .wdvs-card.wdvs-live:focus-visible{outline:none;box-shadow:0 0 0 3px #ebfc72}\
#wd2-venues-root .wdvs-card.wdvs-soon{cursor:default;opacity:.82}\
#wd2-venues-root .wdvs-card>*{flex-shrink:0}\
#wd2-venues-root .wdvs-card-imgwrap{position:relative;width:100%;height:0;padding-top:75%;overflow:hidden;background:linear-gradient(135deg,var(--sage) 0%,var(--sage-dark) 100%)}\
#wd2-venues-root .wdvs-mark{position:absolute;right:8px;bottom:8px;width:30px;height:auto;max-width:none;margin:0;opacity:.85;filter:drop-shadow(0 1px 3px rgba(0,0,0,.6));pointer-events:none;z-index:1}\
#wd2-venues-root .wdvs-card-img{position:absolute;top:0;left:0;width:100%;height:100%;max-width:none;max-height:none;margin:0;object-fit:cover;display:block}\
#wd2-venues-root .wdvs-card-img-fallback{position:absolute;inset:0;background:linear-gradient(135deg,var(--sage) 0%,var(--sage-dark) 100%);display:flex;align-items:center;justify-content:center;font-family:"Sansita",Georgia,serif;font-size:34px;color:#fff;opacity:.85}\
#wd2-venues-root .wdvs-card-body{padding:16px 16px 18px;display:flex;flex-direction:column;gap:8px;flex:1}\
#wd2-venues-root .wdvs-card-name{font-family:"Sansita",Georgia,serif;font-weight:500;font-size:19px;margin:0;color:var(--sage-dark)}\
#wd2-venues-root .wdvs-card-county{font-size:12.5px;color:#9a9484;letter-spacing:.02em}\
#wd2-venues-root .wdvs-tagrow{display:flex;flex-wrap:wrap;gap:6px;margin-top:2px}\
#wd2-venues-root .wdvs-tag{font-size:11px;padding:4px 9px;border-radius:999px;font-weight:600;letter-spacing:.02em;color:#f4f3e8!important;background:rgba(244,243,232,.1)!important;border:1px solid rgba(244,243,232,.3);-webkit-backdrop-filter:blur(10px) saturate(140%);backdrop-filter:blur(10px) saturate(140%);box-shadow:inset 0 1px 0 rgba(255,255,255,.1);white-space:nowrap}\
#wd2-venues-root .wdvs-tag-cap{border-color:rgba(235,252,114,.55)}\
#wd2-venues-root .wdvs-tag-sitdown{background:#f3e6e2;color:#9a5646}\
#wd2-venues-root .wdvs-tag-casual{background:#e9eef5;color:#3f5c80}\
#wd2-venues-root .wdvs-tag-both{background:#f6ecd9;color:#8a6a2d}\
@media (max-width:640px){#wd2-venues-root .wdvs-card-imgwrap{padding-top:52%}#wd2-venues-root .wdvs-card-body{display:grid;grid-template-columns:minmax(0,1fr) auto;column-gap:12px;row-gap:4px;padding:12px 14px 14px}#wd2-venues-root .wdvs-card-name,#wd2-venues-root .wdvs-card-county,#wd2-venues-root .wdvs-view,#wd2-venues-root .wdvs-soon-badge{grid-column:1}#wd2-venues-root .wdvs-tagrow{grid-column:2;grid-row:1/span 3;flex-direction:column;align-items:flex-end;justify-content:center;margin:0}#wd2-venues-root .wdvs-grid{gap:14px}}\
#wd2-venues-root .wdvs-soon-badge{margin-top:auto;font-size:12px;font-weight:600;color:var(--brass);letter-spacing:.04em;text-transform:uppercase;padding-top:6px}\
#wd2-venues-root .wdvs-view{margin-top:auto;font-size:12.5px;font-weight:600;color:var(--sage);letter-spacing:.03em}\
#wd2-venues-root .wdvs-empty{max-width:1600px;margin:40px auto;text-align:center;padding:40px 20px;color:#9a9484;font-size:15px}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  root.innerHTML = '<style>@keyframes wd2Shim{0%{background-position:-400px 0}100%{background-position:400px 0}}.wd2-sk{background:#344634 linear-gradient(90deg,rgba(244,243,232,0) 0,rgba(244,243,232,.07) 50%,rgba(244,243,232,0) 100%) no-repeat;background-size:400px 100%;animation:wd2Shim 1.3s ease-in-out infinite;border-radius:14px}@media (prefers-reduced-motion:reduce){.wd2-sk{animation:none}}</style><div style="display:grid;gap:12px"><div class="wd2-sk" style="height:46px;border-radius:999px"></div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px"><div class="wd2-sk" style="aspect-ratio:3/4"></div><div class="wd2-sk" style="aspect-ratio:3/4"></div><div class="wd2-sk" style="aspect-ratio:3/4"></div><div class="wd2-sk" style="aspect-ratio:3/4"></div></div></div>';

  fetch(DATA_URL, { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (DATA) {
      var VENUES = DATA.venues.map(function (v) {
        var pic = v.cardImg || v.heroImg;
        return {
          name: v.name,
          county: v.location || v.county,
          capacity: Number(v.capacity) || 0,
          foodStyle: v.foodStyle,
          live: !!(v.live && v.url),
          url: v.url,
          img: pic ? (/^https?:/.test(pic) ? pic : DATA.imageBase + pic + '?format=500w') : ''
        };
      });
      build(VENUES);
    })
    .catch(function () {
      root.innerHTML = '<div class="wdvs-empty">Venues could not be loaded. Please refresh the page.</div>';
    });

  function build(VENUES) {
    var counties = Array.from(new Set(VENUES.map(function (v) { return v.county; }))).sort();
    var maxCapacity = Math.max.apply(null, VENUES.map(function (v) { return v.capacity; }).concat([50]));

    root.innerHTML = '\
      <img class="wdvs-watermark" src="' + WATERMARK_LOGO_URL + '" alt="" aria-hidden="true" onerror="this.style.display=\'none\'" />\
      <div class="wdvs-head">\
        <div class="wdvs-eyebrow">Find Your Venue</div>\
        <h2 class="wdvs-title">Search Orcha Events Venues</h2>\
        <p class="wdvs-sub">Filter by location, guest capacity and dining style to find the right fit.</p>\
      </div>\
      <div class="wdvs-filters">\
        <div class="wdvs-field">\
          <label for="wdvs-search">Search by name</label>\
          <input type="text" id="wdvs-search" placeholder="e.g. Dame Tavern" />\
        </div>\
        <div class="wdvs-field">\
          <label for="wdvs-county">Location</label>\
          <select id="wdvs-county"><option value="">All locations</option>' +
            counties.map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + '</option>'; }).join('') + '</select>\
        </div>\
        <div class="wdvs-field">\
          <label for="wdvs-capacity">Minimum guest capacity</label>\
          <div class="wdvs-capacity-row">\
            <input type="range" id="wdvs-capacity" min="0" max="' + maxCapacity + '" step="10" value="0" />\
            <span class="wdvs-capacity-val" id="wdvs-capacity-val">Any</span>\
          </div>\
        </div>\
        <div class="wdvs-field" style="grid-column: 1 / -1;">\
          <label>Dining style</label>\
          <div class="wdvs-chiprow" id="wdvs-food-chips">\
            <button type="button" class="wdvs-chip" data-food="" aria-pressed="true">All</button>\
            <button type="button" class="wdvs-chip" data-food="sitdown" aria-pressed="false">Sit-down</button>\
            <button type="button" class="wdvs-chip" data-food="casual" aria-pressed="false">Casual</button>\
            <button type="button" class="wdvs-chip" data-food="both" aria-pressed="false">Both</button>\
          </div>\
        </div>\
      </div>\
      <div class="wdvs-reset"><button type="button" id="wdvs-reset-btn">Reset filters</button></div>\
      <div class="wdvs-count" id="wdvs-count"></div>\
      <div class="wdvs-grid" id="wdvs-grid"></div>\
      <div class="wdvs-empty" id="wdvs-empty" style="display:none;">No venues match those filters yet. Try widening your search.</div>';

    var els = {
      search: root.querySelector('#wdvs-search'),
      county: root.querySelector('#wdvs-county'),
      capacity: root.querySelector('#wdvs-capacity'),
      capacityVal: root.querySelector('#wdvs-capacity-val'),
      chips: Array.prototype.slice.call(root.querySelectorAll('#wdvs-food-chips .wdvs-chip')),
      grid: root.querySelector('#wdvs-grid'),
      empty: root.querySelector('#wdvs-empty'),
      count: root.querySelector('#wdvs-count'),
      reset: root.querySelector('#wdvs-reset-btn')
    };
    var state = { search: '', county: '', minCapacity: 0, food: '' };
    var foodLabel = { sitdown: 'Sit-down', casual: 'Casual', both: 'Sit-down & Casual' };
    var foodTagClass = { sitdown: 'wdvs-tag-sitdown', casual: 'wdvs-tag-casual', both: 'wdvs-tag-both' };

    function matchesFood(venueFood, filter) {
      if (!filter) return true;
      if (filter === 'both') return venueFood === 'both';
      return venueFood === filter || venueFood === 'both';
    }

    function render() {
      var q = state.search.trim().toLowerCase();
      var results = VENUES.filter(function (v) {
        return (!q || v.name.toLowerCase().indexOf(q) !== -1) &&
          (!state.county || v.county === state.county) &&
          (v.capacity >= state.minCapacity) &&
          matchesFood(v.foodStyle, state.food);
      });
      els.count.textContent = results.length + ' venue' + (results.length === 1 ? '' : 's') + ' found';
      els.empty.style.display = results.length ? 'none' : 'block';
      els.grid.innerHTML = results.map(function (v) {
        var imgBlock = '<div class="wdvs-card-imgwrap">' + (v.img
          ? '<img class="wdvs-card-img" src="' + esc(v.img) + '" alt="' + esc(v.name) + '" loading="lazy" onerror="this.outerHTML=\'<div class=&quot;wdvs-card-img-fallback&quot;>' + esc(v.name.charAt(0)) + '</div>\'" />'
          : '<div class="wdvs-card-img-fallback">' + esc(v.name.charAt(0)) + '</div>') + (v.img ? WD2_MARK_TAG : '') + '</div>';
        var inner = imgBlock +
          '<div class="wdvs-card-body">' +
            '<h3 class="wdvs-card-name">' + esc(v.name) + '</h3>' +
            '<div class="wdvs-card-county">' + esc(v.county) + '</div>' +
            '<div class="wdvs-tagrow">' +
              '<span class="wdvs-tag wdvs-tag-cap">Up to ' + v.capacity + ' guests</span>' +
              '<span class="wdvs-tag ' + (foodTagClass[v.foodStyle] || '') + '">' + esc(foodLabel[v.foodStyle] || v.foodStyle) + '</span>' +
            '</div>' +
            (v.live ? '<span class="wdvs-view">View venue →</span>' : '<span class="wdvs-soon-badge">Page coming soon</span>') +
          '</div>';
        return v.live
          ? '<a class="wdvs-card wdvs-live" href="' + esc(v.url) + '">' + inner + '</a>'
          : '<div class="wdvs-card wdvs-soon">' + inner + '</div>';
      }).join('');
    }

    els.search.addEventListener('input', function (e) { state.search = e.target.value; render(); });
    els.county.addEventListener('change', function (e) { state.county = e.target.value; render(); });
    els.capacity.addEventListener('input', function (e) {
      state.minCapacity = Number(e.target.value);
      els.capacityVal.textContent = state.minCapacity === 0 ? 'Any' : state.minCapacity + '+';
      render();
    });
    els.chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        els.chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
        chip.setAttribute('aria-pressed', 'true');
        state.food = chip.getAttribute('data-food');
        render();
      });
    });
    els.reset.addEventListener('click', function () {
      state = { search: '', county: '', minCapacity: 0, food: '' };
      els.search.value = ''; els.county.value = ''; els.capacity.value = 0;
      els.capacityVal.textContent = 'Any';
      els.chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-food') === '' ? 'true' : 'false'); });
      render();
    });

    render();
  }
})();
