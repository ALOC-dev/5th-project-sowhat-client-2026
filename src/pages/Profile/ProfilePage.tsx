import styles from "./ProfilePage.module.css";
import { useNavigate } from "react-router-dom";

type ProfilePageProps = {
  setIsLogin: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};

export default function ProfilePage({
  setIsLogin,
}: ProfilePageProps) {

  const navigate = useNavigate();

  const handleLogout = (): void => {
    setIsLogin(false);
    navigate("/");
  };

  return (
    <div className={styles.page}>

      <button
        className={styles.backButton}
        onClick={() => navigate("/")}
      >
        ← 돌아가기
      </button>

      <h2 className={styles.title}>
        내 정보 보기
      </h2>

      <div className={styles.profileIcon}>
        👤
      </div>

      <div className={styles.infoBox}>

        <div className={styles.infoRow}>
          <span className={styles.label}>나이</span>
          <span className={styles.value}>20</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.label}>성별</span>
          <span className={styles.value}>여</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.label}>거주지역</span>
          <span className={styles.value}>서울</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.label}>직업</span>
          <span className={styles.value}>대학생</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.label}>관심분야</span>
          <span className={styles.value}>경제</span>
        </div>

      </div>

      <div className={styles.buttonGroup}>
        <button className={styles.editButton}>
          수정하기
        </button>

        <button
          className={styles.logoutButton}
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>

    </div>
  );
}