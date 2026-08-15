import { ExperienceProfile } from "../pages/Main/ExperienceModal";
import {
	Article,
	ArticleDetail,
	PersonalAnalysis,
	PersonalAnalysisLink,
	SimilarArticle,
} from "../types";
import { api, apiStream } from "./client";
import {
	ArticleDetailResponse,
	ArticleResponse,
	ExperienceAnalysisResponse,
	PersonalAnalysisEvent,
	PersonalAnalysisLinksEvent,
} from "./contracts";
import { toArticleDetail, toArticleList, toPersonalAnalysis } from "./mappers";

// 해설 반응(도움이 됐어요/별로예요) 제출: POST /api/articles/{article_id}/analysis/reaction
export async function submitAnalysisReaction(
	articleId: number,
	value: "up" | "down",
): Promise<void> {
	await api(`/api/articles/${articleId}/analysis/reaction`, {
		method: "POST",
		body: JSON.stringify({
			user_response: value === "up" ? "도움이 됐어요" : "별로예요",
		}),
	});
}

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

// 개별 기사 + 공통해설 조회: GET /api/articles/{articleId}
export async function getArticleDetail(
	articleId: number,
): Promise<ArticleDetail | void> {
	const data = await api<ArticleDetailResponse>(`/api/articles/${articleId}`);
	return toArticleDetail(data);
}

// 비로그인 시 미리보기 해설 조회: GET /api/articles/{article_id/analysis/experience
export async function getExperienceAnalysis(
	articleId: number,
	experienceProfile: ExperienceProfile,
): Promise<PersonalAnalysis | void> {
	const data = await api<ExperienceAnalysisResponse>(
		`/api/articles/${articleId}/analysis/experience?age-group=${experienceProfile.ageGroup}&job=${experienceProfile.job}&interest=${experienceProfile.interest}`,
	);
	return toPersonalAnalysis(data);
}

export type PersonalAnalysisStreamHandlers = {
	onAnalysis?: (data: {
		effect: string;
		solution: string;
		links: PersonalAnalysisLink[] | null;
		similarArticles: SimilarArticle[];
	}) => void;
	onLinks?: (links: PersonalAnalysisLink[]) => void;
	onError?: (message: string) => void;
	onDone?: () => void;
};

// 개인별 해설 조회: GET /api/articles/{article_id}/analysis/stream
// analysis, links 이벤트가 도착하는 순서대로 handlers를 통해 전달한다
export function streamPersonalAnalysis(
	articleId: number,
	handlers: PersonalAnalysisStreamHandlers,
): AbortController {
	const controller = new AbortController();

	apiStream(
		`/api/articles/${articleId}/analysis/stream`,
		(event, data) => {
			if (!data) return;

			switch (event) {
				case "analysis": {
					const parsed = JSON.parse(data) as PersonalAnalysisEvent;
					handlers.onAnalysis?.({
						effect: parsed.effect,
						solution: parsed.solution,
						links: parsed.links,
						similarArticles: (parsed.similar_articles ?? []).map(
							(a) => ({
								title: a.title,
								published_at: a.published_at,
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
