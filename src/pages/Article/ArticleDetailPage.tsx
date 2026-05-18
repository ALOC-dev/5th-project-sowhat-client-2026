import { useNavigate, useParams  } from "react-router-dom";
import { getArticles } from "../../api/articles";

export default function ArticleDetailPage() {
  const { article_id } = useParams();
  const navigate = useNavigate();

  const articles = getArticles();
  const article = articles.find(
    (article) => article.article_id === Number(article_id)
  );

  
  
  return (
    <div>
      <button onClick={() => navigate("/articles")}>목록으로</button>

      {!article ?(
          <p>기사를 찾을 수 없습니다.</p>
        ) : (
        <>
          <h1>{article.title}</h1>
          <p>{article.date}</p>
          <p>{article.content}</p>
        </>
      )}
    </div>
    );
}