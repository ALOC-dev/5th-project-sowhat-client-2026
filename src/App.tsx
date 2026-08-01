import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { getUser } from "./api/users";
import { isMockLoginEnabled, MOCK_USER } from "./lib/mockAuth"; // TODO: 제출 전 삭제
import { User } from "./types";
import styles from "./App.module.css";

import ArticleDetailPage from "./pages/Article/ArticleDetailPage";
import ArticleListPage from "./pages/Article/ArticleListPage";
import LoginPage from "./pages/Login/LoginPage";
import MainPage from "./pages/Main/MainPage";
import PreviewPage from "./pages/Preview/PreviewPage";
import ProfileEditPage from "./pages/Profile/ProfileEditPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import SignupPage from "./pages/Signup/SignupPage";

type HeaderProps = {
	isLogin: boolean;
	user: User | null;
};

function Header({ isLogin, user }: HeaderProps) {
	const location = useLocation();
	const navigate = useNavigate();
	const isLanding = location.pathname === "/";

	return (
		<header
			className={styles.header}
			data-landing={isLanding}
		>
			<div className={styles.logo} onClick={() => navigate("/")}>
				So What
			</div>

			<nav className={styles.nav}>
				{isLogin ? (
					<>
						<button
							className={styles.navLink}
							onClick={() => navigate("/articles")}
						>
							뉴스
						</button>

						<button
							className={styles.avatarButton}
							onClick={() => navigate("/profile")}
							title={user?.username}
						>
							👤
						</button>
					</>
				) : (
					<>
						<button
							className={styles.navLink}
							onClick={() => {
								if (
									location.pathname == "/login" ||
									location.pathname == "/signup"
								)
									navigate(`/login?redirect=/`);
								else
									navigate(
										`/login?redirect=${location.pathname}`,
									);
							}}
						>
							로그인
						</button>

						<button
							className={styles.button}
							onClick={() => navigate("/signup")}
						>
							회원가입
						</button>
					</>
				)}
			</nav>
		</header>
	);
}

export default function App() {
	const [isLogin, setIsLogin] = useState<boolean>(false);
	const [user, setUser] = useState<User | null>(null);

	// 새로고침해도 로그인 세션(쿠키)이 살아있으면 로그인 상태 유지
	useEffect(() => {
		if (isMockLoginEnabled()) {
			// TODO: 제출 전 삭제 - 목업 로그인 모드
			setUser(MOCK_USER);
			setIsLogin(true);
			return;
		}
		const checkSession = async () => {
			const fetched = await getUser();
			if (fetched) {
				setUser(fetched);
				setIsLogin(true);
			}
		};
		checkSession();
	}, []);

	useEffect(() => {
		if (!isLogin) {
			setUser(null);
			return;
		}
		if (isMockLoginEnabled()) {
			// TODO: 제출 전 삭제 - 목업 로그인 모드
			setUser(MOCK_USER);
			return;
		}
		const fetchUser = async () => {
			const fetched = await getUser();
			setUser(fetched ?? null);
		};
		fetchUser();
	}, [isLogin]);

	return (
		<>
			<Header isLogin={isLogin} user={user} />

			<Routes>
				<Route
					path="/"
					element={<MainPage isLogin={isLogin} user={user} />}
				/>

				<Route
					path="/login"
					element={<LoginPage setIsLogin={setIsLogin} />}
				/>

				<Route
					path="/signup"
					element={<SignupPage setIsLogin={setIsLogin} />}
				/>

				<Route
					path="/profile"
					element={
						<ProfilePage user={user} setIsLogin={setIsLogin} />
					}
				/>

				<Route
					path="/profile/edit"
					element={<ProfileEditPage user={user} />}
				/>

				<Route
					path="/articles"
					element={<ArticleListPage isLogin={isLogin} />}
				/>

				<Route path="/preview" element={<PreviewPage />} />

				<Route
					path="/articles/:article_id"
					element={
						<ArticleDetailPage isLogin={isLogin} user={user} />
					}
				/>
			</Routes>
		</>
	);
}
