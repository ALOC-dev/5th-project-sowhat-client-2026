import { Routes, Route } from "react-router-dom";
import ArticleListPage from "./pages/ArticleListPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";

function Header() {
	return (
		<div className="header">
			<div className="logo">So what</div>
		</div>
	);
}

function MyPage() {
	return (
		<div className="mypage">
			<div className="login">여기서 로그인</div>
		</div>
	);
}

export default function App() {
	return (
		<>
			<Header />
			<MyPage />
			<Routes>
				<Route path="/" element={<ArticleListPage />}/>
				<Route path="/articles/:article_id" element={<ArticleDetailPage/>}/>
			</Routes>
			
		</>
	);
}
