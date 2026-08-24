import { api } from "./client";
import {
	LoginRequest,
	LoginResponse,
	UserCreateRequest,
	UserCreateResponse,
} from "./contracts";

// 로그인: POST /api/auth/login
export async function login(payload: LoginRequest): Promise<boolean> {
	const data = await api<LoginResponse>("/api/auth/login", {
		method: "POST",
		body: JSON.stringify({
			login_id: payload.login_id,
			password: payload.password,
		}),
	});
	return data != undefined;
}

// 회원가입: POST /api/auth/signup
export async function signup(
	payload: UserCreateRequest,
): Promise<UserCreateResponse | void> {
	return api<UserCreateResponse>("/api/auth/signup", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

// 로그아웃: POST /api/auth/logout
export async function logout(): Promise<void> {
	await api("/api/auth/logout", { method: "POST" });
}
