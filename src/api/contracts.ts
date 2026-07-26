/* 요청/응답 형식 정의 */

import { CategoryEnum, GenderEnum, KeywordItem, PurposeEnum } from "../types";

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

export type PersonalAnalysisResponse = {
	effect: string;
	solution: string;
	links: Object[];
};

export type UserCreateRequest = {
	login_id: string;
	username: string;
	age: number;
	gender: GenderEnum;
	region: string;
	job: string;
	interest: CategoryEnum;
	purpose: PurposeEnum;
	extra_information: string;
};

export type UserUpdateRequest = {
	username?: string;
	age?: number;
	gender?: GenderEnum;
	region?: string;
	job?: string;
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
	region: string;
	job: string;
	interest: CategoryEnum;
	purpose: PurposeEnum;
	extra_information: string;
};

export type UserCreateResponse = {
	id: number;
	message?: string;
};
