import { Article, categoryLabel } from "../types";
import styled from "./ArticleCard.module.css";

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
			{article.category && (
				<span
					className={styled.categoryChip}
					data-category={article.category}
				>
					{categoryLabel(article.category)}
				</span>
			)}
			<h2 className={styled.articleTitle}>{article.title}</h2>
			<div className={styled.metaRow}>
				<span>{article.media}</span>
				<span>{article.date?.toDateString() ?? "2026-05-19"}</span>
			</div>
			<p className={styled.articleContent}>{article.content}</p>
		</div>
	);
}
