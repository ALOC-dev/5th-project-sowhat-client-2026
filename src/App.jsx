import ArticleListPage from "./pages/ArticleListPage";

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
			<ArticleListPage />
		</>
	);
}
