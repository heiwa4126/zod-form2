import { Hono } from "hono";

const app = new Hono();

app.get("/api/hello", (c) => {
	return c.json({ message: "Hello Hono!", timestamp: new Date().toISOString() });
});

export default app;
