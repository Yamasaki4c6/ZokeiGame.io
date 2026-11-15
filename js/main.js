/* =========================================================
   トップページの動作(オープニング・Hero・NEWS・GAMES・EVENTS)
   共通の動作は js/common.js
   ========================================================= */
(function () {
  "use strict";

  var config = window.SITE_CONFIG || {};
  var games = window.GAMES || [];
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* ---------- オープニング(初回のみ。判定は index.html 内のスクリプト) ---------- */
  var intro = document.getElementById("intro");
  if (intro) {
    setTimeout(function () {
      intro.classList.add("is-done");
      document.documentElement.classList.remove("is-intro");
      setTimeout(function () { intro.remove(); }, 1000);
    }, 2600);
  }

  /* ---------- Hero(5秒ごとに切り替え。プログレスバーで手動切り替え) ---------- */
  var slidesEl = document.getElementById("hero-slides");
  var dotsEl = document.getElementById("hero-dots");
  var captionEl = document.getElementById("hero-caption");
  var slidesData = config.heroSlides || [];
  var interval = config.heroInterval || 5000;
  var saveData = navigator.connection && navigator.connection.saveData;
  var autoplay = !reduceMotion.matches; // 動きを減らす設定の人には自動で切り替えない
  var slides = [];
  var current = -1;
  var timer = null;

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
    b.setAttribute("aria-label", (i + 1) + "枚目:" + d.title);
    b.style.setProperty("--duration", interval + "ms");
    b.appendChild(el("span", "hero__dot-bar"));
    b.addEventListener("click", function () { show(i); restart(); });
    li.appendChild(b);
    dotsEl.appendChild(li);
    slides.push({ el: wrap, video: v, dot: b, title: d.title });
  });
  if (slides.length < 2) dotsEl.hidden = true;
  if (!autoplay) document.querySelector(".hero").classList.add("is-static");

  function show(i) {
    if (!slides[i]) return;
    var prev = slides[current];
    if (prev && i !== current) {
      prev.el.classList.remove("is-active");
      prev.dot.classList.remove("is-active");
      prev.dot.removeAttribute("aria-current");
      if (prev.video) setTimeout(function () { prev.video.pause(); }, 1200);
    }
    current = i;
    var s = slides[i];
    s.el.classList.add("is-active");
    // プログレスバーを最初からやり直す
    s.dot.classList.remove("is-active"); void s.dot.offsetWidth; s.dot.classList.add("is-active");
    s.dot.setAttribute("aria-current", "true");
    captionEl.classList.remove("is-in"); void captionEl.offsetWidth;
    captionEl.textContent = s.title || "";
    captionEl.classList.add("is-in");
    if (s.video) {
      try { s.video.currentTime = 0; } catch (e) {}
      if (autoplay) s.video.play().catch(function () {});
    }
  }
  function next() { show((current + 1) % slides.length); }
  function restart() {
    clearInterval(timer);
    if (autoplay && slides.length > 1) timer = setInterval(next, interval);
  }

  if (slides.length) {
    show(0);
    restart();
    // 画面外では止めて負荷を下げる
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var s = slides[current];
          if (en.isIntersecting) {
            if (s.video && autoplay) s.video.play().catch(function () {});
            restart();
          } else {
            if (s.video) s.video.pause();
            clearInterval(timer);
          }
        });
      }).observe(slidesEl);
    }
  }

  /* ---------- 特設バナー ---------- */
  var banner = config.featureBanner;
  var bannerSec = document.getElementById("feature-banner");
  if (bannerSec) {
    if (banner && banner.image) {
      var bLink = document.getElementById("feature-banner-link");
      var bImg = document.getElementById("feature-banner-img");
      bImg.src = banner.image;
      bImg.alt = banner.alt || "";
      if (banner.url) {
        bLink.href = banner.url;
        if (/^https?:/.test(banner.url)) { bLink.target = "_blank"; bLink.rel = "noopener noreferrer"; }
      } else {
        bLink.removeAttribute("href");
      }
    } else {
      bannerSec.hidden = true;
    }
  }

  /* ---------- NEWS(4件まで表示、5件以上は VIEW MORE) ---------- */
  var NEWS_VISIBLE = 4;
  var newsList = document.getElementById("news-list");
  var newsMore = document.getElementById("news-more");
  var news = window.NEWS || [];
  news.forEach(function (n, i) {
    var li = el("li", "news-item");
    if (i >= NEWS_VISIBLE) li.hidden = true;
    var inner = el(n.url ? "a" : "div", "news-item__inner");
    if (n.url) {
      inner.href = n.url;
      if (/^https?:/.test(n.url)) { inner.target = "_blank"; inner.rel = "noopener noreferrer"; }
    }
    var time = el("time", "news-item__date", n.date);
    time.dateTime = String(n.date).replace(/\./g, "-");
    inner.appendChild(time);
    inner.appendChild(el("span", "news-item__cat", n.category || ""));
    inner.appendChild(el("span", "news-item__title", n.title));
    if (n.url) inner.appendChild(el("span", "news-item__arrow", /^https?:/.test(n.url) ? "↗" : "→"));
    li.appendChild(inner);
    newsList.appendChild(li);
  });
  if (news.length > NEWS_VISIBLE) {
    newsMore.hidden = false;
    newsMore.addEventListener("click", function () {
      var open = newsMore.getAttribute("aria-expanded") !== "true";
      newsList.querySelectorAll(".news-item").forEach(function (li, i) {
        if (i >= NEWS_VISIBLE) li.hidden = !open;
      });
      newsMore.setAttribute("aria-expanded", String(open));
      newsMore.textContent = open ? "CLOSE" : "VIEW MORE";
    });
  }

  /* ---------- GAMES ---------- */
  var grid = document.getElementById("game-grid");

  function gameUrl(g) {
    return g.url ? g.url : "games/coming-soon.html?id=" + encodeURIComponent(g.id);
  }
  function meta(g) {
    return [g.genre, g.year, g.platform].filter(Boolean).join(" / ");
  }
  function actionLabel(g) {
    if (g.youtube) return "PLAY MOVIE";
    return "VIEW DETAIL";
  }

  games.forEach(function (g) {
    var li = el("li", "game-card");
    var a = el("a", "game-card__link");
    a.href = gameUrl(g);
    a.setAttribute("aria-label", g.title + " の詳細を見る");

    var thumb = el("div", "game-card__thumb");
    if (g.thumbnail) {
      var img = el("img");
      img.src = g.thumbnail; img.alt = ""; img.loading = "lazy";
      img.width = 640; img.height = 360;
      thumb.appendChild(img);
    }
    if (g.video) {
      // PC でカーソルを合わせたときだけ動画を読み込んで再生
      var v = el("video", "game-card__video");
      v.muted = true; v.loop = true; v.playsInline = true; v.preload = "none";
      v.setAttribute("aria-hidden", "true");
      thumb.appendChild(v);
      li.addEventListener("mouseenter", function () {
        if (reduceMotion.matches || !window.matchMedia("(hover: hover)").matches) return;
        if (!v.src) v.src = g.video;
        v.play().then(function () { v.classList.add("is-playing"); }).catch(function () {});
      });
      li.addEventListener("mouseleave", function () {
        v.pause(); v.classList.remove("is-playing");
      });
    }
    // ホバー時にサムネイル下部に出るオーバーレイ
    var overlay = el("div", "game-card__overlay");
    if (g.description) overlay.appendChild(el("p", "game-card__excerpt", g.description));
    overlay.appendChild(el("span", "game-card__action", actionLabel(g)));
    thumb.appendChild(overlay);
    a.appendChild(thumb);

    var body = el("div", "game-card__body");
    body.appendChild(el("h3", "game-card__title", g.title));
    var m = meta(g);
    if (m) body.appendChild(el("p", "game-card__meta", m));
    a.appendChild(body);

    a.addEventListener("click", function (e) {
      e.preventDefault();
      openDialog(g);
    });

    li.appendChild(a);
    grid.appendChild(li);
  });

  /* ---------- EVENTS ---------- */
  var eventGrid = document.getElementById("event-grid");
  (window.EVENTS || []).forEach(function (ev, i) {
    var li = el("li", "event-card" + (i === 0 ? " event-card--main" : ""));
    var a = el("a", "event-card__link");
    a.href = ev.url;
    var thumb = el("div", "event-card__thumb");
    var img = el("img");
    img.src = ev.thumbnail; img.alt = ""; img.loading = "lazy";
    thumb.appendChild(img);
    a.appendChild(thumb);
    var body = el("div", "event-card__body");
    body.appendChild(el("h3", "event-card__title", ev.title));
    body.appendChild(el("p", "event-card__label", ev.label));
    a.appendChild(body);
    li.appendChild(a);
    eventGrid.appendChild(li);
  });

  /* ---------- 作品の詳細ダイアログ ---------- */
  var dialog = document.getElementById("game-dialog");
  var player = dialog.querySelector(".game-dialog__player");
  var dImg = dialog.querySelector(".game-dialog__img");

  function youtubeId(url) {
    var m = String(url || "").match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    return m ? m[1] : "";
  }

  function openDialog(g) {
    dialog.querySelector(".game-dialog__title").textContent = g.title;
    var yt = youtubeId(g.youtube);
    player.innerHTML = "";
    player.hidden = !yt;
    dImg.hidden = !!yt || !g.thumbnail;
    if (!yt && g.thumbnail) dImg.src = g.thumbnail;
    if (yt) {
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + yt + "?autoplay=1&rel=0&playsinline=1";
      f.title = g.title + " の動画";
      f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      f.allowFullscreen = true;
      player.appendChild(f);
    }
    dialog.querySelector(".game-dialog__meta").textContent = meta(g);
    dialog.querySelector(".game-dialog__desc").textContent = g.description || "";
    var tags = dialog.querySelector(".game-dialog__tags");
    tags.innerHTML = "";
    (g.tags || []).forEach(function (t) { tags.appendChild(el("li", null, t)); });
    var gal = dialog.querySelector(".game-dialog__gallery");
    gal.innerHTML = "";
    (g.gallery || []).forEach(function (src) {
      var gi = el("img"); gi.src = src; gi.alt = g.title + " の画像"; gi.loading = "lazy";
      gal.appendChild(gi);
    });
    gal.hidden = !(g.gallery && g.gallery.length);
    dialog.querySelector(".game-dialog__credits").textContent = g.credits || "";
    var link = dialog.querySelector(".game-dialog__link");
    link.href = gameUrl(g);
    link.textContent = g.url ? "公式サイト" : "公式サイト(準備中)";
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
      document.body.classList.add("modal-open");
      dialog.querySelector(".game-dialog__scroll").scrollTop = 0;
    } else {
      window.location.href = gameUrl(g);
    }
  }
  dialog.querySelector(".game-dialog__close").addEventListener("click", function () { dialog.close(); });
  dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener("close", function () {
    player.innerHTML = ""; // 閉じたら再生を止める
    document.body.classList.remove("modal-open");
  });

  /* ---------- スクロール表示(見出しだけ控えめにフェード。動きは付けない) ---------- */
  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    var targets = document.querySelectorAll(".section__title");
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
      io.observe(t);
    });
  }
})();
