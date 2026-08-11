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

import {
	Article,
	ArticleDetail,
	PersonalAnalysisLink,
	SimilarArticle,
} from "../types";
import { api, apiStream } from "./client";
import {
	ArticleDetailResponse,
	ArticleResponse,
	PersonalAnalysisEvent,
	PersonalAnalysisLinksEvent,
} from "./contracts";
import { toArticleDetail, toArticleList } from "./mappers";

// 전체 기사 조회: GET /api/articles
export async function getArticles(): Promise<Article[]> {
	const data = (await api<ArticleResponse[]>(`/api/articles`)) ?? [];
	return toArticleList(data);
}

// 추천 기사 조회: GET /api/articles/recommendations
export async function getRecommendedArticles(): Promise<Article[]> {
	const data =
		(await api<ArticleResponse[]>(`/api/articles/recommendations`)) ?? [];
	return toArticleList(data);
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

export type PersonalAnalysisStreamHandlers = {
	onAnalysis?: (data: {
		effect: string;
		solution: string;
		links: PersonalAnalysisLink[];
		similarArticles: SimilarArticle[];
	}) => void;
	onLinks?: (links: PersonalAnalysisLink[]) => void;
	onError?: (message: string) => void;
	onDone?: () => void;
};

// 개인별 해설 조회: GET /api/articles/{article_id}/analysis/stream
// analysis, links 이벤트가 도착하는 순서대로 handlers를 통해 전달한다
export function streamPersonalAnalysis(
	article_id: number,
	handlers: PersonalAnalysisStreamHandlers,
): AbortController {
	const controller = new AbortController();

	apiStream(
		`/api/articles/${article_id}/analysis/stream`,
		(event, data) => {
			if (!data) return;

			switch (event) {
				case "analysis": {
					const parsed = JSON.parse(data) as PersonalAnalysisEvent;
					handlers.onAnalysis?.({
						effect: parsed.effect,
						solution: parsed.solution,
						links: parsed.links ?? [],
						similarArticles: (parsed.similar_articles ?? []).map(
							(a) => ({
								title: a.title,
								publisher: a.publisher,
								sourceUrl: a.source_url,
							}),
						),
					});
					break;
				}
				case "links": {
					const parsed = JSON.parse(
						data,
					) as PersonalAnalysisLinksEvent;
					handlers.onLinks?.(parsed);
					break;
				}
				case "error": {
					handlers.onError?.(data);
					break;
				}
				case "done": {
					handlers.onDone?.();
					break;
				}
			}
		},
		controller.signal,
	).catch((err) => {
		if (controller.signal.aborted) return;
		handlers.onError?.(err instanceof Error ? err.message : String(err));
	});

	return controller;
}
