import { useNavigate, useParams  } from "react-router-dom";
import { getArticles } from "../../api/articles";
import styled from "./ArticleDetailPage.module.css"

export default function ArticleDetailPage() {
  const { article_id } = useParams();
  const navigate = useNavigate();

  const articles = getArticles();
  const article = articles.find(
    (article) => article.article_id === Number(article_id)
  );

  
  
  return (
    <div className={styled.page}>
      <button onClick={() => navigate("/articles")}>목록으로</button>
      
      <div className={styled.layout}>
        <article >
          {!article ?(
            <p>기사를 찾을 수 없습니다.</p>
          ) : (
          <>
            <h1>{article.title}</h1>
            <p>{article.date}</p>
            <p>{article.content}</p>
          </>
        )}
        </article>

        <article className={styled.login}>
            <p className={styled.p1}>이 소식이 나에게 어떤 영향을 줄까요?</p>
            <p className={styled.p2}>지금 로그인하고 확인하세요.</p>
            <button>로그인</button>

        </article>
      </div>
    </div>
    );
}