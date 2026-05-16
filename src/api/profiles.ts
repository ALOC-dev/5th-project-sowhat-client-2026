import { api } from "./client.ts";
import { ProfileResponse } from "./contracts.ts";

export async function createProfile(payload: {
	age: number;
	gender: string;
	region: string;
	job: string;
	interest: string;
}): Promise<ProfileResponse | void> {
	const data = await api<ProfileResponse>(`/api/profiles`, {
		method: "POST",
		body: JSON.stringify(payload),
	});
	return data;
}

export async function getProfile(
	user_id: number,
): Promise<ProfileResponse | void> {
	const data = await api<ProfileResponse>(`/api/profiles/${user_id}`);
	return data;
}

export async function modifyProfile(
	user_id: number,
	payload: {
		age?: number;
		gender?: string;
		region?: string;
		job?: string;
		interest?: string;
	},
): Promise<ProfileResponse | void> {
	const data = await api<ProfileResponse>(`/api/profiles/${user_id}`, {
		method: "PATCH",
		body: JSON.stringify(payload),
	});
	return data;
}
