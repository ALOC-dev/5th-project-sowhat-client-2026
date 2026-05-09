import { useParams } from "react-router-dom";
import { getArticles } from "../api/articles";

export default function ArticleDetailPage() {
  const { article_id } = useParams();
  const articles = getArticles();

  const article = articles.find(
    (article) => article.article_id === Number(article_id)
  );

  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.date}</p>
      <p>{article.content}</p>
    </div>
  );
}