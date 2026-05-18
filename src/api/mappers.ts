import {
	Article,
	ArticleDetail,
	CategoryEnum,
	GenderEnum,
	JobEnum,
	PersonalAnalysis,
	RegionEnum,
	UserInfo,
} from "../types";
import {
	ArticleDetailResponse,
	ArticleResponse,
	PersonalAnalysisResponse,
	ProfileResponse,
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
			: "SOCIETY";
};

export const toArticle = (res: ArticleResponse | void): Article | void => {
	return res == undefined
		? res
		: {
				article_id: res.article_id,
				title: res.title,
				link: res.link,
				content: res.content,
				media: res.media,
			};
};

export const toArticleList = (res: ArticleResponse[]): Article[] => {
	return res.map((a) => a ?? toArticle(a));
};

export const toArticleDetail = (
	res: ArticleDetailResponse | void,
): ArticleDetail | void => {
	return res == undefined
		? res
		: {
				article_id: res.article_id,
				title: res.title,
				link: res.link,
				content: res.content,
				media: res.media,
				summary: res.summary,
				keyword: res.keyword,
			};
};

export const toPersonalAnalysis = (
	res: PersonalAnalysisResponse | void,
): PersonalAnalysis | void => {
	return res == undefined
		? res
		: {
				effect: res.effect,
				solution: res.solution,
			};
};

export const toUserInfo = (res: ProfileResponse | void): UserInfo | void => {
	return res == undefined
		? res
		: {
				user_id: res.user_id,
				age: res.age,
				gender: stringToGender(res.gender),
				region: stringToRegion(res.region),
				job: stringToJob(res.job),
				interest: stringToCategory(res.interest),
			};
};
