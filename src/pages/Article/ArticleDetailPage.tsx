import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getArticleDetail } from "../../api/articles";
import { ArticleDetail } from "../../types";
import styled from "./ArticleDetailPage.module.css";

type ArticleDetailPageProps = {
  isLogin: boolean;
};

export default function ArticleDetailPage() {
	const { article_id } = useParams();
	const navigate = useNavigate();

	const [article, setArticle] = useState<Article | null>(
		null,
	);
  
  useEffect(() => {
		const fetchArticleDetail = async () => {
			const fetched = await getArticleDetail(Number(article_id));
			setArticle((prev) => fetched ?? null);
		};

		fetchArticleDetail();
	}, []);

  return (
    <div className={styled.page}>
      <button className={styled.backButton} onClick={() => navigate("/articles")}>
        ← 목록으로
      </button>

      <div className={styled.layout}>
        <article className={styled.articleBox}>
          {!article ? (
            <p>기사를 찾을 수 없습니다.</p>
          ) : (
            <>
              <h1 className={styled.title}>{article.title}</h1>
              <p className={styled.date}>{article.date}</p>
              <p className={styled.content}>{article.content}</p>
            </>
          )}
           <hr className={styled.divider} />

            <section className={styled.summaryBox}>
            <h2 className={styled.summaryTitle}>기사 내용 요약</h2>

            <p className={styled.summaryText}>
              LLM을 활용한 기사 요약 해설입니다. LLM을 활용한 기사 요약 해설입니다.
              LLM을 활용한 기사 요약 해설입니다. LLM을 활용한 기사 요약 해설입니다.
            </p>

            <ul className={styled.keywordList}>
              <li>
                <strong>키워드 1</strong>
                <p>키워드 1에 대한 설명입니다.</p>
              </li>

              <li>
                <strong>키워드 2</strong>
                <p>키워드 2에 대한 설명입니다.</p>
              </li>
            </ul>
          </section>
        </article>

        <article className={styled.sideBox}>
          {isLogin ? (
            <>
              <h3>이 소식이 나에게 줄 영향은?</h3>
              <ul>
                <li>영향 1</li>
                <li>영향 2</li>
                <li>영향 3</li>
              </ul>

              <h3>어떻게 대비할까요?</h3>
              <ul>
                <li>방안 1</li>
                <li>방안 2</li>
                <li>방안 3</li>
              </ul>
            </>
          ) : (
            <>
              <p className={styled.p1}>이 소식이 나에게 어떤 영향을 줄까요?</p>
              <p className={styled.p2}>지금 로그인하고 확인하세요.</p>
              <button onClick={() => navigate("/login")}>로그인</button>
            </>
          )}
        </article>
      </div>
    </div>
  );
}
