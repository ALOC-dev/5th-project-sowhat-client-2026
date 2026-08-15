import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getArticles } from "../../api/articles";
import { Article, CategoryEnum } from "../../types";
import ArticleCard from "../../ui/ArticleCard";
import {
	ExperienceProfile,
	readExperienceProfile,
} from "../Main/ExperienceModal";
import styles from "./ArticleListPage.module.css";

const CATEGORIES = Object.values(CategoryEnum);
const PAGE_SIZE = 15;

export default function ArticleListPage({ isLogin }: { isLogin: boolean }) {
	const [articles, setArticles] = useState<Article[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
	const [hasMore, setHasMore] = useState<boolean>(false);
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams, setSearchParams] = useSearchParams();
	const [experience, setExperience] = useState<ExperienceProfile | null>(
		null,
	);

	const selectedCategory = searchParams.get(
		"category",
	) as CategoryEnum | null;

	useEffect(() => {
		const fetchArticles = async () => {
			setIsLoading(true);
			try {
				const fetched = await getArticles({
					category: selectedCategory ?? undefined,
					limit: PAGE_SIZE,
					offset: 0,
				});
				setArticles(fetched);
				setHasMore(fetched.length === PAGE_SIZE);
			} finally {
				setIsLoading(false);
			}
		};

		fetchArticles();
	}, [selectedCategory]);

	useEffect(() => {
		const profile = readExperienceProfile();
		if (!profile) return;
		setExperience(profile);

		if (!searchParams.get("category")) {
			setSearchParams({ category: profile.interest });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleLoadMore = async () => {
		if (isLoadingMore) return;
		setIsLoadingMore(true);
		try {
			const fetched = await getArticles({
				category: selectedCategory ?? undefined,
				limit: PAGE_SIZE,
				offset: articles.length,
			});
			setArticles((prev) => [...prev, ...fetched]);
			setHasMore(fetched.length === PAGE_SIZE);
		} finally {
			setIsLoadingMore(false);
		}
	};

	return (
		<div>
			<div className={styles.main}>
				<h1 className={styles.pageTitle}>전체 기사 보기</h1>
			</div>

			{experience && !isLogin && (
				<div className={styles.experienceBanner}>
					<p className={styles.experienceText}>
						<strong>{experience.job}</strong>이신 분들이 많이 보는{" "}
						<strong>{experience.interest}</strong> 뉴스를
						모아봤어요. 간단한 해설은 바로 볼 수 있고, 나에게 맞춘
						자세한 해설은 로그인하면 확인할 수 있어요.
					</p>
					<button
						className={styles.experienceCta}
						onClick={() =>
							navigate(`/login?redirect=${location.pathname}`)
						}
					>
						로그인하고 전체 해설 보기
					</button>
				</div>
			)}

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
						{category}
					</button>
				))}
			</div>

			<div className={styles.articleList}>
				{isLoading ? (
					<p className={styles.emptyState}>기사 불러오는 중...</p>
				) : articles.length === 0 ? (
					<p className={styles.emptyState}>
						해당 카테고리의 기사가 없습니다.
					</p>
				) : (
					articles.map((article) => (
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

			{!isLoading && hasMore && (
				<div className={styles.moreRow}>
					<button
						className={styles.moreButton}
						onClick={handleLoadMore}
						disabled={isLoadingMore}
					>
						{isLoadingMore ? "불러오는 중..." : "더보기"}
					</button>
				</div>
			)}
		</div>
	);
}
