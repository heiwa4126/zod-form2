import { parseOrderObject } from "../lib/order_schema.ts";

function disableSubmitButton(form: HTMLFormElement, status: boolean = true) {
	const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;

	if (submitButton) {
		submitButton.disabled = status;
	}
}

async function submitHook(e: SubmitEvent) {
	e.preventDefault();

	const form = e.currentTarget as HTMLFormElement;
	disableSubmitButton(form, true);
	const formData = new FormData(form);
	const payload = Object.fromEntries(formData.entries());
	payload.name = " ①"; // DEBUG
	const result = parseOrderObject(payload);

	console.log(result);
	setTimeout(() => {
		disableSubmitButton(form, false);
	}, 500);
}

export function setSubmitHook(id: string) {
	document.getElementById(id)?.addEventListener("submit", submitHook);
}
