export type GenderEnum = "MALE" | "FEMALE";
export type RegionEnum = "SEOUL" | "BUSAN" | "DAEGU" | "INCHEON" | "DAEJEON";
export type JobEnum =
	| "STUDENT"
	| "OFFICE_WORKER"
	| "DEVELOPER"
	| "JOB_SEEKER"
	| "ETC";
export type CategoryEnum = "POLITICS" | "ECONOMY" | "SOCIETY";

export type Article = {
	article_id: number;
	title: string;
	link: string;
	content: string;
	media: string;
	date?: Date;
	category?: CategoryEnum;
};

export type ArticleDetail = {
	article_id: number;
	title: string;
	link: string;
	content: string;
	media: string;
	date?: Date;
	category?: CategoryEnum;
	summary: string;
	keyword: string;
};

export type PersonalAnalysis = {
	effect: string;
	solution: string;
};

export type UserInfo = {
	user_id: number;
	age: number;
	gender: GenderEnum;
	region: RegionEnum;
	job: JobEnum;
	interest: CategoryEnum;
};
