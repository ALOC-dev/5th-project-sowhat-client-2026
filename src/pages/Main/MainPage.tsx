import { useNavigate } from "react-router-dom";
import styles from "./MainPage.module.css";

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.mainPage}>
      <p className={styles.eyebrow}>News, made personal</p>
      <h1 className={styles.main}>So What?</h1>
      <p className={styles.subtitle}>
        나에게 필요한 만큼만, 뉴스를 해설해 드려요
      </p>
      <button className={styles.cta} onClick={() => navigate("/articles")}>
        뉴스 둘러보기
      </button>
    </div>
  );
}

