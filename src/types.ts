export const Status = [
	"ERROR",
	"PENDING",
	"SERVER_ACK",
	"DELIVERY_ACK",
	"READ",
	"PLAYED",
] as const;

const presence = ["composing", "recording"] as const;
export type Presence = (typeof presence)[number];

export type CommonRequestProperties = {
	delay: number;
	presence: Presence;
};
