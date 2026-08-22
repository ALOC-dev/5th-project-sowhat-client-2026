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
import AiPolicyPage from "./pages/Policy/AiPolicyPage";
import CopyrightPolicyPage from "./pages/Policy/CopyrightPolicyPage";
import PrivacyPolicyPage from "./pages/Policy/PrivacyPolicyPage";

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
										`/login?redirect=${encodeURIComponent(
											location.pathname + location.search,
										)}`,
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

const isLoginOrSignupPath = (pathname: string): boolean =>
	pathname.startsWith("/login") || pathname.startsWith("/signup");

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
						element={
							<MainPage
								isLogin={isLogin}
								user={user}
								setUser={setUser}
							/>
						}
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

					<Route
						path="/preview"
						element={<PreviewPage isLogin={isLogin} />}
					/>

					<Route path="/aipolicy" element={<AiPolicyPage />} />
					<Route path="/copyrightpolicy" element={<CopyrightPolicyPage />} />
					<Route path="/privacypolicy" element={<PrivacyPolicyPage />} />

					<Route
						path="/articles/:article_id"
						element={
							<ArticleDetailPage isLogin={isLogin} user={user} />
						}
					/>
				</Routes>
			</main>

			{isLoginOrSignupPath(location.pathname) ? (
				<footer className={styles.authFooter}>
					<span>개인정보처리방침 (페이지 링크 넣기)</span>
				</footer>
			) : (
				<footer className={styles.footer}>
					<div className={styles.footerContent}>
						<div className={styles.footerGroup}>
							<h2>So What 개발팀</h2>
							<ul>
								<li>
									Email{" | "}
									<a href="mailto:sowhat.aloc@gmail.com">
										sowhat.aloc@gmail.com
									</a>
								</li>
								<li>
									Instagram{" | "}
									<a href="">@sowhat.dev (링크 넣기)</a>
								</li>
								<li>
									<a href="">
										문의사항 및 피드백 (구글폼 주소 넣기)
									</a>
								</li>
							</ul>
						</div>
						<div className={styles.footerGroup}>
							<h2>서비스 안내</h2>
							<ul>
								<li onClick={() => navigate("/aipolicy")}>
									AI 콘텐츠 안내 (페이지 링크 넣기)
								</li>
								<li onClick={() => navigate("/copyrightpolicy")}>
									저작권 및 콘텐츠 이용정책 (페이지 링크 넣기)
								</li>
								<li onClick={() => navigate("/privacypolicy")}>
									개인정보처리방침 (페이지 링크 넣기)
								</li>
							</ul>
						</div>
					</div>
					<p className={styles.footerNotice}>
						본 서비스는 비상업적 학생 프로젝트로 운영되며, 뉴스
						원문을 직접 제공하지 않습니다. 기사 내용은 서비스 목적에
						맞게 일부 가공하여 제공하고, 원문은 출처 링크를 통해
						확인할 수 있습니다.
					</p>
					<p className={styles.copyright}>© 2026 So What</p>
				</footer>
			)}
		</div>
	);
}
