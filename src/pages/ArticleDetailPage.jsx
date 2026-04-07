import { useParams } from "react-router-dom";

export default function ArticleDetailPage() {
  const { article_id } = useParams();

  return <div>{article_id}</div>;
}