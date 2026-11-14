/**
 * ゲーム一覧データ
 * ------------------------------------------------------------
 * ここに1件追加するだけで、トップページにカードが増えます。
 *
 *  id          : 英数字の識別子(重複しないように)
 *  title       : ゲームタイトル
 *  genre       : ジャンル(任意)
 *  year        : 制作年(任意)
 *  platform    : 対応環境(任意)
 *  thumbnail   : サムネイル画像(16:9 推奨)
 *  video       : カードにカーソルを合わせたときに流す動画(任意・音声なし)
 *  description : カーソルを合わせたとき/タップしたときに出る詳細な解説文
 *  tags        : タグ(任意)
 *  credits     : 制作メンバー(任意)
 *  url         : 公式ページのURL。空文字 "" のままだと「準備中」ページに飛びます
 */
window.GAMES = [
  {
    id: "hurunokoto",
    title: "布瑠の言",
    genre: "",
    year: "",
    platform: "",
    thumbnail: "assets/img/games/hurunokoto.svg",   // TODO: 動画の1コマなどの画像に差し替え
    video: "assets/video/hurunokoto.mp4",
    description: "",
    tags: [],
    credits: "",
    url: ""
  },
  {
    id: "full",
    title: "Full",
    genre: "",
    year: "",
    platform: "",
    thumbnail: "assets/img/games/full.jpg",
    video: "",
    description:
      "お掃除AI「イレイズ」となって、ご主人のPCのストレージが満杯にならないよう、出現し続けるファイルやフォルダを制限時間内に削除していくゲーム。迷惑広告を避けながら、消してはいけない重要なファイルを見極めよう。",
    tags: [],
    credits: "",
    url: ""
  },
  {
    id: "junsou-mazoku-gakuen",
    title: "純走魔族学園",
    genre: "",
    year: "",
    platform: "",
    thumbnail: "assets/img/games/junsou.svg",       // TODO: 画像ができたら差し替え
    video: "",
    description: "",
    tags: [],
    credits: "",
    url: ""
  },
  {
    id: "sara",
    title: "sara",
    genre: "",
    year: "",
    platform: "",
    thumbnail: "assets/img/games/sara.svg",          // TODO: 画像ができたら差し替え
    video: "",
    description: "",
    tags: [],
    credits: "",
    url: ""
  }
];
