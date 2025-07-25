# カスタムドメイン設定の知見

## 問題
GitHub経由でVercelにデプロイした際、カスタムドメイン（fuk.ahillchan.com）でSSL証明書エラーが発生。

エラー内容：
```
ERR_SSL_PROTOCOL_ERROR
このサイトは安全に接続できません
```

## 原因
GitHub経由のデプロイでは、カスタムドメインの設定がVercel側で自動的に行われない場合がある。

## 解決方法

### 1. Vercelダッシュボードで直接設定（推奨）
1. Vercelのダッシュボード（https://vercel.com）にログイン
2. プロジェクトを選択
3. Settings → Domains でカスタムドメインを追加
4. DNSレコードの設定指示に従う

### 2. Cloudflare側の設定確認
SSL/TLS設定を確認：
- 「フレキシブル」→「フル」または「フル（strict）」に変更
- これによりCloudflare-Vercel間のSSL通信が正しく行われる

### 3. DNS設定
Cloudflareで以下を設定：
- タイプ: CNAME
- 名前: fuk
- ターゲット: cname.vercel-dns.com
- プロキシ状態: オレンジ雲（プロキシ有効）

## 教訓
- GitHub経由のデプロイとVercel直接デプロイでドメイン設定の挙動が異なる
- カスタムドメインを使用する場合は、Vercelダッシュボードで直接設定する方が確実
- SSL証明書の発行には時間がかかる場合があるため、設定後は数分待つ

## 確認用URL
- Vercel標準ドメイン: https://fukuoka-flap-1753418021.vercel.app
- カスタムドメイン: https://fuk.ahillchan.com （SSL設定後）