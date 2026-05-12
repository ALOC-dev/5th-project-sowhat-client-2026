import { Route, Routes, useNavigate } from "react-router-dom";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import ArticleListPage from "./pages/ArticleListPage";

function Header() {
	const navigate = useNavigate();

	return (
		<div className="header">
			<div
				className="logo"
				onClick={() => {
					navigate(`/articles`);
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
			<div className="login">여기서 로그인</div>
		</div>
	);
}

function MyPage() {
	 const navigate = useNavigate();
	return (
		<div onClick={() => navigate("/profile")} >
			<div className="login">마이페이지</div>
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
				<Route path="/articles" element={<ArticleListPage />} />
				<Route
					path="/articles/:article_id"
					element={<ArticleDetailPage />}
				/>
			</Routes>
		</>
	);
}


