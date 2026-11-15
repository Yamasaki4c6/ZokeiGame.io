/* =========================================================
   全ページ共通の動作(ヘッダー・メニュー・外部リンク・Topへ戻る)
   ========================================================= */
(function () {
  "use strict";

  var config = window.SITE_CONFIG || {};

  /* ---------- 外部リンク(X・フォーム・規約全文・メール) ---------- */
  document.querySelectorAll("[data-link]").forEach(function (a) {
    var key = a.getAttribute("data-link");
    var value = config[key];
    if (!value) return;
    if (key === "contactEmail") {
      a.href = "mailto:" + value;
      var item = a.closest(".contact-item");
      if (item) item.hidden = false;
      return;
    }
    a.href = value;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  });

  document.querySelectorAll(".js-year").forEach(function (y) {
    y.textContent = new Date().getFullYear();
  });

  /* ---------- ヘッダー ---------- */
  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var backToTop = document.querySelector(".back-to-top");

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 40);
    if (backToTop) backToTop.classList.toggle("is-visible", y > window.innerHeight * 0.8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setNav(open) {
    if (!navToggle) return;
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  }
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      setNav(navToggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) setNav(false);
    });
    // PC幅に戻ったらメニューを閉じる
    window.matchMedia("(min-width: 961px)").addEventListener("change", function (m) {
      if (m.matches) setNav(false);
    });
  }
})();
