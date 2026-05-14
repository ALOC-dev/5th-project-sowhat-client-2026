import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate("/articles")}>
      <h1>메인페이지</h1>
      <h2>메인페이지 누르면 기사리스트</h2>
    </div>
  );   
}

