import { ReadingHistoryItem } from "../lib/readingHistory";
import { User } from "../types";
import { ApiOptions, api } from "./client";
import {
	UserResponse,
	UserUpdateRequest,
	ViewedArticleResponse,
} from "./contracts";
import { toUser } from "./mappers";

// 사용자 정보 조회: GET /api/users/me
export async function getUser(opts?: ApiOptions): Promise<User | void> {
	const data = await api<UserResponse>(`/api/users/me`, undefined, opts);
	return toUser(data);
}

// 로그인한 사용자가 조회한 기사 목록 (최신순): GET /api/users/me/articles
export async function getViewedArticles(
	limit = 10,
	offset = 0,
): Promise<ReadingHistoryItem[]> {
	const data =
		(await api<ViewedArticleResponse[]>(
			`/api/users/me/articles?limit=${limit}&offset=${offset}`,
		)) ?? [];
	return data.map((item) => ({
		id: item.article_id,
		title: item.title,
		category: item.category,
	}));
}

// 도움이 된 해설 목록: GET /api/users/me/helpful-analyses
export async function getHelpfulAnalyses(
	limit = 10,
	offset = 0,
): Promise<ReadingHistoryItem[]> {
	const data =
		(await api<ViewedArticleResponse[]>(
			`/api/users/me/helpful-analyses?limit=${limit}&offset=${offset}`,
		)) ?? [];
	return data.map((item) => ({
		id: item.article_id,
		title: item.title,
		category: item.category,
	}));
}

// 아이디 중복 확인: POST /api/users/check-id
export async function checkDuplicateId(loginId: string): Promise<boolean> {
	const data = await api<{ available: boolean }>(`/api/users/check-id`, {
		method: "POST",
		body: JSON.stringify({ login_id: loginId }),
	});
	return data?.available ?? false;
}

// 사용자 정보 수정: PATCH /api/users/me
export async function updateUser(
	payload: UserUpdateRequest,
): Promise<User | void> {
	const data = await api<UserResponse>(`/api/users/me`, {
		method: "PATCH",
		body: JSON.stringify(payload),
	});
	return toUser(data);
}

// 비밀번호 변경: PATCH /api/users/me/password
export async function updatePassword(password: string): Promise<boolean> {
	const data = await api<{ success: boolean }>(`/api/users/me/password`, {
		method: "PATCH",
		body: JSON.stringify({ password }),
	});
	return data?.success ?? false;
}
