import { parseOrderObject } from "../lib/order_schema.ts";

async function submitHook(e: SubmitEvent) {
	e.preventDefault();

	const formData = new FormData(e.currentTarget as HTMLFormElement);
	const payload = Object.fromEntries(formData.entries());
	payload.name = " ①"; // DEBUG
	const result = parseOrderObject(payload);
	console.log(result);
}

export function setSubmitHook(id: string) {
	document.getElementById(id)?.addEventListener("submit", submitHook);
}
