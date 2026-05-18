import * as styles from "./ArticleCard.style";

type Article = {
  article_id: number;
  title: string;
  date: string;
  content: string;
  image: string;
};

type ArticleCardProps = {
  article: Article;
  onDetailView: (articleId: number) => void;
};

export default function ArticleCard({ article, onDetailView }: ArticleCardProps) {
	return (
		<div
			style={styles.articleCardStyle}
			key={article.article_id}
			onClick={()=>onDetailView(article.article_id)}
		>
			<h2 style={styles.articleTitleStyle}>{article.title}</h2>
			<p style={styles.articleDateStyle}>{article.date}</p>
			<p style={styles.articleContentStyle}>{article.content}</p>
		</div>
	);
}
