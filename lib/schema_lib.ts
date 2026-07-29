import { z } from "zod";

function trimStrings<T>(value: T): T {
	if (typeof value === "string") {
		return value.trim() as unknown as T;
	}
	if (Array.isArray(value)) {
		return value.map((v) => trimStrings(v)) as unknown as T;
	}
	if (value !== null && typeof value === "object") {
		const result: Record<string, unknown> = {};
		for (const [key, v] of Object.entries(value)) {
			result[key] = trimStrings(v);
		}
		return result as T;
	}
	return value;
}

const zJsonString = z.string().transform((str, ctx) => {
	try {
		const o = JSON.parse(str.normalize("NFKC"));
		return trimStrings(o);
	} catch {
		ctx.addIssue({ code: "custom", message: "不正なJSONです" });
		return z.NEVER;
	}
});

type ParseJsonResult<TSchema extends z.ZodTypeAny> = {
	user: z.infer<TSchema>;
	error?: z.ZodFlattenedError<z.infer<TSchema>, string>;
};

function parseJsonWithSchema<TSchema extends z.ZodTypeAny>(
	jsonString: string,
	schema: TSchema
): ParseJsonResult<TSchema> {
	const result = zJsonString.pipe(schema).safeParse(jsonString);

	if (result.success) {
		return { user: result.data };
	}
	return { user: {} as z.infer<TSchema>, error: z.flattenError(result.error) };
}

function parseObjectWithSchema<TSchema extends z.ZodTypeAny>(
	objectInput: object,
	schema: TSchema
): ParseJsonResult<TSchema> {
	const result = schema.safeParse(trimStrings(objectInput));

	if (result.success) {
		return { user: result.data };
	}
	return { user: {} as z.infer<TSchema>, error: z.flattenError(result.error) };
}

export function parseJson<TSchema extends z.ZodTypeAny>(schema: TSchema) {
	return (jsonString: string): ParseJsonResult<TSchema> => {
		return parseJsonWithSchema(jsonString, schema);
	};
}

export function parseObject<TSchema extends z.ZodTypeAny>(schema: TSchema) {
	return (objectInput: object): ParseJsonResult<TSchema> => {
		return parseObjectWithSchema(objectInput, schema);
	};
}
