/* 요청/응답 형식 정의 */

import { KeywordItem } from "../types";

export type ArticleResponse = {
	id: number;
	title: string;
	source_url: string;
	publisher: string;
	published_at: string;
	content: string;
	category: string;
};

export type ArticleDetailResponse = {
	id: number;
	title: string;
	source_url: string;
	publisher: string;
	published_at: string;
	reporter: string;
	category: string;
	content: string;
	summary: string;
	keyword: KeywordItem[];
};

export type PersonalAnalysisResponse = {
	effect: string;
	solution: string;
};

export type UserCreateRequest = {
	age: number;
	gender: string;
	region: string;
	job: string;
	interest: string;
	purpose: string;
	extra_information: string;
};

export type UserUpdateRequest = {
	age?: number;
	gender?: string;
	region?: string;
	job?: string;
	interest?: string;
	purpose?: string;
	extra_information?: string;
};

export type UserResponse = {
	id: number;
	age: number;
	gender: string;
	region: string;
	job: string;
	interest: string;
	purpose: string;
	extra_information: string;
};

export type UserCreateResponse = {
	id: number;
	message?: string;
};
