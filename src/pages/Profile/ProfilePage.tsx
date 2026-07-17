import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../api/users";
import {
	categoryLabel,
	genderLabel,
	jobLabel,
	regionLabel,
	User,
} from "../../types";
import styles from "./ProfilePage.module.css";

type ProfilePageProps = {
	setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ProfilePage({ setIsLogin }: ProfilePageProps) {
	const navigate = useNavigate();
	const [user, setUser] = useState<User | null>(null);

	const handleLogout = (): void => {
		setIsLogin(false);
		navigate("/");
	};

	useEffect(() => {
		const fetchUser = async () => {
			const fetched = await getUser(1);
			setUser((prev) => fetched ?? null);
		};

		fetchUser();
	}, []);

	return (
		<div className={styles.page}>
			<button className={styles.backButton} onClick={() => navigate(-1)}>
				← 돌아가기
			</button>

			<h2 className={styles.title}>내 정보 보기</h2>

			<div className={styles.profileIcon}>👤</div>

			<div className={styles.infoBox}>
				<div className={styles.infoRow}>
					<span className={styles.label}>나이</span>
					<span className={styles.value}>
						{user ? user.age : "-"}
					</span>
				</div>

				<div className={styles.infoRow}>
					<span className={styles.label}>성별</span>
					<span className={styles.value}>
						{user ? genderLabel(user.gender) : "-"}
					</span>
				</div>

				<div className={styles.infoRow}>
					<span className={styles.label}>거주지역</span>
					<span className={styles.value}>
						{user ? regionLabel(user.region) : "-"}
					</span>
				</div>

				<div className={styles.infoRow}>
					<span className={styles.label}>직업</span>
					<span className={styles.value}>
						{user ? jobLabel(user.job) : "-"}
					</span>
				</div>

				<div className={styles.infoRow}>
					<span className={styles.label}>관심분야</span>
					<span className={styles.value}>
						{user ? categoryLabel(user.interest) : "-"}
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
