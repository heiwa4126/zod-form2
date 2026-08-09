import { parseOrder, parseOrderTsJson } from "@heiwa4126/order-schema";
import { Hono, type Context, type HonoRequest } from "hono";
import { validateTurnstile } from "./turnstile";

function die(c: Context) {
	c.text("Internal Server Error", 500);
}

async function verifyTurnstileToken(token: string | undefined, req: HonoRequest) {
	const ALWAYS_FAIL_SECRET = "2x0000000000000000000000000000000AA";
	// see https://developers.cloudflare.com/turnstile/troubleshooting/testing/#testing-scenarios

	if (!token || token === "") {
		return false;
	}
	const remote_ip = req.header("CF-Connecting-IP") ?? req.header("X-Forwarded-For") ?? undefined;
	const secret = process.env.TURNSTILE_SECRET || ALWAYS_FAIL_SECRET;

	// console.log("Turnstile validation request:", {
	// 	secret,
	// 	token,
	// 	remote_ip
	// });

	const result = await validateTurnstile(secret, token, remote_ip);
	return result.success;
}

const app = new Hono();

app.post("/api/mail0", async (c) => {
	const body = await c.req.text();
	const result = parseOrderTsJson(body);
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
	if (!(await verifyTurnstileToken(res["cf-turnstile-response"], c.req))) {
		return die(c);
	}

	const payload = parseOrder(res);
	// Do something with the validated data (res) here,
	// e.g., send an email, store in a database, etc.

	// return c.json({ timestamp: new Date().toISOString(), result: payload });

	const api1 = process.env.API1;
	const api1_key = process.env.API1_KEY;
	if (!api1 || !api1_key) {
		return die(c);
	}

	try {
		const api1_res = await fetch(api1, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Basic ${api1_key}`
			},
			body: JSON.stringify(payload)
		});
		if (!api1_res.ok) {
			return die(c);
		}
		return c.json(await api1_res.json(), 200);
	} catch (error) {
		console.error("Error while sending request to API1:", error);
		return die(c);
	}
});

export default app;
