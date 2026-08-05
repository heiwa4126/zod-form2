// OrderSchema に "cf-turnstile-response" というフィールドを追加した新しいスキーマ "orderTsSchema" と
// サポート関数を作成する

import { OrderSchema } from "./order_schema";
import { withTsSchema } from "./with_ts_schema";

const orderTsSchema = withTsSchema(OrderSchema);

export const parseOrderTsJson = orderTsSchema.parseJson;
export const parseOrderTsObject = orderTsSchema.parseObject;
export const parseOrder = orderTsSchema.parseBase;
