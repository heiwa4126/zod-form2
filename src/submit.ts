async function submitHook(e: SubmitEvent) {
	e.preventDefault();

	const formData = new FormData(e.currentTarget as HTMLFormElement);
	const payload = Object.fromEntries(formData.entries());
	console.log(payload);
}

export function setSubmitHook(id: string) {
	document.getElementById(id)?.addEventListener("submit", submitHook);
}
