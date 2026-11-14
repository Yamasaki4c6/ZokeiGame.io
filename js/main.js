(function () {
  "use strict";

  var config = window.SITE_CONFIG || {};
  var games = window.GAMES || [];
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- 共通リンク(X・フォーム・メール) ---------- */
  document.querySelectorAll("[data-link]").forEach(function (el) {
    var key = el.getAttribute("data-link");
    var value = config[key];
    if (!value) return;
    if (key === "contactEmail") {
      el.href = "mailto:" + value;
      var item = el.closest(".contact-item");
      if (item) item.hidden = false;
    } else {
      el.href = value;
    }
  });

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- ヘッダー ---------- */
  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var backToTop = document.querySelector(".back-to-top");

  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 40);
    if (backToTop) backToTop.classList.toggle("is-visible", y > window.innerHeight * 0.8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setNav(open) {
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  }
  navToggle.addEventListener("click", function () {
    setNav(navToggle.getAttribute("aria-expanded") !== "true");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setNav(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) setNav(false);
  });

  /* ---------- 作品カード ---------- */
  var grid = document.getElementById("game-grid");
  var stat = document.getElementById("stat-games");
  if (stat) stat.innerHTML = games.length + "<small>本</small>";

  function gameUrl(g) {
    return g.url ? g.url : "games/coming-soon.html?id=" + encodeURIComponent(g.id);
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function tagList(tags) {
    var ul = el("ul", "tags");
    (tags || []).forEach(function (t) { ul.appendChild(el("li", null, t)); });
    return ul;
  }

  function meta(g) {
    return [g.genre, g.year, g.platform].filter(Boolean).join(" / ");
  }

  /* ---------- オープニング ---------- */
  var intro = document.getElementById("intro");
  if (intro) {
    // 0.3秒後にサークル名がフェードイン(CSS)→ 2.6秒後に黒幕が消える
    setTimeout(function () {
      intro.classList.add("is-done");
      document.documentElement.classList.remove("is-intro");
      setTimeout(function () { intro.remove(); }, 1000);
    }, 2600);
  }

  /* ---------- ヒーロー(5秒ごとに切り替え) ---------- */
  var slidesEl = document.getElementById("hero-slides");
  var dotsEl = document.getElementById("hero-dots");
  var captionEl = document.getElementById("hero-caption");
  var toggle = document.getElementById("hero-toggle");
  var slidesData = config.heroSlides || [];
  var interval = config.heroInterval || 5000;
  var saveData = navigator.connection && navigator.connection.saveData;
  var slides = [];
  var current = -1;
  var timer = null;
  var paused = reduceMotion.matches; // 動きを減らす設定の人には自動再生しない

  slidesData.forEach(function (d, i) {
    var wrap = el("div", "hero__slide");
    if (d.image) {
      var img = el("img");
      img.src = d.image; img.alt = "";
      if (i > 0) img.loading = "lazy";
      wrap.appendChild(img);
    }
    var v = null;
    if (d.video && !saveData) {
      v = el("video");
      v.muted = true; v.playsInline = true; v.loop = true;
      v.preload = i === 0 ? "auto" : "metadata";
      v.src = d.video;
      v.setAttribute("aria-hidden", "true");
      v.addEventListener("playing", function () { v.classList.add("is-ready"); });
      wrap.appendChild(v);
    }
    slidesEl.appendChild(wrap);

    var li = el("li");
    var b = el("button", "hero__dot");
    b.type = "button";
    b.setAttribute("aria-label", d.title + " を表示");
    b.style.setProperty("--duration", interval + "ms");
    b.addEventListener("click", function () { show(i); restart(); });
    li.appendChild(b);
    dotsEl.appendChild(li);
    slides.push({ el: wrap, video: v, dot: b, title: d.title });
  });
  if (slides.length < 2) dotsEl.hidden = true;

  function show(i) {
    if (i === current || !slides[i]) return;
    var prev = slides[current];
    if (prev) {
      prev.el.classList.remove("is-active");
      prev.dot.classList.remove("is-active");
      prev.dot.removeAttribute("aria-current");
      if (prev.video) setTimeout(function () { prev.video.pause(); }, 1200);
    }
    current = i;
    var s = slides[i];
    s.el.classList.add("is-active");
    // アニメーションをリセットしてからプログレスバーを再開
    s.dot.classList.remove("is-active"); void s.dot.offsetWidth; s.dot.classList.add("is-active");
    s.dot.setAttribute("aria-current", "true");
    captionEl.classList.remove("is-in"); void captionEl.offsetWidth;
    captionEl.textContent = s.title || "";
    captionEl.classList.add("is-in");
    if (s.video) {
      try { s.video.currentTime = 0; } catch (e) {}
      if (!paused) s.video.play().catch(function () {});
    }
  }
  function next() { show((current + 1) % slides.length); }
  function restart() {
    clearInterval(timer);
    if (!paused && slides.length > 1) timer = setInterval(next, interval);
  }
  function setPaused(p) {
    paused = p;
    document.querySelector(".hero").classList.toggle("is-paused", p);
    toggle.classList.toggle("is-paused", p);
    toggle.setAttribute("aria-label", p ? "スライドを再生" : "スライドを一時停止");
    var s = slides[current];
    if (s && s.video) { if (p) s.video.pause(); else s.video.play().catch(function () {}); }
    restart();
  }
  toggle.addEventListener("click", function () { setPaused(!paused); });

  if (slides.length) {
    show(0);
    setPaused(paused);
  } else {
    toggle.hidden = true;
  }

  // 画面外では止めて負荷を下げる
  if ("IntersectionObserver" in window && slides.length) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (paused) return;
        var s = slides[current];
        if (en.isIntersecting) { if (s.video) s.video.play().catch(function () {}); restart(); }
        else { if (s.video) s.video.pause(); clearInterval(timer); }
      });
    }).observe(slidesEl);
  }

  /* ---------- News ---------- */
  var newsList = document.getElementById("news-list");
  (window.NEWS || []).slice(0, 3).forEach(function (n) {
    var li = el("li", "news-item");
    var inner = el(n.url ? "a" : "div", "news-item__inner");
    if (n.url) {
      inner.href = n.url;
      if (/^https?:/.test(n.url)) { inner.target = "_blank"; inner.rel = "noopener"; }
    }
    var time = el("time", "news-item__date", n.date);
    time.dateTime = String(n.date).replace(/\./g, "-");
    inner.appendChild(time);
    if (n.category) inner.appendChild(el("span", "news-item__cat", n.category));
    inner.appendChild(el("span", "news-item__title", n.title));
    li.appendChild(inner);
    newsList.appendChild(li);
  });

  function renderCard(g) {
    var li = el("li", "game-card");
    li.dataset.genre = g.genre || "";

    var a = el("a", "game-card__link");
    a.href = gameUrl(g);
    a.setAttribute("aria-describedby", "desc-" + g.id);

    var fig = el("div", "game-card__thumb");
    var img = el("img");
    img.src = g.thumbnail;
    img.alt = "";
    img.loading = "lazy";
    img.width = 640; img.height = 360;
    fig.appendChild(img);
    if (g.video) {
      // PC でカーソルを合わせたときにだけ動画を読み込んで再生
      var v = el("video", "game-card__video");
      v.muted = true; v.loop = true; v.playsInline = true; v.preload = "none";
      v.setAttribute("aria-hidden", "true");
      fig.appendChild(v);
      li.addEventListener("mouseenter", function () {
        if (!canHover.matches || reduceMotion.matches) return;
        if (!v.src) v.src = g.video;
        v.play().then(function () { v.classList.add("is-playing"); }).catch(function () {});
      });
      li.addEventListener("mouseleave", function () {
        v.pause(); v.classList.remove("is-playing");
      });
    }
    a.appendChild(fig);

    var body = el("div", "game-card__body");
    body.appendChild(el("h3", "game-card__title", g.title));
    body.appendChild(el("p", "game-card__meta", meta(g)));
    a.appendChild(body);

    // PC でホバーしたときに出るポップアップ
    var pop = el("div", "game-card__popup");
    pop.id = "desc-" + g.id;
    pop.appendChild(el("h3", "game-card__title", g.title));
    pop.appendChild(el("p", "game-card__meta", meta(g)));
    if (g.description) pop.appendChild(el("p", "game-card__desc", g.description));
    if (g.tags && g.tags.length) pop.appendChild(tagList(g.tags));
    if (g.credits) pop.appendChild(el("p", "game-card__credits", g.credits));
    pop.appendChild(el("span", "game-card__more", g.youtube ? "動画を見る" : "公式サイト"));
    a.appendChild(pop);

    // タッチ端末ではタップで詳細ダイアログを開く
    // YouTube 動画がある作品はクリックでサイト内再生
    a.addEventListener("click", function (e) {
      if (canHover.matches && !g.youtube) return;
      e.preventDefault();
      openDialog(g);
    });

    li.appendChild(a);
    return li;
  }

  games.forEach(function (g) { grid.appendChild(renderCard(g)); });

  /* ---------- イベント ---------- */
  var eventGrid = document.getElementById("event-grid");
  (window.EVENTS || []).forEach(function (ev) {
    var li = el("li", "event-card");
    var a = el("a", "event-card__link");
    a.href = ev.url;
    var fig = el("div", "event-card__thumb");
    var img = el("img");
    img.src = ev.thumbnail; img.alt = ""; img.loading = "lazy"; img.width = 640; img.height = 360;
    fig.appendChild(img);
    a.appendChild(fig);
    var body = el("div", "event-card__body");
    body.appendChild(el("p", "event-card__label", ev.label));
    body.appendChild(el("h3", "event-card__title", ev.title));
    a.appendChild(body);
    li.appendChild(a);
    eventGrid.appendChild(li);
  });

  /* ---------- 詳細ダイアログ ---------- */
  var dialog = document.getElementById("game-dialog");
  var player = dialog.querySelector(".game-dialog__player");

  function youtubeId(url) {
    var m = String(url || "").match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    return m ? m[1] : "";
  }

  function openDialog(g) {
    var img = dialog.querySelector(".game-dialog__img");
    img.src = g.thumbnail;
    var yt = youtubeId(g.youtube);
    img.hidden = !!yt;
    player.hidden = !yt;
    player.innerHTML = "";
    if (yt) {
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + yt + "?autoplay=1&rel=0&playsinline=1";
      f.title = g.title + " の動画";
      f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      f.allowFullscreen = true;
      player.appendChild(f);
    }
    dialog.querySelector(".game-dialog__meta").textContent = meta(g);
    dialog.querySelector(".game-dialog__title").textContent = g.title;
    dialog.querySelector(".game-dialog__desc").textContent = g.description;
    var tags = dialog.querySelector(".game-dialog__tags");
    tags.innerHTML = "";
    (g.tags || []).forEach(function (t) { tags.appendChild(el("li", null, t)); });
    dialog.querySelector(".game-dialog__credits").textContent = g.credits || "";
    var gal = dialog.querySelector(".game-dialog__gallery");
    gal.innerHTML = "";
    (g.gallery || []).forEach(function (src) {
      var gi = el("img"); gi.src = src; gi.alt = g.title + " の画像"; gi.loading = "lazy";
      gal.appendChild(gi);
    });
    gal.hidden = !(g.gallery && g.gallery.length);
    var link = dialog.querySelector(".game-dialog__link");
    link.href = gameUrl(g);
    link.textContent = "公式サイト";
    if (typeof dialog.showModal === "function") dialog.showModal();
    else window.location.href = gameUrl(g);
  }
  dialog.querySelector(".game-dialog__close").addEventListener("click", function () { dialog.close(); });
  dialog.addEventListener("close", function () { player.innerHTML = ""; }); // 閉じたら再生を止める
  dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });

  /* ---------- スクロールでふわっと表示 ---------- */
  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    var targets = document.querySelectorAll(".section__title, .game-card, .event-card, .news-item");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var t = en.target;
        t.classList.add("is-in");
        io.unobserve(t);
        // 表示し終えたら遅延を外して、ホバー時の動きに影響しないようにする
        setTimeout(function () {
          t.classList.remove("reveal", "is-in");
          t.style.transitionDelay = "";
        }, 1000);
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    targets.forEach(function (t, i) {
      t.classList.add("reveal");
      t.style.transitionDelay = (i % 4) * 60 + "ms";
      io.observe(t);
    });
  }
})();
