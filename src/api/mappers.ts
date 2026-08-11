import { Article, ArticleDetail, User } from "../types";
import { ArticleDetailResponse, ArticleResponse, UserResponse } from "./contracts";

export const toArticle = (res: ArticleResponse | void): Article | void => {
	return res
		? {
				id: res.id,
				title: res.title,
				source_url: res.source_url,
				publisher: res.publisher,
				published_at: new Date(res.published_at),
				category: res.category,
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
				category: res.category,
				content: res.content,
				summary: res.summary,
				keyword: res.keyword,
			}
		: undefined;
};

export const toUser = (res: UserResponse | void): User | void => {
	return res
		? {
				id: res.id,
				login_id: res.login_id,
				username: res.username,
				age: res.age,
				gender: res.gender,
				region: res.region,
				job: res.job,
				interest: res.interest,
				purpose: res.purpose,
				extra_information: res.extra_information,
			}
		: undefined;
};
