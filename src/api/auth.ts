import { api } from "./client";
import { LoginRequest, LoginResponse } from "./contracts";

// 로그인 (수정필요): POST /api/auth/login
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
