import {
	Article,
	ArticleDetail,
	CategoryEnum,
	GenderEnum,
	JobEnum,
	PersonalAnalysis,
	PurposeEnum,
	RegionEnum,
	User,
} from "../types";
import {
	ArticleDetailResponse,
	ArticleResponse,
	PersonalAnalysisResponse,
	UserResponse,
} from "./contracts";

const stringToGender = (inputStr: string): GenderEnum => {
	inputStr = inputStr.trim().toUpperCase();
	return inputStr == "MALE" ? "MALE" : "FEMALE";
};

const stringToRegion = (inputStr: string): RegionEnum => {
	inputStr = inputStr.trim().toUpperCase();
	return inputStr == "SEOUL"
		? "SEOUL"
		: inputStr == "BUSAN"
			? "BUSAN"
			: inputStr == "DAEGU"
				? "DAEGU"
				: inputStr == "INCHEON"
					? "INCHEON"
					: "DAEJEON";
};

const stringToJob = (inputStr: string): JobEnum => {
	inputStr = inputStr.trim().toUpperCase();
	return inputStr == "STUDENT"
		? "STUDENT"
		: inputStr == "OFFICE_WORKER"
			? "OFFICE_WORKER"
			: inputStr == "DEVELOPER"
				? "DEVELOPER"
				: inputStr == "JOB_SEEKER"
					? "JOB_SEEKER"
					: "ETC";
};

const stringToCategory = (inputStr: string): CategoryEnum => {
	inputStr = inputStr.trim().toUpperCase();
	return inputStr == "POLITICS"
		? "POLITICS"
		: inputStr == "ECONOMY"
			? "ECONOMY"
			: inputStr == "SOCIETY"
				? "SOCIETY"
				: "INDUSTRY_IT";
};

const stringToPurpose = (inputStr: string): PurposeEnum => {
	inputStr = inputStr.trim().toUpperCase();
	return inputStr == "EMPLOYMENT"
		? "EMPLOYMENT"
		: inputStr == "INVESTMENT"
			? "INVESTMENT"
			: inputStr == "POLICY"
				? "POLICY"
				: inputStr == "INDUSTRY"
					? "INDUSTRY"
					: inputStr == "SOCIAL"
						? "SOCIAL"
						: inputStr == "STUDY"
							? "STUDY"
							: inputStr == "STARTUP"
								? "STARTUP"
								: inputStr == "TECH"
									? "TECH"
									: "GENERAL";
};

export const toArticle = (res: ArticleResponse | void): Article | void => {
	return res
		? {
				id: res.id,
				title: res.title,
				source_url: res.source_url,
				publisher: res.publisher,
				published_at: new Date(res.published_at),
				category: stringToCategory(res.category),
				content: res.content,
			}
		: undefined;
};

export const toArticleList = (res: ArticleResponse[]): Article[] => {
	const mapped = res.map((a) => toArticle(a));
	return mapped.filter((v) => v != undefined);
};

export const toArticleDetail = (
	res: ArticleDetailResponse | void,
): ArticleDetail | void => {
	return res
		? {
				id: res.id,
				title: res.title,
				source_url: res.source_url,
				publisher: res.publisher,
				published_at: new Date(res.published_at),
				reporter: res.reporter,
				category: stringToCategory(res.category),
				content: res.content,
				summary: res.summary,
				keyword: res.keyword,
			}
		: undefined;
};

export const toPersonalAnalysis = (
	res: PersonalAnalysisResponse | void,
): PersonalAnalysis | void => {
	return res
		? {
				effect: res.effect,
				solution: res.solution,
			}
		: undefined;
};

export const toUser = (res: UserResponse | void): User | void => {
	return res
		? {
				id: res.id,
				age: res.age,
				gender: stringToGender(res.gender),
				region: stringToRegion(res.region),
				job: stringToJob(res.job),
				interest: stringToCategory(res.interest),
				purpose: stringToPurpose(res.purpose),
				extra_information: res.extra_information,
			}
		: undefined;
};
