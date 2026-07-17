import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getArticles } from "../../api/articles";
import { Article, CategoryEnum, categoryLabel } from "../../types";
import ArticleCard from "../../ui/ArticleCard";
import styles from "./ArticleListPage.module.css";

const CATEGORIES: CategoryEnum[] = ["POLITICS", "ECONOMY", "SOCIETY"];

export default function ArticleListPage() {
	const [articles, setArticles] = useState<Article[]>([]);
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	const selectedCategory = searchParams.get(
		"category",
	) as CategoryEnum | null;

	useEffect(() => {
		const fetchArticles = async () => {
			const fetched = await getArticles();
			setArticles((prev) => fetched);
		};

		fetchArticles();
	}, []);

	const filteredArticles = selectedCategory
		? articles.filter((article) => article.category === selectedCategory)
		: articles;

	return (
		<div>
			<div className={styles.main}>
				<h1 className={styles.pageTitle}>전체 기사 보기</h1>
			</div>

			<div className={styles.categoryTabs}>
				<button
					className={styles.categoryTab}
					data-active={!selectedCategory}
					onClick={() => setSearchParams({})}
				>
					전체
				</button>

				{CATEGORIES.map((category) => (
					<button
						key={category}
						className={styles.categoryTab}
						data-active={selectedCategory === category}
						onClick={() => setSearchParams({ category })}
					>
						{categoryLabel(category)}
					</button>
				))}
			</div>

			<div className={styles.articleList}>
				{filteredArticles.length === 0 ? (
					<p className={styles.emptyState}>
						해당 카테고리의 기사가 없습니다.
					</p>
				) : (
					filteredArticles.map((article) => (
						<ArticleCard
							key={article.id}
							article={article}
							onDetailView={(articleId) => {
								navigate(`/articles/${articleId}`);
							}}
						/>
					))
				)}
			</div>
		</div>
	);
}
