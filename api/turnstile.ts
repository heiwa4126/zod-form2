type TurnstileVerifyResult = {
	success: boolean;
	["error-codes"]?: string[];
};

export async function validateTurnstile(
	secret: string,
	token: string,
	remoteip?: string
): Promise<TurnstileVerifyResult> {
	try {
		console.log("Turnstile validation request:", { secret, token, remoteip }); // DEBUG
		const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				secret,
				response: token,
				remoteip: remoteip
			})
		});

		const result = (await response.json()) as TurnstileVerifyResult;
		return result;
	} catch (error) {
		console.error("Turnstile validation error:", error);
		return { success: false, "error-codes": ["internal-error"] };
	}
}
