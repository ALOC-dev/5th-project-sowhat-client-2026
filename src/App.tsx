import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { getUser } from "./api/users";
import styles from "./App.module.css";
import { User } from "./types";

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
		<header className={styles.header} data-landing={isLanding}>
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
							전체 기사 보기
						</button>

						<button
							className={styles.avatarButton}
							onClick={() => navigate("/profile")}
							title={user?.username}
						>
							{user?.username?.[0] ?? "?"}
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
	// 로그인 안 한 사용자에게도 항상 실행되는 확인용 호출이라, 실패(401)해도 알림을 띄우지 않는다
	useEffect(() => {
		const checkSession = async () => {
			try {
				const fetched = await getUser({ silent: true });
				if (fetched) {
					setUser(fetched);
					setIsLogin(true);
				}
			} catch {
				// 로그인 안 된 상태면 실패해도 무시
			}
		};
		checkSession();
	}, []);

	// 로그아웃 시(isLogin이 false로 바뀔 때) user 정보 초기화
	// (isLogin이 true가 되는 경로는 setUser를 이미 직접 호출하므로 여기서 다시 fetch하지 않는다)
	useEffect(() => {
		if (!isLogin) {
			setUser(null);
		}
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
					element={
						<LoginPage setIsLogin={setIsLogin} setUser={setUser} />
					}
				/>

				<Route
					path="/signup"
					element={
						<SignupPage setIsLogin={setIsLogin} setUser={setUser} />
					}
				/>

				<Route
					path="/profile"
					element={
						<ProfilePage user={user} setIsLogin={setIsLogin} />
					}
				/>

				<Route
					path="/profile/edit"
					element={<ProfileEditPage user={user} setUser={setUser} />}
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
