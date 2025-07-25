#!/bin/bash

# Vercelへのデプロイ
echo "Deploying to Vercel..."
vercel --prod

# ミラーサイトへのデプロイ設定
# 例: FTPやrsyncなど、お使いのホスティング環境に合わせて設定してください
# rsync -avz --delete ./public/ user@fuk.ahillchan.com:/path/to/public_html/
# または
# scp -r ./public/* user@fuk.ahillchan.com:/path/to/public_html/

echo "Deployment complete!"