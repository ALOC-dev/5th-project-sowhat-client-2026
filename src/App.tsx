import { useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import styles from "./App.module.css";

import ArticleDetailPage from "./pages/Article/ArticleDetailPage";
import ArticleListPage from "./pages/Article/ArticleListPage";
import LoginPage from "./pages/Login/LoginPage";
import MainPage from "./pages/Main/MainPage";
import PreviewPage from "./pages/Preview/PreviewPage";
import ProfilePage from "./pages/Profile/ProfilePage";

type HeaderProps = {
	isLogin: boolean;
};

function Header({ isLogin }: HeaderProps) {
	const location = useLocation();
	const navigate = useNavigate();

	return (
		<header className={styles.header}>
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
						>
							👤
						</button>
					</>
				) : (
					<>
						<button
							className={styles.navLink}
							onClick={() =>
								navigate(`/login?redirect=${location.pathname}`)
							}
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

	return (
		<>
			<Header isLogin={isLogin} />

			<Routes>
				<Route path="/" element={<MainPage />} />

				<Route
					path="/login"
					element={<LoginPage setIsLogin={setIsLogin} />}
				/>

				<Route
					path="/profile"
					element={<ProfilePage setIsLogin={setIsLogin} />}
				/>

				<Route path="/articles" element={<ArticleListPage />} />

				<Route path="/preview" element={<PreviewPage />} />

				<Route
					path="/articles/:article_id"
					element={<ArticleDetailPage isLogin={isLogin} />}
				/>
			</Routes>
		</>
	);
}
