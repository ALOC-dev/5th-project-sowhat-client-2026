import { User } from "../types";
import { api } from "./client";
import {
	UserCreateRequest,
	UserCreateResponse,
	UserResponse,
	UserUpdateRequest,
} from "./contracts";
import { toUser } from "./mappers";

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
export async function getUser(): Promise<User | void> {
	const data = await api<UserResponse>(`/api/users/me`);
	return toUser(data);
}

// 사용자 정보 수정: PATCH /api/profiles/{user_id}
export async function updateUser(
	payload: UserUpdateRequest,
): Promise<User | void> {
	const data = await api<UserResponse>(`/api/users/me`, {
		method: "PATCH",
		body: JSON.stringify(payload),
	});
	return toUser(data);
}
