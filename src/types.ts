export type GenderEnum = "MALE" | "FEMALE";
export type RegionEnum = "SEOUL" | "BUSAN" | "DAEGU" | "INCHEON" | "DAEJEON";
export type JobEnum =
	| "STUDENT"
	| "OFFICE_WORKER"
	| "DEVELOPER"
	| "JOB_SEEKER"
	| "ETC";
export type CategoryEnum = "POLITICS" | "ECONOMY" | "SOCIETY" | "INDUSTRY_IT";
export type PurposeEnum =
	| "EMPLOYMENT"
	| "INVESTMENT"
	| "POLICY"
	| "INDUSTRY"
	| "SOCIAL"
	| "STUDY"
	| "STARTUP"
	| "TECH"
	| "GENERAL";

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
};

export type User = {
	id: number;
	age: number;
	gender: GenderEnum;
	region: RegionEnum;
	job: JobEnum;
	interest: CategoryEnum;
	purpose: PurposeEnum;
	extra_information: string;
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
	category == "POLITICS"
		? "정치"
		: category == "ECONOMY"
			? "경제"
			: category == "SOCIETY"
				? "사회"
					: "산업/IT";

export const purposeLabel = (purpose: PurposeEnum): string =>
	purpose == "EMPLOYMENT"
		? "취업준비"
		: purpose == "INVESTMENT"
			? "투자"
			: purpose == "POLICY"
				? "정책"
				: purpose == "INDUSTRY"
					? "산업"
					: purpose == "SOCIAL"
						? "사회"
						: purpose == "STUDY"
							? "학습"
							: purpose == "STARTUP"
								? "창업"
								: purpose == "TECH"
									? "기술"
									: "일반";
