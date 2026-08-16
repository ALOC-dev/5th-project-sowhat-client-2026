import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/auth";
import { getHelpfulAnalyses, getViewedArticles } from "../../api/users";
import { getReadingHistory, ReadingHistoryItem } from "../../lib/readingHistory";
import { User } from "../../types";
import styles from "./ProfilePage.module.css";

const PAGE_SIZE = 10;

type ProfilePageProps = {
	user: User | null;
	setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
	// 프로필 관련 화면(/profile, /profile/edit)을 건너뛰고 뒤로 가도록 App에 요청한다
	onBack: () => void;
};

export default function ProfilePage({
	user,
	setIsLogin,
	onBack,
}: ProfilePageProps) {
	const navigate = useNavigate();

	const [history, setHistory] = useState<ReadingHistoryItem[]>([]);
	const [hasMoreHistory, setHasMoreHistory] = useState<boolean>(false);
	const [isLoadingMoreHistory, setIsLoadingMoreHistory] =
		useState<boolean>(false);

	const [helpful, setHelpful] = useState<ReadingHistoryItem[]>([]);
	const [hasMoreHelpful, setHasMoreHelpful] = useState<boolean>(false);
	const [isLoadingMoreHelpful, setIsLoadingMoreHelpful] =
		useState<boolean>(false);

	const handleLogout = async (): Promise<void> => {
		try {
			await logout();
		} finally {
			setIsLogin(false);
			navigate("/");
		}
	};

	useEffect(() => {
		const loadHistory = async () => {
			if (user) {
				try {
					const fetched = await getViewedArticles(PAGE_SIZE, 0);
					setHistory(fetched);
					setHasMoreHistory(fetched.length === PAGE_SIZE);
					return;
				} catch {
					// 조회 실패 시 로컬 기록으로 대체
				}
			}
			setHistory(getReadingHistory());
			setHasMoreHistory(false);
		};

		const loadHelpful = async () => {
			if (!user) {
				setHelpful([]);
				setHasMoreHelpful(false);
				return;
			}
			try {
				const fetched = await getHelpfulAnalyses(PAGE_SIZE, 0);
				setHelpful(fetched);
				setHasMoreHelpful(fetched.length === PAGE_SIZE);
			} catch {
				setHelpful([]);
				setHasMoreHelpful(false);
			}
		};

		loadHistory();
		loadHelpful();
	}, [user]);

	const handleLoadMoreHistory = async () => {
		if (!user || isLoadingMoreHistory) return;
		setIsLoadingMoreHistory(true);
		try {
			const fetched = await getViewedArticles(PAGE_SIZE, history.length);
			setHistory((prev) => [...prev, ...fetched]);
			setHasMoreHistory(fetched.length === PAGE_SIZE);
		} catch {
			setHasMoreHistory(false);
		} finally {
			setIsLoadingMoreHistory(false);
		}
	};

	const handleLoadMoreHelpful = async () => {
		if (!user || isLoadingMoreHelpful) return;
		setIsLoadingMoreHelpful(true);
		try {
			const fetched = await getHelpfulAnalyses(PAGE_SIZE, helpful.length);
			setHelpful((prev) => [...prev, ...fetched]);
			setHasMoreHelpful(fetched.length === PAGE_SIZE);
		} catch {
			setHasMoreHelpful(false);
		} finally {
			setIsLoadingMoreHelpful(false);
		}
	};

	const handleCollapseHistory = () => {
		setHistory((prev) => prev.slice(0, PAGE_SIZE));
		setHasMoreHistory(true);
	};

	const handleCollapseHelpful = () => {
		setHelpful((prev) => prev.slice(0, PAGE_SIZE));
		setHasMoreHelpful(true);
	};

	return (
		<div className={styles.page}>
			<button className={styles.backButton} onClick={onBack}>
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
						<p className={styles.loginId}>
							@{user?.login_id ?? "-"}
						</p>
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

						{user && (
							<div className={styles.chipRow}>
								<span className={styles.chipRowLabel}>
									분야
								</span>
								<span
									className={styles.chip}
									data-category={user.interest}
								>
									{user.interest}
								</span>
							</div>
						)}
						{user && (
							<div className={styles.chipRow}>
								<span className={styles.chipRowLabel}>
									목적
								</span>
								<span className={styles.chip}>
									{user.purpose}
								</span>
							</div>
						)}

						{user?.extra_information && (
							<>
								<p className={styles.sectionLabel}>추가 정보</p>
								<ul className={styles.extraInfoList}>
									{user.extra_information
										.split("\n")
										.map((line) =>
											line.replace(/^•\s*/, "").trim(),
										)
										.filter(Boolean)
										.map((line, i) => (
											<li key={i}>{line}</li>
										))}
								</ul>
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
						지금까지 본 기사 ({history.length}
						{hasMoreHistory ? "+" : ""})
					</h3>

					{history.length === 0 ? (
						<p className={styles.historyEmpty}>
							아직 열람한 기사가 없어요.
						</p>
					) : (
						<>
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
											<span
												className={styles.historyChip}
												data-category={item.category}
											>
												{item.category}
											</span>
										)}
										<span
											className={
												styles.historyItemTitle
											}
										>
											{item.title}
										</span>
									</li>
								))}
							</ul>
							{(hasMoreHistory ||
								history.length > PAGE_SIZE) && (
								<div className={styles.moreRow}>
									{hasMoreHistory && (
										<button
											className={styles.moreButton}
											onClick={handleLoadMoreHistory}
											disabled={isLoadingMoreHistory}
										>
											{isLoadingMoreHistory
												? "불러오는 중..."
												: "더보기"}
										</button>
									)}
									{history.length > PAGE_SIZE && (
										<button
											className={styles.collapseButton}
											onClick={handleCollapseHistory}
										>
											접기
										</button>
									)}
								</div>
							)}
						</>
					)}

					{helpful.length > 0 && (
						<div className={styles.savedBox}>
							<h3 className={styles.historyTitle}>
								도움이 된 해설 ({helpful.length}
								{hasMoreHelpful ? "+" : ""})
							</h3>
							<ul className={styles.historyList}>
								{helpful.map((item) => (
									<li
										key={item.id}
										className={styles.savedItem}
										onClick={() =>
											navigate(`/articles/${item.id}`)
										}
									>
										{item.category && (
											<span
												className={styles.historyChip}
												data-category={item.category}
											>
												{item.category}
											</span>
										)}
										<span
											className={
												styles.historyItemTitle
											}
										>
											{item.title}
										</span>
									</li>
								))}
							</ul>
							{(hasMoreHelpful ||
								helpful.length > PAGE_SIZE) && (
								<div className={styles.moreRow}>
									{hasMoreHelpful && (
										<button
											className={styles.moreButton}
											onClick={handleLoadMoreHelpful}
											disabled={isLoadingMoreHelpful}
										>
											{isLoadingMoreHelpful
												? "불러오는 중..."
												: "더보기"}
										</button>
									)}
									{helpful.length > PAGE_SIZE && (
										<button
											className={styles.collapseButton}
											onClick={handleCollapseHelpful}
										>
											접기
										</button>
									)}
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
