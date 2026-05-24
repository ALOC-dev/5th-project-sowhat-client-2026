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

export const genderLabel = (gender: GenderEnum): string =>
	gender == "MALE" ? "남" : "여";

export const regionLabel = (region: RegionEnum): string =>
	region == "SEOUL"
		? "서울"
		: region == "BUSAN"
			? "부산"
			: region == "DAEGU"
				? "대구"
				: region == "INCHEON"
					? "인천"
					: "대전";

export const jobLabel = (job: JobEnum): string =>
	job == "STUDENT"
		? "대학생"
		: job == "OFFICE_WORKER"
			? "직장인"
			: job == "DEVELOPER"
				? "개발자"
				: job == "JOB_SEEKER"
					? "취업준비생"
					: "기타";

export const categoryLabel = (category: CategoryEnum): string =>
	category == "POLITICS" ? "정치" : category == "ECONOMY" ? "경제" : "사회";
