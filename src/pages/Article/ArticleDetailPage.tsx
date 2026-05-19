import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getArticleDetail, getPersonalAnalysis } from "../../api/articles";
import { ArticleDetail, PersonalAnalysis } from "../../types";
import styled from "./ArticleDetailPage.module.css";

type ArticleDetailPageProps = {
	isLogin: boolean;
};

export default function ArticleDetailPage({ isLogin }: ArticleDetailPageProps) {
	const { article_id } = useParams();
	const navigate = useNavigate();

	const [article, setArticle] = useState<ArticleDetail | null>(null);
	const [analysis, setAnalysis] = useState<PersonalAnalysis | null>(null);

	useEffect(() => {
		const fetchArticleDetail = async () => {
			const fetched = await getArticleDetail(Number(article_id));
			setArticle((prev) => fetched ?? null);
		};

		const fetchPersonalAnalysis = async () => {
			const fetched = await getPersonalAnalysis(Number(article_id), 1);
			setAnalysis((prev) => fetched ?? null);
		};

		fetchArticleDetail();
		if (isLogin) fetchPersonalAnalysis();
	}, []);

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
								{article.date?.toDateString() ?? "2026-05-19"}
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
								<strong>{article?.keyword}</strong>
								<p>'{article?.keyword}'에 대한 설명입니다.</p>
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
						</>
					) : (
						<>
							<p className={styled.p1}>
								이 소식이 나에게 어떤 영향을 줄까요?
							</p>
							<p className={styled.p2}>
								지금 로그인하고 확인하세요.
							</p>
							<button onClick={() => navigate("/login")}>
								로그인
							</button>
						</>
					)}
				</article>
			</div>
		</div>
	);
}
