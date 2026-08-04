import { z } from "zod";
import { OrderSchema } from "./order_schema";
import { parseJson, parseObject } from "./schema_lib";

const OrderTsSchema = OrderSchema.extend({
	"cf-turnstile-response": z.string().min(1) // Cloudflare Turnstile のレスポンス
});

export const parseOrderTsJson = parseJson(OrderTsSchema);
export const parseOrderTsObject = parseObject(OrderTsSchema);

type Order = z.infer<typeof OrderSchema>;
type OrderTs = z.infer<typeof OrderTsSchema>;
export function parseOrder(input: OrderTs): Order {
	// OrderTS から "cf-turnstile-response" を型安全に除外する
	return OrderSchema.parse(input);
}
