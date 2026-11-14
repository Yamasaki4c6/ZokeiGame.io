/**
 * イベント一覧データ
 * ------------------------------------------------------------
 *  id        : 英数字の識別子
 *  title     : イベント名
 *  label     : 英字ラベル
 *  thumbnail : 画像(16:9 推奨)
 *  summary   : 一言説明
 *  url       : イベントページ
 */
window.EVENTS = [
  {
    id: "gamejam",
    title: "ゲームジャム",
    label: "GAME JAM",
    thumbnail: "assets/img/events/gamejam.svg",
    summary: "限られた時間でチームを組み、テーマに沿ったゲームを作り上げます。",
    url: "events/gamejam.html"
  },
  {
    id: "lt",
    title: "LT会",
    label: "LIGHTNING TALK",
    thumbnail: "assets/img/events/lt.svg",
    summary: "制作の知見や好きなゲームについて、5分間で発表します。",
    url: "events/lt.html"
  },
  {
    id: "study",
    title: "勉強会",
    label: "STUDY",
    thumbnail: "assets/img/events/study.svg",
    summary: "ゲームエンジンやプログラミング、グラフィックの技術を学びます。",
    url: "events/study.html"
  }
];
