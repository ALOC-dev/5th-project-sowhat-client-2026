import "./ArticleCard.css";

export default function ArticleCard({ article, onDetailView }) {
	return (
		<div
			className="article-card"
			key={article.article_id}
			onClick={()=>onDetailView(article.article_id)}
		>
			<h2 className="article-title">{article.title}</h2>
			<p className="article-date">{article.date}</p>
			<p className="article-content">{article.content}</p>
		</div>
	);
}
