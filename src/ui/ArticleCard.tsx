import { getCategoryImage } from "../lib/categoryImages";
import { formatDate } from "../lib/formatDate";
import { Article } from "../types";
import styled from "./ArticleCard.module.css";

type ArticleCardProps = {
	article: Article;
	onDetailView: (articleId: number) => void;
	size?: "sm" | "md" | "lg";
};

export default function ArticleCard({
	article,
	onDetailView,
	size = "md",
}: ArticleCardProps) {
	return (
		<div
			className={styled.articleCard}
			data-size={size}
			key={article.id}
			onClick={() => onDetailView(article.id)}
		>
			<div
				className={styled.thumbnail}
				style={{
					backgroundImage: `url(${getCategoryImage(article)})`,
				}}
			>
				{article.category && (
					<span
						className={styled.categoryChip}
						data-category={article.category}
					>
						{article.category}
					</span>
				)}
			</div>
			<h2 className={styled.articleTitle}>{article.title}</h2>
			<div className={styled.metaRow}>
				<span>{article.publisher}</span>
				<span>{formatDate(article.published_at)}</span>
			</div>
			<p className={styled.articleContent}>{article.content}</p>
		</div>
	);
}
