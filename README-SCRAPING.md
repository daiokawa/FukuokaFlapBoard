# 実データ取得ガイド

## ローカルでのスクレイピング実行

1. **スクレイピングスクリプトの実行**
```bash
node scrape-local.js
```

このスクリプトは福岡空港の公式サイトから実際のフライトデータを取得し、`flight-data.json`に保存します。

2. **更新版サーバーの起動**
```bash
node update-server.js
```

`flight-data.json`を読み込んで実データを提供します。

## Vercel環境での制限

Vercelのサーバーレス環境では以下の制限があります：
- Puppeteerの実行が困難
- 外部サイトへの直接アクセスがCORSでブロックされる可能性
- 実行時間の制限（最大10秒）

## 推奨される運用方法

1. **定期的なローカル実行**
   - cronやタスクスケジューラーで3分ごとに`scrape-local.js`を実行
   - 生成された`flight-data.json`をVercelにデプロイ

2. **GitHub Actionsの活用**
   - 定期的にスクレイピングを実行
   - 結果をリポジトリにコミット
   - 自動でVercelにデプロイ

3. **外部APIの利用**
   - FlightAware API
   - AviationStack API
   - OpenSky Network API

## 注意事項

- robots.txtやサイトの利用規約を確認してください
- 過度なアクセスは避けてください
- 商用利用の場合は適切なAPIライセンスを取得してください