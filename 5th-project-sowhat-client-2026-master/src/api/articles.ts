/* 뉴스 기사 Mock data */
// const MOCK_ARTICLES = [
// 	{
// 		article_id: 1,
// 		image: "",
// 		title: "첫 번째 기사",
// 		date: "2026-03-31",
// 		content: "이것은 첫 번째 기사 내용 일부입니다.",
// 	},
// 	{
// 		article_id: 2,
// 		image: "",
// 		title: "두 번째 기사",
// 		date: "2026-03-30",
// 		content: "이것은 두 번째 기사 내용 일부입니다.",
// 	},
// 	{
// 		article_id: 3,
// 		image: "",
// 		title: "세 번째 기사",
// 		date: "2026-03-29",
// 		content: "이것은 세 번째 기사 내용 일부입니다.",
// 	},
// ];

import { Article, ArticleDetail, PersonalAnalysis } from "../types";
import { api } from "./client";
import {
	ArticleDetailResponse,
	ArticleResponse,
	PersonalAnalysisResponse,
} from "./contracts";
import { toArticleDetail, toPersonalAnalysis } from "./mappers";

// 전체 기사 조회: GET /api/articles
export async function getArticles(): Promise<Article[]> {
	const data = (await api<ArticleResponse[]>(`/api/articles`)) ?? [];
	return data;
}

// 개별 기사 + 공통해설 조회: GET /api/articles/{article_id}
export async function getArticleDetail(
	article_id: number,
): Promise<ArticleDetail | void> {
	const data = await api<ArticleDetailResponse>(
		`/api/articles/${article_id}`,
	);
	return toArticleDetail(data);
}

// 개인별 해설 조회: GET /api/articles/analysis?article_id=xxx&user_id=xxx
export async function getPersonalAnalysis(
	article_id: number,
	user_id: number,
): Promise<PersonalAnalysis | void> {
	const data = await api<PersonalAnalysisResponse>(
		`/api/articles/analysis?article_id=${article_id}&user_id=${user_id}`,
	);
	return toPersonalAnalysis(data);
}
