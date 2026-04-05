import { getArticles } from "../api/articles";
import ArticleCard from "../ui/ArticleCard";
import "./ArticleListPage.css";

export default function ArticleListPage() {
	const articles = getArticles();

	return (
		<div className="page">
			<div className="main">
				<h1 className="page-title">전체 기사 보기</h1>
			</div>
			<div className="article-list">
				{articles.map((article) => (
					<ArticleCard
						article={article}
						onDetailView={(article_id) => {}}
					/>
				))}
			</div>
		</div>
	);
}
