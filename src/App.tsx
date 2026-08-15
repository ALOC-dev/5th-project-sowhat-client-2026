import { useEffect, useRef, useState } from "react";
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
import ToastHost from "./ui/ToastHost";

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

// /profile, /profile/edit 등 "프로필" 관련 화면인지 판별
const isProfilePath = (pathname: string): boolean =>
	pathname === "/profile" || pathname.startsWith("/profile/");

export default function App() {
	const [isLogin, setIsLogin] = useState<boolean>(false);
	const [user, setUser] = useState<User | null>(null);
	const location = useLocation();
	const navigate = useNavigate();

	// "돌아가기"가 프로필 화면들을 건너뛰도록 하는 상태.
	// ProfilePage/ProfileEditPage는 라우트가 바뀌면 언마운트되므로,
	// 이 로직은 언마운트되지 않는 App에 둬야 여러 번의 뒤로가기를 이어갈 수 있다.
	const isSkippingProfileBackRef = useRef(false);
	const [profileBackRequestId, setProfileBackRequestId] = useState(0);

	const requestProfileBackSkip = () => {
		isSkippingProfileBackRef.current = true;
		setProfileBackRequestId((v) => v + 1);
	};

	useEffect(() => {
		if (!isSkippingProfileBackRef.current) return;

		if (!isProfilePath(location.pathname)) {
			isSkippingProfileBackRef.current = false;
			return;
		}

		navigate(-1);

		// 히스토리가 소진돼 navigate(-1)가 아무 효과도 못 낼 경우를 대비한 안전장치
		// (위치가 실제로 바뀌면 이 effect가 다시 실행되면서 아래 cleanup이 타이머를 취소한다)
		const timer = setTimeout(() => {
			isSkippingProfileBackRef.current = false;
			navigate("/", { replace: true });
		}, 150);
		return () => clearTimeout(timer);
	}, [location, navigate, profileBackRequestId]);

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
		<div className={styles.appRoot}>
			<ToastHost />
			<Header isLogin={isLogin} user={user} />

			<main className={styles.main}>
				<Routes>
					<Route
						path="/"
						element={<MainPage isLogin={isLogin} user={user} />}
					/>

					<Route
						path="/login"
						element={
							<LoginPage
								setIsLogin={setIsLogin}
								setUser={setUser}
							/>
						}
					/>

					<Route
						path="/signup"
						element={
							<SignupPage
								setIsLogin={setIsLogin}
								setUser={setUser}
							/>
						}
					/>

					<Route
						path="/profile"
						element={
							<ProfilePage
								user={user}
								setIsLogin={setIsLogin}
								onBack={requestProfileBackSkip}
							/>
						}
					/>

					<Route
						path="/profile/edit"
						element={
							<ProfileEditPage user={user} setUser={setUser} />
						}
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
			</main>

			<footer className={styles.footer}>
				© 2026 So What? — 나를 위한 뉴스 해설
			</footer>
		</div>
	);
}
