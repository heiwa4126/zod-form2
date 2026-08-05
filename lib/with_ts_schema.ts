import { z } from "zod";
import { parseInto, parseJson, parseObject } from "./schema_lib";

const TurnstileTokenSchema = z.string().min(1);

/**
 * 元の Zod object schema に Turnstile のレスポンス項目を追加した schema helper を作成する。
 *
 * @param schema Turnstile 項目を追加する前の元スキーマ
 * @returns 次を含むオブジェクト
 * - schema: 元の schema
 * - tsSchema: Turnstile 項目を含む schema
 * - parseJson: tsSchema 用の JSON 文字列パーサー
 * - parseObject: tsSchema 用のオブジェクトパーサー
 * - parseBase: tsSchema から元の schema へ戻す("cf-turnstile-response"を消す)パーサー
 */
export function withTsSchema<TShape extends z.ZodRawShape>(schema: z.ZodObject<TShape>) {
	const tsSchema = schema.extend({
		"cf-turnstile-response": TurnstileTokenSchema
	});

	return {
		schema,
		tsSchema,
		parseJson: parseJson(tsSchema),
		parseObject: parseObject(tsSchema),
		parseBase: parseInto<typeof tsSchema, typeof schema>(schema)
	};
}
