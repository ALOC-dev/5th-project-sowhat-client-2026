import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
	getArticleDetail,
	getExperienceAnalysis,
	streamPersonalAnalysis,
	submitAnalysisReaction,
} from "../../api/articles";
import { formatDate } from "../../lib/formatDate";
import { recordArticleView } from "../../lib/readingHistory";
import { ArticleDetail, JobEnum, PersonalAnalysis, User } from "../../types";
import { readExperienceProfile } from "../Main/ExperienceModal";
import styled from "./ArticleDetailPage.module.css";

// 긴 줄글을 문장 단위로 나눠 하나씩 확인할 수 있는 불릿으로 보여준다
function toSentences(text?: string): string[] {
	if (!text) return [];
	return text
		.split(/(?<=[.!?])\s+/)
		.map((s) => s.trim())
		.filter(Boolean);
}

type ArticleDetailPageProps = {
	isLogin: boolean;
	user: User | null;
};

export default function ArticleDetailPage({
	isLogin,
	user,
}: ArticleDetailPageProps) {
	const location = useLocation();
	const { article_id } = useParams();
	const navigate = useNavigate();

	const [isArticleLoading, setIsArticleLoading] = useState<boolean>(true);
	const [isAnalysisLoading, setIsAnalysisLoading] = useState<boolean>(true);
	const [isLinkLoading, setIsLinkLoading] = useState<boolean>(false);

	const [article, setArticle] = useState<ArticleDetail | null>(null);
	const [analysis, setAnalysis] = useState<PersonalAnalysis | null>(null);
	const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

	const experience = readExperienceProfile();

	useEffect(() => {
		const fetchArticleDetail = async () => {
			setIsArticleLoading(true);
			try {
				const fetched = await getArticleDetail(Number(article_id));
				setArticle((prev) => fetched ?? null);
				if (fetched) {
					recordArticleView({
						id: fetched.id,
						title: fetched.title,
						category: fetched.category,
					});
				}
			} finally {
				setIsArticleLoading(false);
			}
		};

		fetchArticleDetail();
	}, [article_id]);

	useEffect(() => {
		setAnalysis(null);

		if (!isLogin || !user) {
			if (!experience) return;

			const fetchExperienceAnalysis = async () => {
				setIsAnalysisLoading(true);
				try {
					const fetched = await getExperienceAnalysis(
						Number(article_id),
						experience,
					);
					setAnalysis((prev) => fetched ?? null);
				} finally {
					setIsAnalysisLoading(false);
				}
			};

			fetchExperienceAnalysis();
			return;
		}

		const controller = streamPersonalAnalysis(Number(article_id), {
			onAnalysis: ({ effect, solution, links, similarArticles }) => {
				setAnalysis({ effect, solution, links, similarArticles });
				setIsAnalysisLoading(false);
				setIsLinkLoading(true);
			},
			onLinks: (links) => {
				setAnalysis((prev) =>
					prev
						? { ...prev, links }
						: {
								effect: "",
								solution: "",
								links,
								similarArticles: [],
							},
				);
			},
			onError: (message) => {
				console.error("개인 해설 생성 중 오류 발생:", message);
			},
			onDone: () => {
				setIsLinkLoading(false);
			},
		});

		return () => controller.abort();
	}, [isLogin, user?.id, article_id]);

	useEffect(() => {
		setFeedback(null);
	}, [article_id]);

	const handleFeedback = async (value: "up" | "down") => {
		if (!article) return;
		const prev = feedback;
		setFeedback(value);
		try {
			await submitAnalysisReaction(article.id, value);
		} catch {
			setFeedback(prev);
		}
	};

	return (
		<div className={styled.page}>
			<button
				className={styled.backButton}
				onClick={() => {
					navigate(
						"/articles" +
							(!isLogin && experience
								? `?category=${experience.interest}`
								: ""),
					);
				}}
			>
				← 목록으로
			</button>

			<div className={styled.layout}>
				<article className={styled.articleBox}>
					{isArticleLoading ? (
						<div
							className={styled.articleLoading}
							role="status"
							aria-live="polite"
						>
							<span
								className={styled.loadingSpinner}
								aria-hidden="true"
							/>
							<strong>기사를 불러오고 있어요</strong>
							<span>내용을 정리해 보여드릴게요.</span>
						</div>
					) : !article ? (
						<p className={styled.articleEmpty} role="status">
							기사를 불러오지 못했어요.
						</p>
					) : (
						<>
							<h1 className={styled.title}>{article.title}</h1>
							<p className={styled.meta}>
								<span>{article.publisher}</span>
								{article.reporter && (
									<span>{article.reporter} 기자</span>
								)}
								<span>{formatDate(article.published_at)}</span>
							</p>
							<p className={styled.content}>{article.content}</p>
						</>
					)}
					<hr className={styled.divider} />
					<section className={styled.summaryBox}>
						<h2 className={styled.summaryTitle}>기사 내용 요약</h2>

						<p className={styled.summaryText}>{article?.summary}</p>

						<ul className={styled.keywordList}>
							{article?.keyword.map((item, i) => (
								<li key={item.word}>
									<span className={styled.keywordBadge}>
										{i + 1}
									</span>
									<div>
										<strong>{item.word}</strong>
										<p>{item.description}</p>
									</div>
								</li>
							))}
						</ul>
					</section>
				</article>

				<article className={styled.sideBox}>
					<span className={styled.aiBadge}>✨ AI 개인화 해설</span>
					{isLogin ? (
						<>
							<h3>
								<span className={styled.iconChip}>💡</span>
								이 소식이 나에게 줄 영향은?
							</h3>
							{isAnalysisLoading ? (
								<div
									className={styled.analysisLoading}
									role="status"
								>
									<span
										className={styled.loadingSpinner}
										aria-hidden="true"
									/>
									<span>
										나에게 맞는 해설을 준비하고 있어요.
									</span>
								</div>
							) : !analysis ? (
								<p
									className={styled.analysisEmpty}
									role="status"
								>
									해설을 불러오지 못했어요.
								</p>
							) : (
								<ul>
									{toSentences(analysis?.effect).map(
										(sentence, i) => (
											<li key={i}>{sentence}</li>
										),
									)}
								</ul>
							)}
							<h3>
								<span className={styled.iconChip}>🛡️</span>
								어떻게 대비할까요?
							</h3>
							{isAnalysisLoading ? (
								<div
									className={styled.analysisLoading}
									role="status"
								>
									<span
										className={styled.loadingSpinner}
										aria-hidden="true"
									/>
									<span>
										나에게 맞는 해설을 준비하고 있어요.
									</span>
								</div>
							) : !analysis ? (
								<p
									className={styled.analysisEmpty}
									role="status"
								>
									해설을 불러오지 못했어요.
								</p>
							) : (
								analysis?.solution && (
									<ul>
										{toSentences(analysis.solution).map(
											(sentence, i) => (
												<li key={i}>{sentence}</li>
											),
										)}
									</ul>
								)
							)}
							{isLinkLoading ? (
								<div
									className={styled.analysisLoading}
									role="status"
								>
									<span
										className={styled.loadingSpinner}
										aria-hidden="true"
									/>
									<span>
										추가로 방문하면 좋을 링크를 찾고 있어요.
									</span>
								</div>
							) : (
								analysis?.links &&
								analysis.links.length > 0 && (
									<>
									<h3>
										<span className={styled.iconChip}>
											🔗
										</span>
										참고 링크
									</h3>
									<ul className={styled.linkList}>
										{analysis.links.map((link) => (
											<li key={link.url}>
												<a
													href={link.url}
													target="_blank"
													rel="noreferrer"
												>
													<span
														className={
															styled.linkIcon
														}
													>
														<span
															className={
																styled.linkIcon
															}
														>
															🔗
														</span>
														{link.title}
													</a>
												</li>
											))}
										</ul>
									</>
								)
							)}
							{analysis?.similarArticles &&
								analysis.similarArticles.length > 0 && (
									<>
										<h3>
											<span
												className={styled.iconChip}
											>
												📰
											</span>
											비슷한 기사
										</h3>
										<ul className={styled.similarList}>
											{analysis.similarArticles.map(
												(article) => (
													<li key={article.sourceUrl}>
														<a
															href={
																article.sourceUrl
															}
															target="_blank"
															rel="noreferrer"
														>
															<strong>
																{article.title}
															</strong>
															<span>
																{
																	article.published_at
																}
																{" | "}
																{
																	article.publisher
																}
															</span>
														</a>
													</li>
												),
											)}
										</ul>
									</>
								)}
							<p className={styled.feedbackLabel}>
								이 해설이 도움이 되었나요?
							</p>
							<div className={styled.feedbackRow}>
								<button
									className={styled.feedbackButton}
									data-active={feedback === "up"}
									onClick={() => handleFeedback("up")}
								>
									👍 도움이 됐어요
								</button>
								<button
									className={styled.feedbackButton}
									data-active={feedback === "down"}
									onClick={() => handleFeedback("down")}
								>
									👎 별로예요
								</button>
							</div>
						</>
					) : (
						<>
							<h3>
								<span className={styled.iconChip}>💡</span>
								이 소식이 나에게 줄 영향은?
							</h3>

							{!experience ? (
								""
							) : isAnalysisLoading ? (
								<div
									className={styled.analysisLoading}
									role="status"
								>
									<span
										className={styled.loadingSpinner}
										aria-hidden="true"
									/>
									<span>
										나에게 맞는 해설을 준비하고 있어요.
									</span>
								</div>
							) : !analysis ? (
								<p
									className={styled.analysisEmpty}
									role="status"
								>
									해설을 불러오지 못했어요.
								</p>
							) : (
								<div className={styled.previewWrap}>
									<ul>
										{toSentences(analysis?.effect).map(
											(sentence, i) => (
												<li key={i}>{sentence}</li>
											),
										)}
									</ul>
								</div>
							)}

							{!experience ? (
								""
							) : (
								<h3>
									<span className={styled.iconChip}>
										🛡️
									</span>
									어떻게 대비할까요?
								</h3>
							)}

							<div className={styled.previewWrap}>
								<div className={styled.previewBlurWrap}>
									<div className={styled.previewBlur}>
										<ul>
											<li>
												관련 지원 제도나 대응 방법을
												확인해보는 걸 추천해요.
											</li>
										</ul>
										<ul>
											<li>
												<a href="#">
													관련 지원 제도 안내 페이지
												</a>
											</li>
										</ul>
									</div>
									<div className={styled.previewOverlay}>
										<span className={styled.previewLock}>
											🔒
										</span>
										<p
											className={styled.p2}
											style={{ fontSize: "14px" }}
										>
											{experience &&
												experience.job !==
													JobEnum.STUDENT &&
												experience.job !==
													JobEnum.JOB_SEEKER &&
												experience.job !==
													JobEnum.RETIRED_UNEMPLOYED && (
													<>
														{experience.job} 분야에
														종사하신다면 특히
														확인해볼 만한
														내용이에요.
														<br />
													</>
												)}
											{experience &&
												(experience.job ==
													JobEnum.STUDENT ||
													experience.job ==
														JobEnum.JOB_SEEKER) && (
													<>
														{experience.job}
														이시라면 특히 확인해볼
														만한 내용이에요.
														<br />
													</>
												)}
											로그인하면 나를 위한 해설을 볼 수
											있어요.
										</p>
									</div>
								</div>
							</div>
							<button
								onClick={() =>
									navigate(
										`/login?redirect=${encodeURIComponent(
											location.pathname + location.search,
										)}`,
									)
								}
							>
								로그인
							</button>
						</>
					)}
				</article>
			</div>
		</div>
	);
}
