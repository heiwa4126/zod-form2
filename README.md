# zod-form2

[zod-form1](https://github.com/heiwa4126/zod-form1)
に Cloudflare Turnstile をつけてみる。

[cfw-turnstile1](https://github.com/heiwa4126/cfw-turnstile1)
を混ぜたもの。

# 実行

```sh
bun ci
# @heiwa4126/order-schema がローカル参照になっているので
# パスが変更されている場合はpackage.jsonを修正すること
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
## デプロイすると URL がきまるので、これを turnstile の設定に追加する

# 消す
bun run delete
```

## メモ

`api/` と `src/` がある。

- api/ のほうは workers 用。
- src/ のほうは build すると、バンドルが public/js/ に出る
