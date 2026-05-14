import { Route, Routes, useNavigate } from "react-router-dom";
import styles from "./App.module.css"

import LoginPage from "./pages/Login/LoginPage";
import MainPage from "./pages/Main/MainPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import ArticleDetailPage from "./pages/Article/ArticleDetailPage";
import ArticleListPage from "./pages/Article/ArticleListPage";

function Header() {
	const navigate = useNavigate();

	return (
		<header className={styles.header}>
			<div className = {styles.logo} onClick={() => {navigate(`/`);}}>
				So What
			</div>

			<nav className = {styles.nav}>
				<button className = {styles.button} onClick={() => navigate("/login")} >
					<h1 className={styles.login}>로그인</h1>
				</button>
				<button className = {styles.button} onClick={() => navigate("/signup")} >
					<h1 className = {styles.signup}>회원가입</h1>
				</button>
			</nav>
		
		</header>
	);



}

function MyPage() {
	 const navigate = useNavigate();
	return (
		<div onClick={() => navigate("/profile")} >
			<div className = {styles.mypage}>마이페이지</div>
		</div>
	);
}

export default function App() {
	
	return (
		<>
			
      		
			<Header />
			{/* <MyPage /> */}
			
			
			
			<Routes>
				<Route path="/" element={<MainPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/profile" element={<ProfilePage />} />
				<Route path="/articles" element={<ArticleListPage />} />
				<Route path="/articles/:article_id" element={<ArticleDetailPage />}/>
			</Routes>
		</>
	);
}


