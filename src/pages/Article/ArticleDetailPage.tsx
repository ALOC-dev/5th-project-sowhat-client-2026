import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getArticleDetail, streamPersonalAnalysis } from "../../api/articles";
import { formatDate } from "../../lib/formatDate";
import { recordArticleView } from "../../lib/readingHistory";
import {
	isAnalysisSaved,
	removeSavedAnalysis,
	saveAnalysis,
} from "../../lib/savedAnalyses";
import { ArticleDetail, PersonalAnalysis, User } from "../../types";
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

	const [article, setArticle] = useState<ArticleDetail | null>(null);
	const [analysis, setAnalysis] = useState<PersonalAnalysis | null>(null);
	const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

	const experience = readExperienceProfile();

	useEffect(() => {
		const fetchArticleDetail = async () => {
			const fetched = await getArticleDetail(Number(article_id));
			setArticle((prev) => fetched ?? null);
			if (fetched) {
				recordArticleView({
					id: fetched.id,
					title: fetched.title,
					category: fetched.category,
				});
			}
		};

		fetchArticleDetail();
	}, [article_id]);

	useEffect(() => {
		if (!isLogin || !user) return;

		setAnalysis(null);

		const controller = streamPersonalAnalysis(Number(article_id), {
			onAnalysis: ({ effect, solution, links, similarArticles }) => {
				setAnalysis({ effect, solution, links, similarArticles });
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
		});

		return () => controller.abort();
	}, [isLogin, user?.id, article_id]);

	useEffect(() => {
		if (article_id) {
			setFeedback(isAnalysisSaved(Number(article_id)) ? "up" : null);
		}
	}, [article_id]);

	const handleFeedback = (value: "up" | "down") => {
		setFeedback(value);
		if (!article) return;

		if (value === "up") {
			saveAnalysis({
				articleId: article.id,
				title: article.title,
				effect: analysis?.effect ?? "",
				solution: analysis?.solution ?? "",
			});
		} else {
			removeSavedAnalysis(article.id);
		}
	};

	return (
		<div className={styled.page}>
			<button
				className={styled.backButton}
				onClick={() => navigate("/articles")}
			>
				← 목록으로
			</button>

			<div className={styled.layout}>
				<article className={styled.articleBox}>
					{!article ? (
						<p>기사를 찾을 수 없습니다.</p>
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
					{isLogin ? (
						<>
							<h3>💡 이 소식이 나에게 줄 영향은?</h3>
							<ul>
								{toSentences(analysis?.effect).map(
									(sentence, i) => (
										<li key={i}>{sentence}</li>
									),
								)}
							</ul>

							<h3>🛡️ 어떻게 대비할까요?</h3>
							<ul>
								{toSentences(analysis?.solution).map(
									(sentence, i) => (
										<li key={i}>{sentence}</li>
									),
								)}
							</ul>

							{analysis?.links && analysis.links.length > 0 && (
								<>
									<h3>참고 링크</h3>
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
														🔗
													</span>
													{link.title}
												</a>
											</li>
										))}
									</ul>
								</>
							)}

							{analysis?.similarArticles &&
								analysis.similarArticles.length > 0 && (
									<>
										<h3>비슷한 기사</h3>
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
							<p className={styled.p1}>
								이 소식이 나에게 어떤 영향을 줄까요?
							</p>

							<div className={styled.previewWrap}>
								<div className={styled.previewBlur}>
									<p className={styled.previewLabel}>예시</p>
									<ul>
										<li>
											이 소식은 자산·소비 계획에 영향을 줄
											수 있어요. 로그인하면 내 상황에 맞춘
											진짜 분석을 볼 수 있어요.
										</li>
									</ul>
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
									<p className={styled.p2}>
										{experience
											? `${experience.job}이시라면 특히 확인해볼 만한 내용이에요. 로그인하면 나를 위한 해설을 볼 수 있어요.`
											: "로그인하면 나를 위한 진짜 해설을 볼 수 있어요."}
									</p>
								</div>
							</div>

							<button
								onClick={() =>
									navigate(
										`/login?redirect=${location.pathname}`,
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
