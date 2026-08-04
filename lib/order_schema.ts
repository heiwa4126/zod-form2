import { z } from "zod";
import { parseJson, parseObject, requiredStringError } from "./schema_lib";

const OrderSchema = z.object({
	name: z
		.string({ error: requiredStringError("名前") })
		.trim()
		.min(3, { message: "名前は3文字以上で入力してください" })
		.max(50, { message: "名前は50文字以下で入力してください" }),
	email: z.string({ error: requiredStringError("メール") }).pipe(
		z.email({
			error: "メールアドレスの形式で入力してください"
		})
	),
	item: z.string({ error: requiredStringError("商品") }).trim(),
	"cf-turnstile-response": z.string() // Cloudflare Turnstile のレスポンス
});

export const parseOrderJson = parseJson(OrderSchema);
export const parseOrderObject = parseObject(OrderSchema);
