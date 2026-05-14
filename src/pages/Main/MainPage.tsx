import { useNavigate } from "react-router-dom";
import styles from "./MainPage.module.css";

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div className= {styles.main} onClick={() => navigate("/articles")}>
      <h1>메인페이지</h1>
      
    </div>
  );   
}

