import { useNavigate } from "react-router-dom";
import { getArticles } from "../../api/articles";
import ArticleCard from "../../ui/ArticleCard";
import * as styles from "./ArticleListPage.style";

export default function ArticleListPage() {
	const articles = getArticles();
	const navigate = useNavigate();

	return (
		<div >
			<div style={styles.mainStyle}>
				<h1 style={styles.pageTitleStyle}>전체 기사 보기</h1>
			</div>
			<div style={styles.articleListStyle}>
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
