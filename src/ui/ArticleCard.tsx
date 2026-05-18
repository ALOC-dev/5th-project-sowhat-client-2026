ArticleCard;

import { Article } from "../types";
import styled from "./ArticleCard.module.css";

// type Article = {
//   article_id: number;
//   title: string;
//   date: string;
//   content: string;
//   image: string;
// };

type ArticleCardProps = {
	article: Article;
	onDetailView: (articleId: number) => void;
};

export default function ArticleCard({
	article,
	onDetailView,
}: ArticleCardProps) {
	return (
		<div
			className={styled.articleCard}
			key={article.article_id}
			onClick={() => onDetailView(article.article_id)}
		>
			<h2 className={styled.articleTitle}>{article.title}</h2>
			<p className={styled.articleDate}>
				{article.date?.toDateString() ?? "2026-05-19"}
			</p>
			<p>{article.media}</p>
			<p className={styled.articleContent}>{article.content}</p>
		</div>
	);
}
