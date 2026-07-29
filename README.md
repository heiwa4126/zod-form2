# zod-form1

Cloudflare Workers として書く
(TODO)

# 実行

```sh
bun ci
bun audit
bun run cf-typegen
bun run build # src/ 以下を public/js/index.mjs に生成する

# 開発
bun run dev
bun run cf-typegen # wrangler.jsoncを編集したら実行
bun run build # src/ 以下を書き換えたら実行

# ログイン
bun run login
## または
bun run login-no-browser

# デプロイ
bun run deploy
## cloudflare workers で試す

# 消す
bun run delete
```

## メモ

`api/` と `src/` がある。

- api/ のほうは workers 用。
- src/ のほうは build すると、バンドルが public/js/ に出る
