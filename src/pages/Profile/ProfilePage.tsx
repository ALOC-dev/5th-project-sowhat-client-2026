import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../api/profiles";
import {
	categoryLabel,
	genderLabel,
	jobLabel,
	regionLabel,
	UserInfo,
} from "../../types";
import styles from "./ProfilePage.module.css";

type ProfilePageProps = {
	setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ProfilePage({ setIsLogin }: ProfilePageProps) {
	const navigate = useNavigate();
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

	const handleLogout = (): void => {
		setIsLogin(false);
		navigate("/");
	};

	useEffect(() => {
		const fetchUserInfo = async () => {
			const fetched = await getProfile(1);
			setUserInfo((prev) => fetched ?? null);
		};

		fetchUserInfo();
	}, []);

	return (
		<div className={styles.page}>
			<button className={styles.backButton} onClick={() => navigate("/")}>
				← 돌아가기
			</button>

			<h2 className={styles.title}>내 정보 보기</h2>

			<div className={styles.profileIcon}>👤</div>

			<div className={styles.infoBox}>
				<div className={styles.infoRow}>
					<span className={styles.label}>나이</span>
					<span className={styles.value}>
						{userInfo ? userInfo.age : "-"}
					</span>
				</div>

				<div className={styles.infoRow}>
					<span className={styles.label}>성별</span>
					<span className={styles.value}>
						{userInfo ? genderLabel(userInfo.gender) : "-"}
					</span>
				</div>

				<div className={styles.infoRow}>
					<span className={styles.label}>거주지역</span>
					<span className={styles.value}>
						{userInfo ? regionLabel(userInfo.region) : "-"}
					</span>
				</div>

				<div className={styles.infoRow}>
					<span className={styles.label}>직업</span>
					<span className={styles.value}>
						{userInfo ? jobLabel(userInfo.job) : "-"}
					</span>
				</div>

				<div className={styles.infoRow}>
					<span className={styles.label}>관심분야</span>
					<span className={styles.value}>
						{userInfo ? categoryLabel(userInfo.interest) : "-"}
					</span>
				</div>
			</div>

			<div className={styles.buttonGroup}>
				<button className={styles.editButton}>수정하기</button>

				<button className={styles.logoutButton} onClick={handleLogout}>
					로그아웃
				</button>
			</div>
		</div>
	);
}
