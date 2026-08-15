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
const PAGE_SIZE = 30;

export default function ArticleListPage({ isLogin }: { isLogin: boolean }) {
	const [articles, setArticles] = useState<Article[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [hasNext, setHasNext] = useState<boolean>(false);
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams, setSearchParams] = useSearchParams();
	const [experience, setExperience] = useState<ExperienceProfile | null>(
		null,
	);

	const selectedCategory = searchParams.get(
		"category",
	) as CategoryEnum | null;
	const page = Math.max(1, Number(searchParams.get("page")) || 1);

	useEffect(() => {
		const fetchPage = async () => {
			setIsLoading(true);
			try {
				const fetched = await getArticles({
					category: selectedCategory ?? undefined,
					limit: PAGE_SIZE,
					offset: (page - 1) * PAGE_SIZE,
				});
				setArticles(fetched);
				setHasNext(fetched.length === PAGE_SIZE);
			} finally {
				setIsLoading(false);
			}
		};

		fetchPage();
	}, [selectedCategory, page]);

	useEffect(() => {
		const profile = readExperienceProfile();
		if (!profile) return;
		setExperience(profile);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const goToPage = (nextPage: number) => {
		const next = new URLSearchParams(searchParams);
		next.set("page", String(nextPage));
		setSearchParams(next);
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
							navigate(
								`/login?redirect=${encodeURIComponent(
									location.pathname + location.search,
								)}`,
							)
						}
					>
						로그인하고 전체 해설 보기
					</button>
				</div>
			)}

			{isLogin && (
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
			)}

			<div className={styles.articleList}>
				{isLoading ? (
					<div
						className={styles.loadingState}
						role="status"
						aria-live="polite"
					>
						<span
							className={styles.loadingSpinner}
							aria-hidden="true"
						/>
						<strong>기사를 불러오고 있어요</strong>
						<span>잠시만 기다려 주세요.</span>
					</div>
				) : articles.length === 0 ? (
					<p className={styles.emptyState} role="status">
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

			{isLogin && !isLoading && (page > 1 || hasNext) && (
				<div className={styles.articleListFooter}>
					<button
						className={styles.moreButton}
						onClick={() => goToPage(page - 1)}
						disabled={page <= 1}
					>
						이전
					</button>
					<button
						className={styles.moreButton}
						onClick={() => goToPage(page + 1)}
						disabled={!hasNext}
					>
						다음
					</button>
				</div>
			)}
		</div>
	);
}
