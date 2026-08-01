import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getArticleDetail, getPersonalAnalysis } from "../../api/articles";
import { ArticleDetail, PersonalAnalysis, User } from "../../types";
import { recordArticleView } from "../../lib/readingHistory";
import {
	isAnalysisSaved,
	removeSavedAnalysis,
	saveAnalysis,
} from "../../lib/savedAnalyses";
import { isMockLoginEnabled, MOCK_ANALYSIS } from "../../lib/mockAuth"; // TODO: 제출 전 삭제
import { readExperienceProfile } from "../Main/ExperienceModal";
import styled from "./ArticleDetailPage.module.css";

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

		const fetchPersonalAnalysis = async () => {
			if (isMockLoginEnabled()) {
				// TODO: 제출 전 삭제 - 목업 로그인 모드
				setAnalysis(MOCK_ANALYSIS);
				return;
			}
			if (!user) return;
			const fetched = await getPersonalAnalysis(
				Number(article_id),
				user.id,
			);
			setAnalysis((prev) => fetched ?? null);
		};

		fetchArticleDetail();
		if (isLogin) fetchPersonalAnalysis();
	}, [isLogin, user?.id]);

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
							<p className={styled.date}>
								{article.published_at.toDateString() ??
									"2026-05-19"}
							</p>
							<p className={styled.content}>{article.content}</p>
						</>
					)}
					<hr className={styled.divider} />

					<section className={styled.summaryBox}>
						<h2 className={styled.summaryTitle}>기사 내용 요약</h2>

						<p className={styled.summaryText}>{article?.summary}</p>

						<ul className={styled.keywordList}>
							<li>
								<strong>{article?.keyword[0].word}</strong>
								<p>{article?.keyword[0].description}</p>
							</li>
						</ul>
					</section>
				</article>

				<article className={styled.sideBox}>
					{isLogin ? (
						<>
							<h3>이 소식이 나에게 줄 영향은?</h3>
							<ul>
								<li>{analysis?.effect}</li>
							</ul>

							<h3>어떻게 대비할까요?</h3>
							<ul>
								<li>{analysis?.solution}</li>
							</ul>

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
									<p className={styled.previewLabel}>
										예시
									</p>
									<ul>
										<li>
											이 소식은 자산·소비 계획에 영향을
											줄 수 있어요. 로그인하면 내 상황에
											맞춘 진짜 분석을 볼 수 있어요.
										</li>
									</ul>
									<ul>
										<li>
											관련 지원 제도나 대응 방법을
											확인해보는 걸 추천해요.
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
