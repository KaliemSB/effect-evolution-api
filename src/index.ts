import { Context, Data, Effect, Layer } from "effect";
import xior from "xior";
import { SendPlainText } from "./api/send-plain-text";
import { createAPIRequest } from "./helpers";

export class EvolutionAPIError extends Data.TaggedError("EvolutionAPIError")<{
	cause?: unknown;
	message?: string;
}> {}

type EvolutionAPIConfig = {
	base_url: string;
	api_key: string;
	instance: string;
};

interface EvolutionAPIImpl {
	readonly sendPlainText: ReturnType<
		typeof createAPIRequest<
			SendPlainText.Params,
			typeof SendPlainText.Response.fields
		>
	>;
}

export class EvolutionAPI extends Context.Tag("EvolutionAPI")<
	EvolutionAPI,
	EvolutionAPIImpl
>() {
	static readonly make = (config: EvolutionAPIConfig) =>
		Layer.effect(
			this,
			Effect.gen(function* () {
				const client = xior.create({
					baseURL: config.base_url,
					headers: {
						apiKey: config.api_key,
					},
				});

				return {
					sendPlainText: createAPIRequest({
						client,
						endpoint: "message/sendText",
						instance: config.instance,
						method: "POST",
						responseSchema: SendPlainText.Response,
					}),
				};
			}),
		);
}
