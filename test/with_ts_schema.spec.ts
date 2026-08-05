import { describe, expect, it } from "vitest";
import { z } from "zod";
import { withTsSchema } from "../lib/with_ts_schema";

describe("withTsSchema", () => {
	const baseSchema = z.object({
		name: z.string().min(1),
		count: z.coerce.number().int().min(1)
	});
	const schema = withTsSchema(baseSchema);

	it("parses object input with the Turnstile token", () => {
		const result = schema.parseObject({
			name: "Alice",
			count: "2",
			"cf-turnstile-response": "token"
		});

		expect(result.err).toBeUndefined();
		expect(result.res).toEqual({
			name: "Alice",
			count: 2,
			"cf-turnstile-response": "token"
		});
	});

	it("returns a field error when the Turnstile token is missing", () => {
		const result = schema.parseObject({
			name: "Alice",
			count: 2
		});

		expect(result.err?.fieldErrors["cf-turnstile-response"]).toBeTruthy();
	});

	it("strips the Turnstile token by parsing against the base schema", () => {
		const order = schema.parseBase({
			name: "Alice",
			count: 2,
			"cf-turnstile-response": "token"
		});

		expect(order).toEqual({
			name: "Alice",
			count: 2
		});
	});
});
