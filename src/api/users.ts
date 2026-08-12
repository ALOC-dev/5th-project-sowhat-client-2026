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
export async function getViewedArticles(): Promise<ReadingHistoryItem[]> {
	const data =
		(await api<ViewedArticleResponse[]>(`/api/users/me/articles`)) ?? [];
	return data.map((item) => ({
		id: item.article_id,
		title: item.title,
		category: item.category,
	}));
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
