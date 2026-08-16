import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRecommendedArticles } from "../../api/articles";
import { updateUser } from "../../api/users";
import { Article, CategoryEnum, User } from "../../types";
import ArticleCard from "../../ui/ArticleCard";
import ExperienceModal, { clearExperienceProfile } from "./ExperienceModal";
import styles from "./MainPage.module.css";

// 기존 추가 정보 뒤에 새 내용을 이어붙이면서, 각 줄 앞에 점(•)을 달아 항목을 구분한다
function appendExtraInfo(existing: string, addition: string): string {
	const trimmedAddition = addition.trim();
	if (!trimmedAddition) return existing;

	const bulletedAddition = `• ${trimmedAddition}`;
	if (!existing.trim()) return bulletedAddition;

	const bulletedExisting = existing
		.trim()
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line) => (line.startsWith("•") ? line : `• ${line}`))
		.join("\n");

	return `${bulletedExisting}\n${bulletedAddition}`;
}

const HOW_IT_WORKS = [
	{
		n: "01",
		title: "관심사 기반 추천 뉴스",
		desc: "관심분야와 최신 이슈를\n바탕으로 뉴스 추천",
		icon: "🎯",
	},
	{
		n: "02",
		title: "기사 요약 · 핵심 키워드 해설",
		desc: "어려운 기사도\n요약과 키워드 설명으로 쉽게",
		icon: "📋",
	},
	{
		n: "03",
		title: "나에게 오는 영향 AI 분석",
		desc: "내 상황 기반 영향 분석과\n참고 링크까지 함께 제공",
		icon: "✨",
	},
];

const MOCKUP_RECOMMENDED: Article[] = [
	{
		id: -1,
		title: "한국은행 기준금리 동결",
		source_url: "#",
		publisher: "연합뉴스",
		published_at: new Date("2026-08-16"),
		category: CategoryEnum.ECONOMY,
		content:
			"(서울=연합뉴스) 한국은행 금융통화위원회는 16일 기준금리를 현 수준인 연 2.25%로 동결했다. 가계부채 증가세와 물가 상승 압력을 함께 고려한 결정이라고 밝혔다...",
	},
	{
		id: -2,
		title: "코스피 2주 연속 상승…외국인 순매수 전환",
		source_url: "#",
		publisher: "연합뉴스",
		published_at: new Date("2026-08-16"),
		category: CategoryEnum.ECONOMY,
		content:
			"(서울=연합뉴스) 코스피가 외국인 투자자의 순매수 전환에 힘입어 2주 연속 상승세를 이어갔다...",
	},
	{
		id: -3,
		title: "청년 전세자금대출 금리 0.3%p 인하",
		source_url: "#",
		publisher: "연합뉴스",
		published_at: new Date("2026-08-15"),
		category: CategoryEnum.ECONOMY,
		content:
			"(서울=연합뉴스) 주택도시기금이 청년 전세자금대출 금리를 0.3%포인트 인하한다고 밝혔다...",
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
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export default function MainPage({ isLogin, user, setUser }: MainPageProps) {
	const navigate = useNavigate();
	const [isRecommendationsLoading, setIsRecommendationsLoading] =
		useState(false);
	const [showExperience, setShowExperience] = useState(false);
	const [recommended, setRecommended] = useState<Article[]>([]);
	const recommendSectionRef = useRef<HTMLElement | null>(null);

	const [extraInfoInput, setExtraInfoInput] = useState("");
	const [isSubmittingExtraInfo, setIsSubmittingExtraInfo] = useState(false);
	const [extraInfoSaved, setExtraInfoSaved] = useState(false);
	const [isExtraInfoFocused, setIsExtraInfoFocused] = useState(false);

	useEffect(() => {
		if (!isLogin) return;
		const fetchRecommended = async () => {
			setIsRecommendationsLoading(true);
			try {
				const fetched = await getRecommendedArticles();
				setRecommended(fetched.slice(0, 5));
			} finally {
				setIsRecommendationsLoading(false);
			}
		};
		fetchRecommended();
	}, [isLogin]);

	const handleSubmitExtraInfo = async () => {
		if (!extraInfoInput.trim() || isSubmittingExtraInfo) return;
		setIsSubmittingExtraInfo(true);
		try {
			const merged = appendExtraInfo(
				user?.extra_information ?? "",
				extraInfoInput,
			);
			const updated = await updateUser({ extra_information: merged });
			if (updated) setUser(updated);
			setExtraInfoInput("");
			setExtraInfoSaved(true);
			setTimeout(() => setExtraInfoSaved(false), 2500);
		} finally {
			setIsSubmittingExtraInfo(false);
		}
	};

	return (
		<div className={styles.mainPage}>
			<section className={styles.hero}>
				<div className={styles.heroOverlay} />
				<div className={styles.heroContent}>
					{isLogin ? (
						<>
							<p className={styles.eyebrow}>WELCOME BACK</p>
							<h1 className={styles.headline}>
								{user?.username ?? "회원"}님,
								<br />
								<em className={styles.headlineAccent}>
									{getGreeting()}
								</em>
							</h1>
							<div className={styles.heroExtraInfo}>
								<div className={styles.heroExtraInfoField}>
									<input
										type="text"
										className={styles.heroExtraInfoInput}
										placeholder={
											isExtraInfoFocused
												? ""
												: "새로 반영할 정보가 있나요?"
										}
										value={extraInfoInput}
										onChange={(e) =>
											setExtraInfoInput(e.target.value)
										}
										onFocus={() =>
											setIsExtraInfoFocused(true)
										}
										onBlur={() =>
											setIsExtraInfoFocused(false)
										}
										onKeyDown={(e) => {
											if (e.key === "Enter")
												handleSubmitExtraInfo();
										}}
									/>
									<button
										className={styles.heroExtraInfoButton}
										onClick={handleSubmitExtraInfo}
										disabled={
											!extraInfoInput.trim() ||
											isSubmittingExtraInfo
										}
									>
										{isSubmittingExtraInfo
											? "반영 중..."
											: extraInfoSaved
												? "완료 ✓"
												: "추가하기"}
									</button>
								</div>
							</div>
						</>
					) : (
						<>
							<p className={styles.eyebrow}>
								뉴스가 어려운 건 내 얘기인지 몰라서다
							</p>
							<h1 className={styles.headline}>
								당신의 뉴스 입문,
								<br />
								<em className={styles.headlineAccent}>
									So What?
								</em>
								에서
								<br />
								시작하세요
							</h1>
							<p className={styles.subtitle}>
								이 소식이 왜 내 이야기인지 알려드릴게요.
								<br />그 순간 뉴스는 더 이상 어렵지 않아요.
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

				{isLogin && (
					<button
						type="button"
						className={styles.scrollCue}
						onClick={() =>
							recommendSectionRef.current?.scrollIntoView({
								behavior: "smooth",
							})
						}
					>
						<svg
							className={styles.scrollCueArrow}
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<polyline points="6 9 12 15 18 9" />
						</svg>
						<span>추천 뉴스 보기</span>
					</button>
				)}
			</section>

			{showExperience && (
				<ExperienceModal
					onClose={(profile) => {
						setShowExperience(false);
						navigate(
							`/articles${profile ? "?category=" + profile.interest : ""}`,
						);
					}}
				/>
			)}

			{isLogin ? (
				<section
					className={styles.recommendSection}
					ref={recommendSectionRef}
				>
					<div className={styles.howHeader}>
						<p className={styles.howEyebrow}>오늘의 추천</p>
						<h2 className={styles.howTitle}>
							{user?.username ?? "회원"}님을 위해 골라봤어요
						</h2>
						<p className={styles.howSubtitle}>
							관심분야와 최신 이슈를 바탕으로 추천하는 기사예요
						</p>
					</div>

					<div className={styles.recommendGrid}>
						{isRecommendationsLoading ? (
							<div
								className={styles.loadingState}
								role="status"
								aria-live="polite"
							>
								<span
									className={styles.loadingSpinner}
									aria-hidden="true"
								/>
								<strong>추천 기사를 불러오고 있어요</strong>
								<span>잠시만 기다려 주세요.</span>
							</div>
						) : recommended.length == 0 ? (
							<p className={styles.emptyState} role="status">
								추천 기사를 불러오지 못했어요.
							</p>
						) : (
							recommended.map((article, i) => (
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
							))
						)}
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
							관심사 추천부터 기사 요약, 나에게 맞춘 해설까지
							한 번에
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

					<div
						className={styles.exampleMockup}
						data-full="true"
						data-recommend="true"
					>
						<div className={styles.mockupChrome}>
							<span
								className={styles.mockupDot}
								data-color="red"
							/>
							<span
								className={styles.mockupDot}
								data-color="yellow"
							/>
							<span
								className={styles.mockupDot}
								data-color="green"
							/>
							<span className={styles.mockupUrl}>
								sowhat.app
							</span>
						</div>

						<div className={styles.mockupScreen}>
							<div className={styles.mockupRecommendHeader}>
								<p className={styles.mockupRecommendEyebrow}>
									오늘의 추천
								</p>
								<p className={styles.mockupRecommendLabel}>
									김소원님을 위해 골라봤어요
								</p>
								<p className={styles.mockupRecommendSubtitle}>
									관심분야와 최신 이슈를 바탕으로 추천하는
									기사예요
								</p>
							</div>

							<div className={styles.mockupRecommendGrid}>
								{MOCKUP_RECOMMENDED.map((article, i) => (
									<div
										key={article.id}
										className={styles.mockupRecommendItem}
										data-slot={
											i === 0 ? "featured" : "normal"
										}
									>
										<ArticleCard
											article={article}
											size={i === 0 ? "lg" : "sm"}
											onDetailView={() => {}}
										/>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className={styles.exampleMockup} data-full="true">
						<div className={styles.mockupChrome}>
							<span
								className={styles.mockupDot}
								data-color="red"
							/>
							<span
								className={styles.mockupDot}
								data-color="yellow"
							/>
							<span
								className={styles.mockupDot}
								data-color="green"
							/>
							<span className={styles.mockupUrl}>
								sowhat.app/profile
							</span>
						</div>

						<div className={styles.mockupScreen}>
							<div className={styles.mockupProfileHead}>
								<div className={styles.mockupProfileAvatar}>
									김
								</div>
								<div>
									<p className={styles.mockupProfileName}>
										김소원님
									</p>
									<p className={styles.mockupProfileMeta}>
										27세 · 취업준비생 · 서울
									</p>
								</div>
							</div>

							<div className={styles.mockupInfoBox}>
								<p className={styles.mockupSectionLabel}>
									기본 정보
								</p>
								<div className={styles.mockupInfoRow}>
									<span className={styles.mockupInfoLabel}>
										나이
									</span>
									<span className={styles.mockupInfoValue}>
										27
									</span>
								</div>
								<div className={styles.mockupInfoRow}>
									<span className={styles.mockupInfoLabel}>
										성별
									</span>
									<span className={styles.mockupInfoValue}>
										여
									</span>
								</div>
								<div className={styles.mockupInfoRow}>
									<span className={styles.mockupInfoLabel}>
										거주지역
									</span>
									<span className={styles.mockupInfoValue}>
										서울
									</span>
								</div>
								<div className={styles.mockupInfoRow}>
									<span className={styles.mockupInfoLabel}>
										직업
									</span>
									<span className={styles.mockupInfoValue}>
										취업준비생
									</span>
								</div>

								<p className={styles.mockupSectionLabel}>
									관심 정보
								</p>
								<div className={styles.mockupInterestRow}>
									<span
										className={styles.mockupInterestLabel}
									>
										분야
									</span>
									<span
										className={styles.mockupCategoryChip}
										data-category="경제"
									>
										경제
									</span>
								</div>
								<div className={styles.mockupInterestRow}>
									<span
										className={styles.mockupInterestLabel}
									>
										목적
									</span>
									<span
										className={styles.mockupCategoryChip}
										data-purpose="true"
									>
										취·창업
									</span>
								</div>

								<p className={styles.mockupSectionLabel}>
									추가 정보
								</p>
								<p className={styles.mockupExtraInfo}>
									하반기 공채 준비 중이라 채용·고용 관련
									소식에 특히 관심이 많아요.
								</p>
							</div>

							<button className={styles.mockupEditButton}>
								수정하기 ✏️
							</button>

							<p className={styles.mockupSectionLabel}>
								최근 본 기사
							</p>
							<div className={styles.mockupListItem}>
								<span className={styles.mockupCategoryChip}>
									경제
								</span>
								한국은행 기준금리 동결
							</div>
							<div className={styles.mockupListItem}>
								<span
									className={styles.mockupCategoryChip}
									data-category="사회"
								>
									사회
								</span>
								폭염 속 장바구니 물가 비상, 채소값 껑충
							</div>

							<p className={styles.mockupSectionLabel}>
								도움이 된 해설
							</p>
							<div className={styles.mockupListItem}>
								<span className={styles.mockupCategoryChip}>
									경제
								</span>
								한국은행 기준금리 동결
							</div>
						</div>
					</div>

					<div className={styles.exampleMockup} data-full="true">
						<div className={styles.mockupChrome}>
							<span
								className={styles.mockupDot}
								data-color="red"
							/>
							<span
								className={styles.mockupDot}
								data-color="yellow"
							/>
							<span
								className={styles.mockupDot}
								data-color="green"
							/>
							<span className={styles.mockupUrl}>
								sowhat.app/articles/128
							</span>
						</div>

						<div className={styles.mockupScreen}>
							<div className={styles.mockupArticle}>
								<span className={styles.mockupCategoryChip}>
									경제
								</span>
								<h3 className={styles.mockupArticleTitle}>
									한국은행 기준금리 동결
								</h3>
								<p className={styles.mockupArticleMeta}>
									연합뉴스 · 2026.08.16
								</p>
								<p className={styles.mockupArticleContent}>
									(서울=연합뉴스) 한국은행 금융통화위원회는
									16일 기준금리를 현 수준인 연 2.25%로
									동결했다. 가계부채 증가세와 물가 상승
									압력을 함께 고려한 결정이라고
									밝혔다...
								</p>
							</div>

							<p className={styles.mockupSectionLabel}>
								기사 내용 요약
							</p>
							<p className={styles.mockupSummary}>
								한국은행이 물가와 가계부채 증가세를 고려해
								기준금리를 연 2.25%로 유지하기로 했습니다.
								당분간 대출 금리에는 큰 변화가 없을 전망입니다.
							</p>

							<div className={styles.mockupKeywordItem}>
								<span className={styles.mockupKeywordBadge}>
									1
								</span>
								<div>
									<strong>기준금리</strong>
									<p>
										한국은행이 시중 은행에 돈을 빌려줄 때
										적용하는 기본 금리
									</p>
								</div>
							</div>
							<div className={styles.mockupKeywordItem}>
								<span className={styles.mockupKeywordBadge}>
									2
								</span>
								<div>
									<strong>가계부채</strong>
									<p>
										가정에서 은행 등에 진 대출·카드빚 등을
										합친 금액
									</p>
								</div>
							</div>

							<div className={styles.mockupAnalysis}>
								<p className={styles.mockupAnalysisTag}>
									김소원님을 위한 해설
								</p>
								<div className={styles.mockupAnalysisCard}>
									<p
										className={
											styles.mockupAnalysisCardTitle
										}
									>
										💡 나에게 줄 영향은?
									</p>
									<p>
										대출 이자보다 이번 동결로 채용 시장
										분위기가 어떻게 바뀌는지가 더
										중요해요.
									</p>
								</div>
								<div className={styles.mockupAnalysisCard}>
									<p
										className={
											styles.mockupAnalysisCardTitle
										}
									>
										🛡️ 어떻게 대비할까요?
									</p>
									<p>
										금리 발표 이후 공채 계획을 내놓는
										기업이 늘어나는지 확인해보세요.
									</p>
								</div>
							</div>

							<p className={styles.mockupSectionLabel}>
								참고 링크
							</p>
							<div className={styles.mockupLinkItem}>
								🔗 한국은행 기준금리 발표 보도자료
							</div>
							<div className={styles.mockupLinkItem}>
								🔗 청년 전세자금대출 금리 안내 (주택도시기금)
							</div>
						</div>
					</div>

					<div className={styles.exampleCta}>
						<button
							className={styles.exampleCtaButton}
							onClick={() => {
								clearExperienceProfile();
								setShowExperience(true);
							}}
						>
							내 정보로 직접 체험해보기
						</button>
					</div>
				</section>
			)}
		</div>
	);
}
