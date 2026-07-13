import { UserInfo } from "../types.ts";
import { api } from "./client.ts";
import {
	ProfileCreateRequest,
	ProfileCreateResponse,
	ProfileModifyRequest,
	ProfileResponse,
} from "./contracts.ts";
import { toUserInfo } from "./mappers.ts";

// 회원가입: POST /api/profiles
export async function createProfile(
	payload: ProfileCreateRequest,
): Promise<ProfileCreateResponse | void> {
	const data = await api<ProfileCreateResponse>(`/api/profiles`, {
		method: "POST",
		body: JSON.stringify(payload),
	});
	return data;
}

// 사용자 정보 조회: GET /api/profiles/{user_id}
export async function getProfile(user_id: number): Promise<UserInfo | void> {
	const data = await api<ProfileResponse>(`/api/profiles/${user_id}`);
	return toUserInfo(data);
}

// 사용자 정보 수정: PATCH /api/profiles/{user_id}
export async function modifyProfile(
	user_id: number,
	payload: ProfileModifyRequest,
): Promise<UserInfo | void> {
	const data = await api<ProfileResponse>(`/api/profiles/${user_id}`, {
		method: "PATCH",
		body: JSON.stringify(payload),
	});
	return toUserInfo(data);
}
