import { z } from "zod";
import { parseJson, parseObject } from "./schema_lib.ts";

const OrderSchema = z.object({
	name: z
		.string({
			error: (issue) =>
				issue.input === undefined ? "名前は必須です" : "名前は文字列で入力してください"
		})
		.min(3, { message: "名前は3文字以上で入力してください" })
		.max(50, { message: "名前は50文字以下で入力してください" }),
	email: z
		.string({
			error: (issue) =>
				issue.input === undefined ? "メールは必須です" : "メールは文字列で入力してください"
		})
		.pipe(
			z.email({
				error: "メールアドレスの形式で入力してください"
			})
		),
	item: z.string({
		error: (issue) =>
			issue.input === undefined ? "商品は必須です" : "商品は文字列で入力してください"
	})
});

export const parseOrderJson = parseJson(OrderSchema);
export const parseOrderObject = parseObject(OrderSchema);
