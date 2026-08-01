import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	getReadingHistory,
	ReadingHistoryItem,
} from "../../lib/readingHistory";
import { getSavedAnalyses, SavedAnalysisItem } from "../../lib/savedAnalyses";
import { disableMockLogin } from "../../lib/mockAuth"; // TODO: 제출 전 삭제
import { User } from "../../types";
import styles from "./ProfilePage.module.css";

type ProfilePageProps = {
	user: User | null;
	setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ProfilePage({ user, setIsLogin }: ProfilePageProps) {
	const navigate = useNavigate();
	const [history, setHistory] = useState<ReadingHistoryItem[]>([]);
	const [saved, setSaved] = useState<SavedAnalysisItem[]>([]);

	const handleLogout = (): void => {
		disableMockLogin(); // TODO: 제출 전 삭제
		setIsLogin(false);
		navigate("/");
	};

	useEffect(() => {
		setHistory(getReadingHistory());
		setSaved(getSavedAnalyses());
	}, []);

	return (
		<div className={styles.page}>
			<button className={styles.backButton} onClick={() => navigate(-1)}>
				← 돌아가기
			</button>

			<div className={styles.layout}>
				<div className={styles.leftCol}>
					<div className={styles.profileHead}>
						<div className={styles.profileIcon}>
							{user?.username?.[0] ?? "👤"}
						</div>
						<h2 className={styles.username}>
							{user?.username ?? "-"}
						</h2>
						<p className={styles.loginId}>@{user?.login_id ?? "-"}</p>
					</div>

					<div className={styles.infoBox}>
						<p className={styles.sectionLabel}>기본 정보</p>

						<div className={styles.infoRow}>
							<span className={styles.label}>나이</span>
							<span className={styles.value}>
								{user ? user.age : "-"}
							</span>
						</div>

						<div className={styles.infoRow}>
							<span className={styles.label}>성별</span>
							<span className={styles.value}>
								{user ? user.gender : "-"}
							</span>
						</div>

						<div className={styles.infoRow}>
							<span className={styles.label}>거주지역</span>
							<span className={styles.value}>
								{user ? user.region : "-"}
							</span>
						</div>

						<div className={styles.infoRow}>
							<span className={styles.label}>직업</span>
							<span className={styles.value}>
								{user ? user.job : "-"}
							</span>
						</div>

						<p className={styles.sectionLabel}>관심 정보</p>

						<div className={styles.chipRow}>
							{user && (
								<span className={styles.chip}>
									{user.interest}
								</span>
							)}
							{user && (
								<span className={styles.chip}>
									{user.purpose}
								</span>
							)}
						</div>

						{user?.extra_information && (
							<>
								<p className={styles.sectionLabel}>
									추가 정보
								</p>
								<p className={styles.extraInfo}>
									{user.extra_information}
								</p>
							</>
						)}
					</div>

					<div className={styles.buttonGroup}>
						<button
							className={styles.editButton}
							onClick={() => navigate("/profile/edit")}
						>
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

				<div className={styles.rightCol}>
					<h3 className={styles.historyTitle}>
						지금까지 본 기사 ({history.length})
					</h3>

					{history.length === 0 ? (
						<p className={styles.historyEmpty}>
							아직 열람한 기사가 없어요.
						</p>
					) : (
						<ul className={styles.historyList}>
							{history.map((item) => (
								<li
									key={item.id}
									className={styles.historyItem}
									onClick={() =>
										navigate(`/articles/${item.id}`)
									}
								>
									{item.category && (
										<span className={styles.historyChip}>
											{item.category}
										</span>
									)}
									<span className={styles.historyItemTitle}>
										{item.title}
									</span>
								</li>
							))}
						</ul>
					)}

					{saved.length > 0 && (
						<div className={styles.savedBox}>
							<h3 className={styles.historyTitle}>
								도움이 된 해설 ({saved.length})
							</h3>
							<ul className={styles.historyList}>
								{saved.map((item) => (
									<li
										key={item.articleId}
										className={styles.savedItem}
										onClick={() =>
											navigate(
												`/articles/${item.articleId}`,
											)
										}
									>
										<span
											className={styles.historyItemTitle}
										>
											{item.title}
										</span>
										{item.effect && (
											<p className={styles.savedEffect}>
												{item.effect}
											</p>
										)}
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
