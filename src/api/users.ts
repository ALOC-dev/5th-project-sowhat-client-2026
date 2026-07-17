import { User } from "../types.ts";
import { api } from "./client.ts";
import {
	UserCreateRequest,
	UserCreateResponse,
	UserResponse,
	UserUpdateRequest,
} from "./contracts.ts";
import { toUser } from "./mappers.ts";

// 회원가입: POST /api/profiles
export async function createUser(
	payload: UserCreateRequest,
): Promise<UserCreateResponse | void> {
	const data = await api<UserCreateResponse>(`/api/users`, {
		method: "POST",
		body: JSON.stringify(payload),
	});
	return data;
}

// 사용자 정보 조회: GET /api/profiles/{user_id}
export async function getUser(userId: number): Promise<User | void> {
	const data = await api<UserResponse>(`/api/users/${userId}`);
	return toUser(data);
}

// 사용자 정보 수정: PATCH /api/profiles/{user_id}
export async function updateUser(
	userId: number,
	payload: UserUpdateRequest,
): Promise<User | void> {
	const data = await api<UserResponse>(`/api/users/${userId}`, {
		method: "PATCH",
		body: JSON.stringify(payload),
	});
	return toUser(data);
}
