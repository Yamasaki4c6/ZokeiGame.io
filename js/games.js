/**
 * ゲーム一覧データ
 * ------------------------------------------------------------
 * ここに1件追加するだけで、トップページにカードが増えます。
 *
 *  id          : 英数字の識別子(重複しないように)
 *  title       : ゲームタイトル
 *  genre       : ジャンル
 *  year        : 制作年
 *  platform    : 対応環境
 *  thumbnail   : サムネイル画像(16:9 推奨)
 *  summary     : カードに出る短い紹介文(40字くらい)
 *  description : カーソルを合わせたとき/タップしたときに出る詳細な解説文
 *  tags        : タグ(任意)
 *  credits     : 制作メンバー(任意)
 *  url         : 公式ページのURL。空文字 "" のままだと「準備中」ページに飛びます
 */
window.GAMES = [
  {
    id: "sample-game-1",
    title: "ゲームタイトル1(仮)",
    genre: "アクション",
    year: 2026,
    platform: "Windows / Web",
    thumbnail: "assets/img/games/placeholder-1.svg",
    summary: "ここに短い紹介文が入ります。",
    description:
      "ここに詳細な解説文が入ります。ゲームのあらすじ、遊び方、見どころ、制作で工夫した点などを2〜4文程度で書くと読みやすくなります。",
    tags: ["2D", "ドット絵"],
    credits: "企画・プログラム:〇〇 / グラフィック:〇〇",
    url: ""
  },
  {
    id: "sample-game-2",
    title: "ゲームタイトル2(仮)",
    genre: "パズル",
    year: 2026,
    platform: "Web",
    thumbnail: "assets/img/games/placeholder-2.svg",
    summary: "ここに短い紹介文が入ります。",
    description:
      "ここに詳細な解説文が入ります。ブラウザですぐ遊べる作品なら、その旨もここに書いておくと親切です。",
    tags: ["3D", "Unity"],
    credits: "制作:〇〇",
    url: ""
  },
  {
    id: "sample-game-3",
    title: "ゲームタイトル3(仮)",
    genre: "アドベンチャー",
    year: 2025,
    platform: "Windows",
    thumbnail: "assets/img/games/placeholder-3.svg",
    summary: "ここに短い紹介文が入ります。",
    description:
      "ここに詳細な解説文が入ります。展示イベント(学園祭・ゲームマーケットなど)で公開した作品なら、その情報も添えましょう。",
    tags: ["ノベル"],
    credits: "シナリオ:〇〇 / イラスト:〇〇",
    url: ""
  }
];
