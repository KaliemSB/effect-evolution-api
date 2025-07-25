import { Effect, Schema } from "effect";
import type { Struct } from "effect/Schema";
import { type Xior, XiorError } from "xior";
import { EvolutionAPIError } from "@/index";
import { Status } from "@/types";

export const CommonResponseProperties = {
	key: Schema.Struct({
		id: Schema.String,
		remoteJid: Schema.String,
		fromMe: Schema.Boolean,
	}),
	messageTimestamp: Schema.NumberFromString,
	status: Schema.Literal(...Status),
};

type CreateAPIRequestParams<R extends Struct.Fields> = {
	client: Xior;
	endpoint: string;
	instance: string;
	method: string;
	responseSchema: Struct<R>;
};

export const createAPIRequest =
	<P, R extends Struct.Fields>({
		client,
		endpoint,
		instance,
		method = "POST",
		responseSchema,
	}: CreateAPIRequestParams<R>) =>
	(data: P) =>
		Effect.gen(function* () {
			const response = yield* Effect.tryPromise({
				try: () =>
					client.request({
						url: `${endpoint}/${instance}`,
						method,
						data,
					}),
				catch: (e) =>
					new EvolutionAPIError({
						message: `Failed to call API endpoint: ${endpoint} with instance: ${instance} - ${e instanceof XiorError ? e.message : String(e)}`,
						cause: e,
					}),
			});

			return yield* Schema.decodeUnknown(responseSchema)(response.data);
		});
