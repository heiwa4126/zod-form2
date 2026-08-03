import { parseOrderJson, parseOrderObject } from "../lib/order_schema.ts";

function parseOrderAndPrint(jsonString: string) {
	const result = parseOrderJson(jsonString);

	if (!result.err) {
		console.log(result.res);
	} else {
		// ここが汚いのでなんとかしたい
		const errors = result.err;
		if (errors.formErrors.length > 0) {
			console.log({ form: errors.formErrors });
		} else {
			console.log(errors.fieldErrors);
		}
	}
}

function verifyOrderAndPrint(o: object) {
	const result = parseOrderObject(o);

	if (!result.err) {
		console.log(result.res);
	} else {
		// ここが汚いのでなんとかしたい
		const errors = result.err;
		if (errors.formErrors.length > 0) {
			console.log({ form: errors.formErrors });
		} else {
			console.log(errors.fieldErrors);
		}
	}
}

// parseOrderAndPrint('{"item": "Apple"}');
// parseOrderAndPrint('{"item": 123}');
// parseOrderAndPrint('{"item": "Apple"');

verifyOrderAndPrint({
	item: "Banana   ",
	name: "   John Doe   ",
	email: "  john.doe@example.com ",
	price: 100
});
verifyOrderAndPrint({
	item: "Banana",
	name: "",
	email: "john.doe@example.com",
	price: 100
});
parseOrderAndPrint(`{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "item": "Banana"
}`);

parseOrderAndPrint(`{
  "name": "John Doe",
  "email": "john.doe[at]example.com",
  "item": "Banana"
}`);
