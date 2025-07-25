import { Schema } from "effect";
import { CommonResponseProperties } from "@/helpers";
import type { CommonRequestProperties } from "@/types";

export namespace SendPlainText {
	export type Params = {
		number: string;
		textMessage: {
			text: string;
		};
		options?: CommonRequestProperties & {
			linkPreview?: boolean;
			quoted?: {
				key?: {
					remoteJid?: string;
					fromMe?: boolean;
					id?: string;
					participant?: string;
				};
				message?: {
					conversation?: string;
				};
			};
			mentions?: {
				everyOne?: boolean;
				mentioned?: string[];
			};
		};
	};

	export const Response = Schema.Struct({
		...CommonResponseProperties,
		message: Schema.Struct({
			extendedTextMessage: Schema.Struct({
				text: Schema.String,
			}),
		}),
	});
}
