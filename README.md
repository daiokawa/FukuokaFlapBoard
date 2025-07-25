# FukuokaFlapBoard

福岡国際空港の国際線フライト情報をパタパタUI（Split-Flap Display）で表示するWebアプリケーション

## 機能

- 福岡空港の国際線出発・到着便をリアルタイム表示
- パタパタめくれる昔懐かしいフラップディスプレイUI
- 3分ごとに自動更新
- 天気情報とアナログ時計表示
- iPad mini 5に最適化された横長レイアウト

## セットアップ

```bash
npm install
npm start
```

ブラウザで http://localhost:3000 にアクセス

## 環境変数（オプション）

天気情報を表示する場合は `.env` ファイルに以下を追加：

```
OPENWEATHER_API_KEY=your_api_key_here
```

## 技術スタック

- Node.js + Express
- Puppeteer（スクレイピング）
- leonwind/flap-display（UI）
- HTML/CSS/JavaScript