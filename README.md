候補日ダヨー React 版

開発サーバ
- npm i
- npm run dev

wafoo-css の導入（dist をベンダリング）
- 取得先: https://github.com/nigh2tie/wafoo-css の dist ディレクトリ
- 配置先: public/vendor/wafoo-css/
- 読み込み: index.html の <link href="/vendor/wafoo-css/wafoo.min.css"> が参照します

自動取得スクリプト（ネットワーク必須）
- 任意のリファレンス（タグ/ブランチ/コミット）を指定できます。省略時は main。

  npm run get:wafoo           # main から取得
  npm run get:wafoo -- v0.1.0 # 例: v0.1.0 タグから取得

注意
- スクリプトは wafoo.css / wafoo.min.css / wafoo.min.css.map を試行ダウンロードします。存在しない場合はスキップします。
- ファイル名が異なる場合は index.html のパスを合わせてください。

アクセシビリティ/操作
- スロットは button 要素で Enter/Space による選択が可能
- デスクトップ: 左クリックのドラッグで連続選択（右クリック無効化）
- モバイル: タップ開始→終了の2タップ範囲選択、キャンセル可
