import { parseUserJson, parseUserObject } from "../lib/user_schema.ts";

function parseUserAndPrint(jsonString: string) {
	const result = parseUserJson(jsonString);

	if (!result.error) {
		console.log(result.user);
	} else {
		// ここが汚いのでなんとかしたい
		const errors = result.error;
		if (errors.formErrors.length > 0) {
			console.log({ form: errors.formErrors });
		} else {
			console.log(errors.fieldErrors);
		}
	}
}

function verifyUserAndPrint(o: object) {
	const result = parseUserObject(o);

	if (!result.error) {
		console.log(result.user);
	} else {
		// ここが汚いのでなんとかしたい
		const errors = result.error;
		if (errors.formErrors.length > 0) {
			console.log({ form: errors.formErrors });
		} else {
			console.log(errors.fieldErrors);
		}
	}
}

parseUserAndPrint('{"name": "Alice"}');
parseUserAndPrint('{"name": 123}');
parseUserAndPrint('{"name": "Alice"');

verifyUserAndPrint({ name: "Bob" });
verifyUserAndPrint({ name: 456 });
verifyUserAndPrint({});
