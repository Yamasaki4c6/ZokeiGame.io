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

  /* ---------- ヒーロー動画 ---------- */
  var video = document.getElementById("hero-video");
  var toggle = document.getElementById("hero-toggle");
  var hv = config.heroVideo || {};
  var saveData = navigator.connection && navigator.connection.saveData;

  if (hv.poster) video.poster = hv.poster;

  function setPaused(paused) {
    toggle.classList.toggle("is-paused", paused);
    toggle.setAttribute("aria-label", paused ? "背景ムービーを再生" : "背景ムービーを一時停止");
  }

  if ((hv.mp4 || hv.webm) && !saveData) {
    if (hv.webm) addSource(hv.webm, "video/webm");
    if (hv.mp4) addSource(hv.mp4, "video/mp4");
    video.load();
    video.addEventListener("canplay", function once() {
      video.removeEventListener("canplay", once);
      video.classList.add("is-ready");
      toggle.hidden = false;
      if (reduceMotion.matches) {
        setPaused(true); // 動きを減らす設定の人には自動再生しない
      } else {
        var p = video.play();
        if (p && p.catch) p.catch(function () { setPaused(true); });
      }
    });
    // 動画ファイルが無い/読めない場合はポスター画像のまま
    video.addEventListener("error", function () { video.classList.remove("is-ready"); }, true);

    toggle.addEventListener("click", function () {
      if (video.paused) { video.play(); setPaused(false); }
      else { video.pause(); setPaused(true); }
    });

    // 画面外では止めて負荷を下げる
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (toggle.classList.contains("is-paused")) return;
          if (en.isIntersecting) video.play().catch(function () {});
          else video.pause();
        });
      }).observe(video);
    }
  }

  function addSource(src, type) {
    var s = document.createElement("source");
    s.src = src;
    s.type = type;
    video.appendChild(s);
  }

  /* ---------- 作品カード ---------- */
  var grid = document.getElementById("game-grid");
  var filters = document.getElementById("game-filters");
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
    pop.appendChild(el("p", "game-card__desc", g.description));
    if (g.tags && g.tags.length) pop.appendChild(tagList(g.tags));
    if (g.credits) pop.appendChild(el("p", "game-card__credits", g.credits));
    pop.appendChild(el("span", "game-card__more", "公式サイト"));
    a.appendChild(pop);

    // タッチ端末ではタップで詳細ダイアログを開く
    a.addEventListener("click", function (e) {
      if (canHover.matches) return;
      e.preventDefault();
      openDialog(g);
    });

    li.appendChild(a);
    return li;
  }

  games.forEach(function (g) { grid.appendChild(renderCard(g)); });

  // ジャンル絞り込み(ジャンルが2種類以上あるときだけ表示)
  var genres = [];
  games.forEach(function (g) { if (g.genre && genres.indexOf(g.genre) < 0) genres.push(g.genre); });
  if (genres.length > 1) {
    ["ALL"].concat(genres).forEach(function (name, i) {
      var b = el("button", "filter", name);
      b.type = "button";
      b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      b.addEventListener("click", function () {
        filters.querySelectorAll(".filter").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        grid.querySelectorAll(".game-card").forEach(function (card) {
          card.hidden = i !== 0 && card.dataset.genre !== name;
        });
      });
      filters.appendChild(b);
    });
  } else {
    filters.hidden = true;
  }

  /* ---------- 詳細ダイアログ ---------- */
  var dialog = document.getElementById("game-dialog");
  function openDialog(g) {
    var img = dialog.querySelector(".game-dialog__img");
    img.src = g.thumbnail;
    dialog.querySelector(".game-dialog__meta").textContent = meta(g);
    dialog.querySelector(".game-dialog__title").textContent = g.title;
    dialog.querySelector(".game-dialog__desc").textContent = g.description;
    var tags = dialog.querySelector(".game-dialog__tags");
    tags.innerHTML = "";
    (g.tags || []).forEach(function (t) { tags.appendChild(el("li", null, t)); });
    dialog.querySelector(".game-dialog__credits").textContent = g.credits || "";
    var link = dialog.querySelector(".game-dialog__link");
    link.href = gameUrl(g);
    link.textContent = "公式サイト";
    if (typeof dialog.showModal === "function") dialog.showModal();
    else window.location.href = gameUrl(g);
  }
  dialog.querySelector(".game-dialog__close").addEventListener("click", function () { dialog.close(); });
  dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });

  /* ---------- スクロールでふわっと表示 ---------- */
  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    var targets = document.querySelectorAll(".section__title, .game-card");
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
