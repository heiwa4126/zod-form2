import { z } from "zod";
import { parseJson, parseObject } from "./schema_lib.ts";

const UserSchema = z.object({
	name: z.string({
		error: (issue) =>
			issue.input === undefined ? "名前は必須です" : "名前は文字列で入力してください"
	})
});

export const parseUserJson = parseJson(UserSchema);
export const parseUserObject = parseObject(UserSchema);
