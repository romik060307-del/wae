/* WA Cloning RK v1.8 - conservative phone layout adapter.
 * Keep WhatsApp's own message/composer DOM intact; only switch outer panes.
 */
(function () {
  'use strict';
  try {
    var W = window;
    var D = document;
    if (typeof W.__rkForceMode === 'undefined') W.__rkForceMode = null;
    var lastNotifiedMode = null;

    var viewport = D.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = D.createElement('meta');
      viewport.name = 'viewport';
      (D.head || D.documentElement).appendChild(viewport);
    }
    viewport.setAttribute('content', 'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover');

    // Remove old injected styles if the page survived a WebView restore.
    try { Array.prototype.forEach.call(D.querySelectorAll('style[id^=\"rk-phone-layout-v\"]'), function (oldStyle) { if (oldStyle.id !== 'rk-phone-layout-v18') oldStyle.remove(); }); } catch (ignore) { }
    var styleId = 'rk-phone-layout-v18';
    var style = D.getElementById(styleId);
    if (!style) {
      style = D.createElement('style');
      style.id = styleId;
      (D.head || D.documentElement).appendChild(style);
    }
    style.textContent = [
      /* Do not lock the document's vertical scroll globally; WhatsApp owns inner scrollers. */
      'html,body{width:100%!important;min-width:0!important;max-width:100%!important;min-height:100%!important;margin:0!important;padding:0!important;overflow-x:hidden!important;}',
      'html.rk-phone-active{--navbar-width:0px!important;}',
      '#app,.app-wrapper-web{box-sizing:border-box!important;width:100%!important;min-width:0!important;max-width:100%!important;height:100%!important;min-height:0!important;max-height:100%!important;margin:0!important;}',
      '.rk-phone-root{box-sizing:border-box!important;position:relative!important;display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;align-items:stretch!important;width:100%!important;min-width:0!important;max-width:100%!important;height:100%!important;min-height:0!important;max-height:100%!important;margin:0!important;left:0!important;right:0!important;transform:none!important;overflow:hidden!important;}',
      '.rk-phone-root>.rk-phone-side-slot,.rk-phone-root>.rk-phone-main-slot{box-sizing:border-box!important;flex:0 0 100%!important;width:100%!important;min-width:0!important;max-width:100%!important;height:100%!important;min-height:0!important;max-height:100%!important;margin:0!important;transform:none!important;}',
      '.rk-phone-root.rk-phone-list>.rk-phone-main-slot{display:none!important;}',
      '.rk-phone-root.rk-phone-chat>.rk-phone-side-slot,.rk-phone-root.rk-phone-panel>.rk-phone-side-slot{display:none!important;}',
      '.rk-phone-root .rk-phone-nav-rail{display:none!important;width:0!important;min-width:0!important;max-width:0!important;flex:0 0 0!important;margin:0!important;padding:0!important;border:0!important;overflow:hidden!important;}',
      /* Avoid setting display:flex or overflow:hidden on WhatsApp's internal pane wrappers. */
      '#side,#main{box-sizing:border-box!important;min-width:0!important;max-width:100%!important;width:100%!important;height:100%!important;min-height:0!important;}',
      '#pane-side{min-width:0!important;max-width:100%!important;min-height:0!important;overflow-x:hidden!important;overflow-y:auto!important;overscroll-behavior:contain!important;-webkit-overflow-scrolling:touch!important;}',
      '#main [data-testid*=\"conversation-panel-messages\"]{min-height:0!important;overscroll-behavior:contain!important;-webkit-overflow-scrolling:touch!important;}',
      '#main footer [contenteditable=\"true\"],#main [data-testid=\"conversation-compose-box-input\"]{font-size:16px!important;}',
      '#main [data-testid=\"conversation-compose-box-input\"],[contenteditable=\"true\"]{max-width:100%!important;}',
      '@media (max-width:760px){.app-wrapper-web{top:0!important;}}',
      /* The QR/link screen is allowed to use normal document flow and vertical scrolling. */
      'html.rk-login-active{width:100%!important;min-width:0!important;max-width:100%!important;height:auto!important;min-height:100%!important;max-height:none!important;overflow-x:hidden!important;overflow-y:auto!important;margin:0!important;padding:0!important;}',
      'html.rk-login-active body{width:100%!important;min-width:0!important;max-width:100%!important;height:auto!important;min-height:100vh!important;max-height:none!important;overflow-x:hidden!important;overflow-y:auto!important;margin:0!important;padding:0!important;}',
      'html.rk-login-active #app,html.rk-login-active #app>div,html.rk-login-active .app-wrapper-web,html.rk-login-active .landing-wrapper,html.rk-login-active .landing-main{box-sizing:border-box!important;width:100%!important;min-width:0!important;max-width:100%!important;height:auto!important;min-height:100%!important;max-height:none!important;margin-left:auto!important;margin-right:auto!important;overflow:visible!important;position:relative!important;left:auto!important;right:auto!important;transform:none!important;}',
      'html.rk-login-active #app *{box-sizing:border-box!important;min-width:0!important;}',
      'html.rk-login-active #app .rk-login-fit{min-width:0!important;max-width:100vw!important;}',
      'html.rk-login-active #app .rk-login-too-wide{width:100%!important;min-width:0!important;max-width:100vw!important;flex-shrink:1!important;}',
      'html.rk-login-active #app .rk-login-stack{flex-direction:column!important;align-items:center!important;justify-content:flex-start!important;gap:14px!important;}',
      'html.rk-login-active #app .rk-login-qr-code{display:block!important;width:var(--rk-login-qr-size,240px)!important;height:var(--rk-login-qr-size,240px)!important;max-width:78vw!important;max-height:78vw!important;object-fit:contain!important;flex:0 0 auto!important;margin:12px auto!important;}',
      'html.rk-login-active #app .rk-login-qr-wrap{width:auto!important;min-width:0!important;max-width:86vw!important;height:auto!important;max-height:none!important;overflow:visible!important;margin-left:auto!important;margin-right:auto!important;flex:0 1 auto!important;}',
      'html.rk-login-active #app [data-testid*=\"qr\"],html.rk-login-active #app [aria-label*=\"QR\"]{width:auto!important;min-width:0!important;max-width:86vw!important;margin-left:auto!important;margin-right:auto!important;}',
      'html.rk-login-active #app button,html.rk-login-active #app a{max-width:100%!important;}'
    ].join('\n');

    function first(selectors) {
      for (var i = 0; i < selectors.length; i++) {
        try {
          var found = D.querySelector(selectors[i]);
          if (found) return found;
        } catch (ignore) { }
      }
      return null;
    }

    function directChildOf(node, ancestor) {
      if (!node || !ancestor) return null;
      var current = node;
      while (current && current.parentElement && current.parentElement !== ancestor) {
        current = current.parentElement;
      }
      return current && current.parentElement === ancestor ? current : null;
    }

    function resolvePanes() {
      var side = first(['#side', '#pane-side', '[data-testid="chat-list"]']);
      var main = first(['#main', '[data-testid="conversation-panel-wrapper"]']);
      var root = (side && side.closest && side.closest('div.two')) ||
        (main && main.closest && main.closest('div.two')) ||
        first(['#app .app-wrapper-web .app.two', '#app .two', 'div.two']);
      if (!root) root = first(['#app .app-wrapper-web .app', '#app .app-wrapper-web', '#app']);
      if (root) root.classList.add('rk-phone-root');

      var sideSlot = directChildOf(side, root) || side;
      var mainSlot = directChildOf(main, root) || main;
      if (sideSlot) sideSlot.classList.add('rk-phone-side-slot');
      if (mainSlot) mainSlot.classList.add('rk-phone-main-slot');

      // v1.9: never tag the chat-list header itself as the rail. Only a root-level element that
      // holds the icon buttons (and neither pane) may be hidden as the desktop navigation rail.
      var NAV_BTN = 'button,[role="button"],[aria-label]';
      var rail = null;
      var tagged = D.querySelector('.rk-phone-nav-rail');
      if (tagged && root && root.contains(tagged) && tagged !== sideSlot && tagged !== mainSlot) rail = tagged;
      var railAnchor = first(['header[data-testid="chatlist-header"]']);
      var viaAnchor = directChildOf(railAnchor, root);
      if (!rail) {
        var pool = [];
        if (viaAnchor) pool.push(viaAnchor);
        var kids = (root && root.children) || [];
        for (var c = 0; c < kids.length; c++) pool.push(kids[c]);
        for (var p = 0; p < pool.length && !rail; p++) {
          var cand = pool[p];
          if (!cand || cand === sideSlot || cand === mainSlot) continue;
          if (cand.contains(sideSlot) || cand.contains(mainSlot)) continue;
          var btnCount = cand.querySelectorAll ? cand.querySelectorAll(NAV_BTN).length : 0;
          var box = cand.getBoundingClientRect ? cand.getBoundingClientRect() : null;
          if (btnCount >= 4 && box && box.width > 0 && box.width <= 150) rail = cand;
        }
      }
      if (!rail && viaAnchor && viaAnchor !== sideSlot && viaAnchor !== mainSlot &&
          !viaAnchor.contains(sideSlot) && !viaAnchor.contains(mainSlot)) rail = viaAnchor;
      if (rail && rail !== sideSlot && rail !== mainSlot) rail.classList.add('rk-phone-nav-rail');

      return { root: root, side: side, main: main, sideSlot: sideSlot, mainSlot: mainSlot, rail: rail };
    }

    function hasLoginQrScreen() {
      var side = first(['#side', '#pane-side', '[data-testid="chat-list"]']);
      if (side) return false;
      var main = first(['#main', '[data-testid="conversation-panel-wrapper"]']);
      var qr = first([
        'canvas', 'img[alt*="QR"]', 'svg[aria-label*="QR"]',
        '[data-testid*="qrcode"]', '[data-testid*="qr-code"]',
        '[aria-label*="QR"]', '[data-ref] canvas'
      ]);
      if (!qr) return false;
      var text = ((D.body && D.body.innerText) || '').toLowerCase().slice(0, 9000);
      var loginWords = /scan the qr code|scan this qr code|scan qr code|link with phone number|link a device|pindai kode qr|pindai qr|tautkan perangkat|pindai untuk menautkan|scan to link/.test(text);
      return !main || loginWords;
    }

    function resetPhoneLayoutClasses() {
      try {
        D.documentElement.classList.remove('rk-phone-active');
        var stale = D.querySelectorAll('.rk-phone-root,.rk-phone-side-slot,.rk-phone-main-slot,.rk-phone-nav-rail,.rk-login-fit,.rk-login-too-wide,.rk-login-stack,.rk-login-qr-code,.rk-login-qr-wrap');
        for (var i = 0; i < stale.length; i++) {
          stale[i].classList.remove('rk-phone-root','rk-phone-side-slot','rk-phone-main-slot','rk-phone-nav-rail','rk-phone-list','rk-phone-chat','rk-phone-panel','rk-login-fit','rk-login-too-wide','rk-login-stack','rk-login-qr-code','rk-login-qr-wrap');
        }
      } catch (ignore) { }
    }

    function clearLoginQrLayout() {
      try {
        D.documentElement.classList.remove('rk-login-active');
        D.documentElement.style.removeProperty('--rk-login-qr-size');
        if (D.body) D.body.classList.remove('rk-login-body');
        var nodes = D.querySelectorAll('.rk-login-fit,.rk-login-too-wide,.rk-login-stack,.rk-login-qr-code,.rk-login-qr-wrap');
        for (var i = 0; i < nodes.length; i++) nodes[i].classList.remove('rk-login-fit','rk-login-too-wide','rk-login-stack','rk-login-qr-code','rk-login-qr-wrap');
      } catch (ignore) { }
    }

    function prepareLoginQrScreen() {
      try {
        resetPhoneLayoutClasses();
        D.documentElement.classList.add('rk-login-active');
        var width = Math.min(W.innerWidth || D.documentElement.clientWidth || 360,
          D.documentElement.clientWidth || W.innerWidth || 360);
        var height = W.innerHeight || D.documentElement.clientHeight || 640;
        var qrSize = Math.round(Math.max(150, Math.min(264, width * 0.72, height * 0.44)));
        D.documentElement.style.setProperty('--rk-login-qr-size', qrSize + 'px');

        var app = first(['#app']) || D.body;
        var qr = first([
          'canvas', 'img[alt*="QR"]', 'svg[aria-label*="QR"]',
          '[data-testid*="qrcode"]', '[data-testid*="qr-code"]',
          '[aria-label*="QR"]', '[data-ref] canvas'
        ]);
        if (qr) {
          qr.classList.add('rk-login-qr-code');
          var node = qr;
          var depth = 0;
          var stacked = 0;
          while (node && node !== app && depth < 10) {
            if (node.classList) node.classList.add('rk-login-fit');
            var rect = node.getBoundingClientRect ? node.getBoundingClientRect() : null;
            if (rect && rect.width > width + 6 && node.classList) node.classList.add('rk-login-too-wide');
            if (node !== qr && node.tagName === 'DIV' && node.classList) {
              node.classList.add('rk-login-qr-wrap');
              var computed = W.getComputedStyle ? W.getComputedStyle(node) : null;
              if (computed && computed.display.indexOf('flex') === 0 && computed.flexDirection === 'row' && rect && rect.width > width * 0.8 && stacked < 2) {
                node.classList.add('rk-login-stack');
                stacked++;
              }
            }
            node = node.parentElement;
            depth++;
          }
        }
        if (D.body) D.body.classList.add('rk-login-body');
      } catch (ignore) { }
    }

    function isNarrowPhone() {
      var widths = [W.innerWidth, D.documentElement && D.documentElement.clientWidth,
        W.screen && W.screen.width].filter(function (n) { return n && n > 0; });
      var heights = [W.innerHeight, W.screen && W.screen.height].filter(function (n) { return n && n > 0; });
      return widths.length > 0 && Math.min.apply(Math, widths) <= 760 &&
        (heights.length === 0 || Math.max.apply(Math, heights) >= Math.min.apply(Math, widths));
    }

    function inferMode(panes) {
      var main = panes.main;
      if (!main) return 'list';
      var text = (main.innerText || '').toLowerCase().slice(0, 3200);
      var special = !!main.querySelector('[data-testid*="status-v3-viewer"],[data-testid*="media-viewer"],[data-testid*="status-viewer"],[data-testid*="settings-view"],[data-testid*="settings-main"],[role="dialog"]');
      if (special) return 'panel';

      var composer = !!main.querySelector('footer [contenteditable="true"],[data-testid="conversation-compose-box-input"],[data-tab="10"][contenteditable="true"]');
      var header = !!main.querySelector('[data-testid="conversation-panel-header"],[data-testid="conversation-header"],[data-testid="conversation-info-header"],header');
      var intro = !!main.querySelector('#intro,[data-testid="intro"],[data-testid*="intro"]') ||
        /select a chat to start messaging|pilih chat untuk mulai mengirim pesan|start a conversation|mulai percakapan/.test(text);
      var empty = !(main.innerText || '').trim() && !main.querySelector('video,canvas');
      if (composer) return 'chat';
      if (intro || empty) return 'list';
      if (header) return 'chat';
      return 'list';
    }

    function notifyNative(mode) {
      if (mode === lastNotifiedMode) return;
      lastNotifiedMode = mode;
      try {
        if (W.WACloningApp && typeof W.WACloningApp.onPhoneScreenChanged === 'function') {
          W.WACloningApp.onPhoneScreenChanged(mode);
        }
      } catch (ignore) { }
    }

    function syncMode() {
      try {
        if (hasLoginQrScreen()) {
          prepareLoginQrScreen();
          notifyNative('login');
          return;
        }
        clearLoginQrLayout();
        var panes = resolvePanes();
        var root = panes.root;
        if (!root) return;
        if (!isNarrowPhone() || !panes.sideSlot || !panes.mainSlot) {
          root.classList.remove('rk-phone-list', 'rk-phone-chat', 'rk-phone-panel');
          D.documentElement.classList.remove('rk-phone-active');
          notifyNative('list');
          return;
        }
        D.documentElement.classList.add('rk-phone-active');
        var inferredMode = inferMode(panes);
        var mode;
        // A deliberate return-to-list must win over an old composer still present in the DOM.
        // It remains active until the user taps another chat or a native section.
        if (W.__rkForceMode === 'list') {
          mode = 'list';
        } else if (W.__rkForceMode === 'panel') {
          mode = inferredMode === 'chat' ? 'panel' : (inferredMode === 'panel' ? 'panel' : 'panel');
        } else if (W.__rkForceMode === 'chat') {
          mode = inferredMode === 'panel' ? 'panel' : 'chat';
        } else {
          mode = inferredMode;
        }
        if (mode !== 'chat' && mode !== 'panel') mode = 'list';
        root.classList.toggle('rk-phone-list', mode === 'list');
        root.classList.toggle('rk-phone-chat', mode === 'chat');
        root.classList.toggle('rk-phone-panel', mode === 'panel');
        notifyNative(mode);
      } catch (ignore) { }
    }


    /* ===== v1.9: bottom bar -> original WhatsApp Web sidebar =====
       Strategy (most to least reliable):
       1. aria-label / title / <title> text, in English and Indonesian (exact or "starts with").
       2. data-icon on the control OR on any child (WhatsApp usually puts it on an inner span/svg).
       3. data-testid fragments.
       4. Last resort: position in the left icon rail (Chats, Calls, Status, Channels, Communities).
       Class names are never used, because WhatsApp rotates them. */
    var NAV_SPECS = {
      chats:       { terms: ['chats', 'chat', 'pesan', 'obrolan'], icons: ['chats', 'chat'] },
      calls:       { terms: ['calls', 'call', 'panggilan', 'telepon'], icons: ['calls', 'call', 'phone'] },
      status:      { terms: ['status', 'updates', 'pembaruan'], icons: ['status', 'updates'] },
      channels:    { terms: ['channels', 'channel', 'saluran'], icons: ['channels', 'channel', 'newsletter'] },
      communities: { terms: ['communities', 'community', 'komunitas'], icons: ['communities', 'community'] },
      business:    { terms: ['business tools', 'alat bisnis', 'catalog', 'katalog'], icons: ['business', 'catalog', 'shop', 'storefront'] },
      advertise:   { terms: ['advertise', 'ads', 'iklan'], icons: ['ads', 'advertise', 'megaphone', 'campaign'] },
      media:       { terms: ['media', 'links', 'documents', 'tautan', 'dokumen'], icons: ['media', 'gallery'] },
      settings:    { terms: ['settings', 'pengaturan', 'setelan'], icons: ['settings', 'gear'] },
      profile:     { terms: ['profile', 'profil'], icons: ['profile', 'avatar', 'default-user'] }
    };
    var NAV_ORDER = ['chats', 'calls', 'status', 'channels', 'communities'];
    var NAV_CLICKABLE = 'button,[role="button"],a,[data-navbar-item]';
    var NAV_CANDIDATES = NAV_CLICKABLE + ',[tabindex],[aria-label],[title],[data-icon],[data-testid]';
    var NAV_CONTENT = '#pane-side,#main,footer,[role="dialog"],[role="row"],[role="listitem"],[role="gridcell"],[data-testid="chat-list"],.rk-native-bottom-nav';

    function lc(v) { return (v === null || v === undefined ? '' : String(v)).toLowerCase().replace(/\s+/g, ' ').trim(); }

    function isNavClickable(el) {
      try { return !!(el.matches && el.matches(NAV_CLICKABLE)); } catch (e) { return false; }
    }

    function navLabels(el) {
      var out = [];
      function push(v) { v = lc(v); if (v && out.indexOf(v) < 0) out.push(v); }
      try {
        push(el.getAttribute('aria-label'));
        push(el.getAttribute('title'));
        var kids = el.querySelectorAll('[aria-label],[title],svg title,img[alt]');
        for (var i = 0; i < kids.length && i < 6; i++) {
          var k = kids[i];
          var tag = (k.tagName || '').toLowerCase();
          if (tag === 'title') push(k.textContent);
          else if (tag === 'img') push(k.getAttribute('alt'));
          else { push(k.getAttribute('aria-label')); push(k.getAttribute('title')); }
        }
        // Visible text only counts on real controls; a heading such as <h1>Chats</h1> inside a header must not match.
        var text = el.textContent || '';
        if (isNavClickable(el) && text.length <= 40) push(text);
      } catch (ignore) { }
      return out;
    }

    function navIcons(el) {
      var out = [];
      try {
        var own = el.getAttribute('data-icon');
        if (own) out.push(lc(own));
        var inner = el.querySelectorAll('[data-icon]');
        for (var i = 0; i < inner.length && i < 4; i++) out.push(lc(inner[i].getAttribute('data-icon')));
      } catch (ignore) { }
      return out;
    }

    function scoreNav(spec, el) {
      var labels = navLabels(el), icons = navIcons(el), score = 0, i, j;
      for (i = 0; i < labels.length; i++) {
        for (j = 0; j < spec.terms.length; j++) {
          var l = labels[i], t = spec.terms[j];
          if (l === t) score = Math.max(score, 100);
          else if (l.indexOf(t) === 0 && !/[a-z0-9]/.test(l.charAt(t.length))) score = Math.max(score, 85);
        }
      }
      for (i = 0; i < icons.length; i++) {
        var lead = icons[i].split(/[^a-z0-9]+/)[0];
        if (spec.icons.indexOf(icons[i]) >= 0 || spec.icons.indexOf(lead) >= 0) score = Math.max(score, 75);
      }
      if (!score && isNavClickable(el)) {
        var tid = lc(el.getAttribute('data-testid'));
        if (tid) {
          for (j = 0; j < spec.terms.length; j++) {
            if (tid.indexOf(spec.terms[j].replace(/ /g, '-')) >= 0) { score = 40; break; }
          }
        }
      }
      if (score) {
        if (el.hasAttribute && el.hasAttribute('data-navbar-item')) score += 30;
        else if (el.closest && el.closest('nav,[role="navigation"],aside,[data-navbar-item]')) score += 15;
      }
      return score;
    }

    function collectNavCandidates(scope) {
      var list = [], nodes;
      try { nodes = scope.querySelectorAll(NAV_CANDIDATES); } catch (e) { return list; }
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        if (!el || el.nodeType !== 1) continue;
        if (el.closest && el.closest(NAV_CONTENT)) continue;
        var click = (el.closest && el.closest(NAV_CLICKABLE)) || el;
        if (!isNavClickable(click) && !click.hasAttribute('tabindex') &&
            !click.hasAttribute('aria-label') && !click.hasAttribute('data-icon')) continue;
        if (list.indexOf(click) >= 0) continue;
        if (click.childElementCount > 10) continue;
        list.push(click);
      }
      return list;
    }

    function findNavByOrder(name) {
      var idx = NAV_ORDER.indexOf(name);
      if (idx < 0) return null;
      var all = collectNavCandidates(D), icons = [], i;
      for (i = 0; i < all.length; i++) {
        var el = all[i];
        if (!el.querySelector || !el.querySelector('svg,[data-icon],img')) continue;
        if ((el.textContent || '').trim().length > 0) continue;
        icons.push(el);
      }
      if (icons.length < 5) return null;
      var group = null;
      for (i = 0; i < icons.length && !group; i++) {
        var node = icons[i].parentElement, depth = 0;
        while (node && depth < 6 && !group) {
          var inside = [];
          for (var k = 0; k < icons.length; k++) if (node.contains(icons[k])) inside.push(icons[k]);
          if (inside.length >= 5 && inside.length <= 14) group = inside;
          node = node.parentElement; depth++;
        }
      }
      return group && group[idx] ? group[idx] : null;
    }

    function findNavTarget(name, spec) {
      var scopes = [], rail = D.querySelector('.rk-phone-nav-rail');
      if (rail) scopes.push(rail);
      scopes.push(D);
      for (var s = 0; s < scopes.length; s++) {
        var list = collectNavCandidates(scopes[s]), best = null, bestScore = 0;
        for (var i = 0; i < list.length; i++) {
          var sc = scoreNav(spec, list[i]);
          if (sc > bestScore) { best = list[i]; bestScore = sc; }
        }
        if (best && bestScore >= 70) return best;
      }
      return findNavByOrder(name);
    }

    function fireClick(el) {
      var target = (el.closest && el.closest(NAV_CLICKABLE)) || el;
      try { if (target.focus) target.focus({ preventScroll: true }); } catch (ignore) { }
      var seq = ['pointerdown', 'mousedown', 'pointerup', 'mouseup'];
      for (var i = 0; i < seq.length; i++) {
        try {
          var Ctor = (seq[i].indexOf('pointer') === 0 && W.PointerEvent) ? W.PointerEvent : W.MouseEvent;
          target.dispatchEvent(new Ctor(seq[i], { bubbles: true, cancelable: true, view: W, button: 0 }));
        } catch (ignore) { }
      }
      target.click();
    }

    W.__rkNavSeq = 0;
    W.__rkNativeNavigate = function (name) {
      try {
        var spec = NAV_SPECS[name];
        if (!spec) return false;
        var target = findNavTarget(name, spec);
        if (!target) return false;
        fireClick(target);
        // Calls/Status/Channels/Communities/Settings render in WhatsApp's left column, so show the list pane first.
        W.__rkForceMode = 'list';
        var seq = ++W.__rkNavSeq;
        syncMode();
        scheduleSync();
        W.setTimeout(function () {
          try {
            if (seq !== W.__rkNavSeq || W.__rkForceMode !== 'list') return;
            var p = resolvePanes();
            if (p.main && inferMode(p) === 'panel') { W.__rkForceMode = 'panel'; syncMode(); }
          } catch (ignore) { }
        }, 800);
        return true;
      } catch (e) { return false; }
    };

    // Used by the app to show what the page really exposes when a menu cannot be found.
    W.__rkNavDebug = function () {
      try {
        var list = collectNavCandidates(D), out = [];
        for (var i = 0; i < list.length && out.length < 30; i++) {
          var el = list[i];
          var r = el.getBoundingClientRect ? el.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 };
          out.push((el.tagName || '?').toLowerCase() +
            ' label=' + (el.getAttribute('aria-label') || '-') +
            ' icon=' + (navIcons(el).join(',') || '-') +
            ' testid=' + (el.getAttribute('data-testid') || '-') +
            ' box=' + Math.round(r.left) + ',' + Math.round(r.top) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
        }
        return 'kandidat=' + list.length + ' rail=' + (D.querySelector('.rk-phone-nav-rail') ? 'ya' : 'tidak') +
          ' lebar=' + W.innerWidth + '\n' + out.join('\n');
      } catch (e) { return 'debug gagal: ' + e; }
    };

    W.__rkPhoneSync = syncMode;
    W.__rkReturnToList = function () {
      try {
        var panes = resolvePanes();
        if (!panes.root || !panes.sideSlot || !panes.mainSlot) return false;
        W.__rkForceMode = 'list';
        syncMode();
        return panes.root.classList.contains('rk-phone-list');
      } catch (ignore) { return false; }
    };

    function closestRow(target) {
      if (!target || !target.closest) return null;
      return target.closest(
        '#side [data-testid*="cell-frame-container"],#side [data-testid*="chat-list-item"],#side [data-testid*="cell-frame"],#side [role="gridcell"],#side [role="row"],#side [role="listitem"],' +
        '#pane-side [data-testid*="cell-frame-container"],#pane-side [role="gridcell"],#pane-side [role="row"],#pane-side [role="listitem"],' +
        '[data-testid="chat-list"] [data-testid*="cell-frame-container"],[data-testid="chat-list"] [role="gridcell"],[data-testid="chat-list"] [role="row"],[data-testid="chat-list"] [role="listitem"]'
      );
    }

    var syncTimer = null;
    var settleTimer = null;
    function scheduleSync() {
      if (syncTimer) W.clearTimeout(syncTimer);
      if (settleTimer) W.clearTimeout(settleTimer);
      syncTimer = W.setTimeout(function () { syncTimer = null; syncMode(); }, 160);
      settleTimer = W.setTimeout(function () { settleTimer = null; syncMode(); }, 620);
    }

    if (!W.__rkPhoneClickHookV18) {
      W.__rkPhoneClickHookV18 = true;
      D.addEventListener('click', function (event) {
        try {
          var target = event.target;
          if (target && target.nodeType !== 1) target = target.parentElement;
          if (!target || !target.closest) return;
          var panes = resolvePanes();

          if (panes.side && panes.side.contains(target)) {
            var blocked = target.closest('input,textarea,[contenteditable="true"],header,button,[role="button"],[data-testid*="search"],[data-testid*="filter"],[data-testid*="menu"],[aria-label*="Search"],[aria-label*="search"]');
            if (!blocked) {
              var row = closestRow(target);
              if (row) {
                var rowId = ((row.getAttribute('data-testid') || '') + ' ' + (row.getAttribute('aria-label') || '')).toLowerCase();
                W.__rkForceMode = (rowId.indexOf('status-viewer') >= 0 || rowId.indexOf('settings-view') >= 0) ? 'panel' : 'chat';
              } else {
                var rect = panes.side.getBoundingClientRect();
                var targetRect = target.getBoundingClientRect();
                var relativeY = targetRect.top + targetRect.height / 2 - rect.top;
                if (relativeY > Math.min(110, rect.height * 0.20)) W.__rkForceMode = 'chat';
              }
              scheduleSync();
            }
            return;
          }

          if (panes.main && panes.main.contains(target)) {
            var clickEl = target.closest('button,[role="button"],[aria-label],[data-testid],[data-icon]') || target;
            var meta = ((clickEl.getAttribute('aria-label') || '') + ' ' + (clickEl.getAttribute('title') || '') + ' ' +
              (clickEl.getAttribute('data-testid') || '') + ' ' + (clickEl.getAttribute('data-icon') || '') + ' ' +
              (clickEl.innerText || '')).toLowerCase();
            var inHeader = !!target.closest('#main header,[data-testid*="conversation-panel-header"],[data-testid*="conversation-header"]');
            if (inHeader && (/(^|\s)(back|go back|kembali|return|close chat)(\s|$)/.test(meta) ||
                meta.indexOf('data-icon back') >= 0 || meta.indexOf('back-button') >= 0)) {
              W.__rkForceMode = 'list';
              scheduleSync();
            }
          }
        } catch (ignore) { }
      }, true);
      W.addEventListener('resize', function () { W.setTimeout(syncMode, 150); });
      W.addEventListener('orientationchange', function () { W.setTimeout(syncMode, 250); });
    }

    if (!W.__rkPhoneObserverV18 && D.body) {
      W.__rkPhoneObserverV18 = new MutationObserver(function (records) {
        // Message-by-message DOM churn should not trigger repeated full scans of the chat tree.
        var relevant = false;
        for (var i = 0; i < records.length; i++) {
          var target = records[i].target;
          if (target && target.nodeType !== 1) target = target.parentElement;
          if (target && target.closest && target.closest('#main [data-testid*="conversation-panel-messages"],#main .copyable-area,#main footer,#main [contenteditable="true"]')) continue;
          relevant = true;
          break;
        }
        if (relevant) scheduleSync();
      });
      W.__rkPhoneObserverV18.observe(D.body, { childList: true, subtree: true });
    }

    // Cleanup any classes from earlier versions before the first layout pass.
    try { resetPhoneLayoutClasses(); } catch (ignore) { }
    W.__rkForceMode = null;
    syncMode();
    return 'ok';
  } catch (ignore) {
    return 'ignored';
  }
})();
