import { useNavigate } from "react-router-dom";
import { getArticles } from "../api/articles";
import ArticleCard from "../ui/ArticleCard";
import "./ArticleListPage.css";

export default function ArticleListPage() {
	const articles = getArticles();
	const navigate = useNavigate();

	return (
		<div className="page">
			<div className="main">
				<h1 className="page-title">전체 기사 보기</h1>
			</div>
			<div className="article-list">
				{articles.map((article) => (
					<ArticleCard
						key={article.article_id}
						article={article}
						onDetailView={(article_id) => {
							navigate(`/articles/${article_id}`);
						}}
					/>
				))}
			</div>
		</div>
	);
}
