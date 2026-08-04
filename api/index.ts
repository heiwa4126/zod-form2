import type { Context } from "hono";
import { Hono } from "hono";
import { parseOrderJson } from "../lib/order_schema";
import { validateTurnstile } from "./turnstile";

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

	const res = result.res;

	// Cloudflare Turnstile の検証
	const token = res["cf-turnstile-response"];
	if (!token) {
		return die(c);
	}
	const remote_ip =
		c.req.header("CF-Connecting-IP") ?? c.req.header("X-Forwarded-For") ?? undefined;
	const secret = process.env.TURNSTILE_SECRET || "";

	console.log("Turnstile validation request:", {
		secret,
		token,
		remote_ip
	});

	const verifyResult = await validateTurnstile(secret, token, remote_ip);
	console.log("Turnstile validation result:", verifyResult);
	if (!verifyResult.success) {
		return die(c);
	}

	// Do something with the validated data (res) here, e.g., send an email, store in a database, etc.

	return c.json({ timestamp: new Date().toISOString(), result: res });
});

export default app;
