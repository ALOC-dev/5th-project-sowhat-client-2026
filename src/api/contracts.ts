/* 요청/응답 형식 정의 */

export type ArticleResponse = {
	article_id: number;
	title: string;
	link: string;
	content: string;
	media: string;
};

export type ArticleDetailResponse = {
	article_id: number;
	title: string;
	link: string;
	content: string;
	media: string;
	summary: string;
	keyword: string;
};

export type PersonalAnalysis = {
	effect: string;
	solution: string;
};

export type ProfileResponse = {
	user_id: number;
	age: number;
	gender: string;
	region: string;
	job: string;
	interest: string;
};
