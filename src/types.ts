export type GenderEnum = "남" | "여";
// export type RegionEnum = "SEOUL" | "BUSAN" | "DAEGU" | "INCHEON" | "DAEJEON";
// export type JobEnum = ""
export type CategoryEnum = "정치" | "경제" | "사회" | "산업/IT";
export type PurposeEnum = "일반" | "공부" | "취·창업" | "투자";

export type KeywordItem = {
	word: string;
	description: string;
};

export type Article = {
	id: number;
	title: string;
	source_url: string;
	publisher: string;
	published_at: Date;
	category: CategoryEnum;
	content: string;
};

export type ArticleDetail = {
	id: number;
	title: string;
	source_url: string;
	publisher: string;
	published_at: Date;
	reporter: string;
	category: CategoryEnum;
	content: string;
	summary: string;
	keyword: KeywordItem[];
};

export type PersonalAnalysis = {
	effect: string;
	solution: string;
	links: string[];
};

export type User = {
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
