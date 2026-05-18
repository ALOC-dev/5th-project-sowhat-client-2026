import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getArticleDetail } from "../../api/articles";
import { ArticleDetail } from "../../types";
import styled from "./ArticleDetailPage.module.css";

export default function ArticleDetailPage() {
	const { article_id } = useParams();
	const navigate = useNavigate();

	const [articleDetail, setArticleDetail] = useState<ArticleDetail | null>(
		null,
	);

	useEffect(() => {
		const fetchArticleDetail = async () => {
			const fetched = await getArticleDetail(Number(article_id));
			setArticleDetail((prev) => fetched ?? null);
		};

		fetchArticleDetail();
	}, []);

	return (
		<div className={styled.page}>
			<button onClick={() => navigate("/articles")}>목록으로</button>

			<div className={styled.layout}>
				<article>
					{articleDetail ? (
						<>
							<h1>{articleDetail.title}</h1>
							<p>
								{articleDetail.date?.toDateString() ??
									"2026-05-19"}
							</p>
							<p>{articleDetail.media}</p>
							<p>{articleDetail.content}</p>
							<p>
								—————————————————————————————————————————————————
							</p>
							<p>{articleDetail.summary}</p>
							<h3>핵심 키워드</h3>
							<p>{articleDetail.keyword}</p>
						</>
					) : (
						<p>기사를 찾을 수 없습니다.</p>
					)}
				</article>

				<article className={styled.login}>
					<p className={styled.p1}>
						이 소식이 나에게 어떤 영향을 줄까요?
					</p>
					<p className={styled.p2}>지금 로그인하고 확인하세요.</p>
					<button>로그인</button>
				</article>
			</div>
		</div>
	);
}
