import type { Context } from "hono";
import { Hono } from "hono";
import { parseOrderJson } from "../lib/order_schema";

function die(c: Context) {
	c.text("Internal Server Error", 500);
}

const app = new Hono();

app.post("/api/mail0", async (c) => {
	const body = await c.req.text();
	const result = parseOrderJson(body);
	if (result?.err) {
		// return c.json(
		// 	{ timestamp: new Date().toISOString(), body, error: result.err.fieldErrors },
		// 	400
		// );
		// バリデーションエラーがある場合は、即座に不親切に死ぬ
		return die(c);
	}

	return c.json({ timestamp: new Date().toISOString(), result: result.res });
});

export default app;
