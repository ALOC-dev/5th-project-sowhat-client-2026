import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getArticles } from "../../api/articles";
import { Article, User } from "../../types";
import ArticleCard from "../../ui/ArticleCard";
import ExperienceModal, {
	clearExperienceProfile,
} from "./ExperienceModal";
import styles from "./MainPage.module.css";

const HOW_IT_WORKS = [
	{
		n: "01",
		title: "공통 해설",
		desc: "요약·키워드로 기사 핵심을 빠르게 파악",
		icon: "📋",
	},
	{
		n: "02",
		title: "나에게 오는 영향",
		desc: "AI가 내 상황 기반으로 직접적 영향 분석",
		icon: "✨",
	},
	{
		n: "03",
		title: "실전 대비 방법",
		desc: "상황별 구체적인 행동 가이드 제공",
		icon: "✅",
	},
];

const getGreeting = (): string => {
	const hour = new Date().getHours();
	if (hour < 11) return "좋은 아침입니다";
	if (hour < 18) return "오늘도 좋은 하루예요";
	return "편안한 저녁 되세요";
};

type MainPageProps = {
	isLogin: boolean;
	user: User | null;
};

export default function MainPage({ isLogin, user }: MainPageProps) {
	const navigate = useNavigate();
	const [showExperience, setShowExperience] = useState(false);
	const [recommended, setRecommended] = useState<Article[]>([]);

	useEffect(() => {
		if (!isLogin) return;
		const fetchRecommended = async () => {
			const fetched = await getArticles();
			setRecommended(fetched.slice(0, 5));
		};
		fetchRecommended();
	}, [isLogin]);

	return (
		<div className={styles.mainPage}>
			<section className={styles.hero}>
				<div className={styles.heroOverlay} />
				<div className={styles.heroContent}>
					{isLogin ? (
						<>
							<p className={styles.eyebrow}>
								WELCOME BACK
							</p>
							<h1 className={styles.headline}>
								{user?.username ?? "회원"}님,
								<br />
								<em className={styles.headlineAccent}>
									{getGreeting()}
								</em>
							</h1>
							<p className={styles.subtitle}>
								오늘도 놓치기 쉬운 소식을 나에게 맞게 정리해
								드릴게요
							</p>
							<div className={styles.heroButtons}>
								<button
									className={styles.primaryButton}
									onClick={() => navigate("/articles")}
								>
									뉴스 보러가기
								</button>
							</div>
						</>
					) : (
						<>
							<p className={styles.eyebrow}>
								뉴스가 어려운 건 내 얘기인지 몰라서다
							</p>
							<h1 className={styles.headline}>
								당신의 첫 뉴스 입문,
								<br />
								<em className={styles.headlineAccent}>
									So What?
								</em>
								에서
								<br />
								시작하세요
							</h1>
							<p className={styles.subtitle}>
								복잡한 뉴스를 쉽게 요약하고, AI가 이 소식이
								나에게 어떤 영향을 미치는지 분석해 드려요
							</p>
							<div className={styles.heroButtons}>
								<button
									className={styles.primaryButton}
									onClick={() => navigate("/signup")}
								>
									지금 시작하기
								</button>
								<button
									className={styles.ghostButton}
									onClick={() => {
										clearExperienceProfile();
										setShowExperience(true);
									}}
								>
									뉴스 둘러보기
								</button>
							</div>
						</>
					)}
				</div>
			</section>

			{showExperience && (
				<ExperienceModal
					onClose={() => {
						setShowExperience(false);
						navigate("/articles");
					}}
				/>
			)}

			{isLogin ? (
				<section className={styles.recommendSection}>
					<div className={styles.howHeader}>
						<p className={styles.howEyebrow}>오늘의 추천</p>
						<h2 className={styles.howTitle}>
							회원님을 위해 골라봤어요
						</h2>
						<p className={styles.howSubtitle}>
							관심분야와 최신 이슈를 바탕으로 추천하는
							기사예요
						</p>
					</div>

					<div className={styles.recommendGrid}>
						{recommended.map((article, i) => (
							<div
								key={article.id}
								className={styles.recommendItem}
								data-slot={i === 0 ? "featured" : "normal"}
							>
								<ArticleCard
									article={article}
									size={i === 0 ? "lg" : "md"}
									onDetailView={(articleId) =>
										navigate(`/articles/${articleId}`)
									}
								/>
							</div>
						))}
					</div>

					<div className={styles.recommendFooter}>
						<button
							className={styles.moreButton}
							onClick={() => navigate("/articles")}
						>
							기사 더보기
						</button>
					</div>
				</section>
			) : (
				<section className={styles.howSection}>
					<div className={styles.howHeader}>
						<p className={styles.howEyebrow}>이렇게 작동해요</p>
						<h2 className={styles.howTitle}>
							기사 읽기부터 실전 대응까지
						</h2>
						<p className={styles.howSubtitle}>
							왼쪽엔 기사, 오른쪽엔 AI 해설 — 같은 화면에서
							한번에
						</p>
					</div>

					<div className={styles.howGrid}>
						{HOW_IT_WORKS.map((step) => (
							<div key={step.n} className={styles.howCard}>
								<div className={styles.howIcon}>
									{step.icon}
								</div>
								<p className={styles.howNumber}>{step.n}</p>
								<h3 className={styles.howCardTitle}>
									{step.title}
								</h3>
								<p className={styles.howCardDesc}>
									{step.desc}
								</p>
							</div>
						))}
					</div>
				</section>
			)}

			<footer className={styles.footer}>
				© 2026 So What? — 나를 위한 뉴스 해설
			</footer>
		</div>
	);
}
