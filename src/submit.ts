import { parseOrderTsObject } from "../lib/order_ts_schema.ts";

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

function getElement(id: string): HTMLElement | null {
	return document.getElementById(id);
}

async function submitHook(e: SubmitEvent) {
	e.preventDefault();

	const form = e.currentTarget as HTMLFormElement;

	// Clear previous error messages
	for (const el of form.querySelectorAll<HTMLElement>(".error")) {
		el.innerHTML = "";
	}

	const formData = new FormData(form);
	const payload = Object.fromEntries(formData.entries());

	console.log("送信前の内容:\n", payload); // DEBUG

	disableSubmitButton(form, true);
	// payload.name = " ①"; // DEBUG
	const result = parseOrderTsObject(payload);

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
			const errorElement = getElement(`${key}-error`);
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
			// TODO: もっとエラー表示を簡単にする
			return;
		}
		const text = await res.text();

		mainElement.innerHTML = `<h1>送信成功</h1>
<p>HTTPステータス: ${res.status}</p>
<p>レスポンス本文: ${escapeHtml(text)}</p>
<p>ありがとうございました!</p>
<p><a href="/">トップに戻る</a></p>`;
	} catch (error) {
		// console.error("Failed to submit:", error);
		mainElement.innerHTML = `<h1>送信失敗</h1><p>HTTPエラー: ${error}</p>`;
		// TODO: もっとエラー表示を簡単にする
	}
}

export function setSubmitHook(id: string) {
	getElement(id)?.addEventListener("submit", submitHook);
}
