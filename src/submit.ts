import { parseOrderObject } from "../lib/order_schema.ts";

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function disableSubmitButton(form: HTMLFormElement, status: boolean = true) {
	const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;

	if (submitButton) {
		submitButton.disabled = status;
	}
}

async function submitHook(e: SubmitEvent) {
	e.preventDefault();

	const form = e.currentTarget as HTMLFormElement;
	// Clear previous error messages
	for (const el of form.querySelectorAll<HTMLElement>(".error")) {
		el.innerHTML = "";
	}
	disableSubmitButton(form, true);
	const formData = new FormData(form);
	const payload = Object.fromEntries(formData.entries());
	// payload.name = " ①"; // DEBUG
	const result = parseOrderObject(payload);

	setTimeout(() => {
		disableSubmitButton(form, false);
	}, 500);

	// エラーがあればエラーを表示しておしまい
	if (result.err) {
		console.log("エラー内容:\n", result.err.fieldErrors); // DEBUG
		for (const [key, errorMessages] of Object.entries(result.err.fieldErrors)) {
			if (!errorMessages || errorMessages.length === 0) {
				continue;
			}
			const errorElement = document.getElementById(`${key}-error`);
			if (!errorElement) {
				continue;
			}
			errorElement.innerHTML = escapeHtml(errorMessages.join("/"));
		}
		return;
	}

	// DEBUG
	console.log("送信内容:\n", result.res); // DEBUG

	// エラーがなければ<main>のinnerHTMLを置き換える
	const mainElement = document.querySelector("main");
	if (!mainElement) {
		form.innerHTML = "<h1>予想しないエラーが発生しました</h1>";
		return;
	}
	mainElement.innerHTML = `<h1>送信中...</h1><p>送信内容: ${escapeHtml(JSON.stringify(result.res))}</p>`;

	// エラーがなければ POST /api/mail0 に送信する
	try {
		const res = await fetch("/api/mail0", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(result.res)
		});
		if (!res.ok) {
			// throw new Error(`HTTP error! status: ${res.status}`);
			mainElement.innerHTML = `<h1>送信失敗</h1><p>HTTPエラー: ${res.status}</p>`;
			return;
		}
		const text = await res.text();

		mainElement.innerHTML = `<h1>送信成功</h1>
		<p>HTTPステータス: ${res.status}</p>
		<p>レスポンス本文: ${escapeHtml(text)}</p>
		<p>ありがとうございました！</p>`;
	} catch (error) {
		// console.error("Failed to submit:", error);
		mainElement.innerHTML = `<h1>送信失敗</h1><p>HTTPエラー: ${error}</p>`;
	}
}

export function setSubmitHook(id: string) {
	document.getElementById(id)?.addEventListener("submit", submitHook);
}
