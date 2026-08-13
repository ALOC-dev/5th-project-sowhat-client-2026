/* 요청/응답 형식 정의 */

import {
	CategoryEnum,
	GenderEnum,
	JobEnum,
	KeywordItem,
	PurposeEnum,
	RegionEnum,
} from "../types";

export type ArticleResponse = {
	id: number;
	title: string;
	source_url: string;
	publisher: string;
	published_at: string;
	content: string;
	category: CategoryEnum;
};

export type ArticleDetailResponse = {
	id: number;
	title: string;
	source_url: string;
	publisher: string;
	published_at: string;
	reporter: string;
	category: CategoryEnum;
	content: string;
	summary: string;
	keyword: KeywordItem[];
};

export type ExperienceAnalysisResponse = {
	effect: string;
};

export type PersonalAnalysisLinkResponse = { title: string; url: string };

export type SimilarArticleResponse = {
	title: string;
	published_at: string;
	publisher: string;
	source_url: string;
};

// GET /api/articles/{article_id}/analysis/stream 의 "analysis" 이벤트 데이터
// (PersonalAnalysis 테이블 row를 그대로 직렬화한 형태)
export type PersonalAnalysisEvent = {
	id: number | null;
	effect: string;
	solution: string;
	links: PersonalAnalysisLinkResponse[] | null;
	similar_articles: SimilarArticleResponse[] | null;
};

// 같은 스트림의 "links" 이벤트 데이터
export type PersonalAnalysisLinksEvent = PersonalAnalysisLinkResponse[];

export type ViewedArticleResponse = {
	article_id: number;
	title: string;
	category: CategoryEnum;
};

export type UserCreateRequest = {
	login_id: string;
	password: string;
	username: string;
	age: number;
	gender: GenderEnum;
	region: RegionEnum;
	job: JobEnum;
	interest: CategoryEnum;
	purpose: PurposeEnum;
	extra_information: string;
};

export type UserUpdateRequest = {
	username?: string;
	age?: number;
	gender?: GenderEnum;
	region?: RegionEnum;
	job?: JobEnum;
	interest?: CategoryEnum;
	purpose?: PurposeEnum;
	extra_information?: string;
};

export type UserResponse = {
	id: number;
	login_id: string;
	username: string;
	age: number;
	gender: GenderEnum;
	region: RegionEnum;
	job: JobEnum;
	interest: CategoryEnum;
	purpose: PurposeEnum;
	extra_information: string;
};

export type UserCreateResponse = {
	id: number;
	message?: string;
};

export type LoginRequest = {
	login_id: string;
	password: string;
};

export type LoginResponse = {
	id: number;
	message?: string;
};
