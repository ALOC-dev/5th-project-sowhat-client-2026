import { Route, Routes, useNavigate } from "react-router-dom";
import * as styles from "./App.style"

import LoginPage from "./pages/Login/LoginPage";
import MainPage from "./pages/Main/MainPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import ArticleDetailPage from "./pages/Article/ArticleDetailPage";
import ArticleListPage from "./pages/Article/ArticleListPage";

function Header() {
	const navigate = useNavigate();

	return (
		<div style={styles.headerStyle}>
			<div
				style = {styles.logoStyle}
				onClick={() => {
					navigate(`/`);
				}}
			>
				So what
			</div>
		</div>
	);
}

function Login() {
	 const navigate = useNavigate();
		return (
		<div onClick={() => navigate("/login")} >
			<div style = {styles.loginStyle}>여기서 로그인</div>
		</div>
	);
}

function MyPage() {
	 const navigate = useNavigate();
	return (
		<div onClick={() => navigate("/profile")} >
			<div style = {styles.mypageStyle}>마이페이지</div>
		</div>
	);
}

export default function App() {
	
	return (
		<>
			
      		
			<Header />
			<MyPage />
			<Login />
			
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


