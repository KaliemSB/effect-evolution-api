import { expect, test } from "bun:test";
import { Effect, Schema } from "effect";
import { EvolutionAPI } from "@/index";
import { SendPlainText } from "./api/send-plain-text";

export const EvolutionAPITest = EvolutionAPI.make({
	base_url: "http://localhost:8080",
	api_key: "123",
	instance: "testing",
});

const phone_number = String(Bun.env.PHONE_NUMBER);

test("sendPlainText sends a text message", async () => {
	const program = Effect.gen(function* () {
		const evolution_api = yield* EvolutionAPI;

		const result = yield* evolution_api.sendPlainText({
			number: phone_number,
			textMessage: {
				text: "Hello, World",
			},
		});

		expect(Schema.is(SendPlainText.Response)(result)).toBe(true);

		return result;
	});

	return Effect.runPromise(program.pipe(Effect.provide(EvolutionAPITest)));
});
