import styles from "./PreviewPage.module.css";

const NOT_LOGIN_PAGES = [
	{ label: "메인 (랜딩)", path: "/" },
	{ label: "기사 목록", path: "/articles" },
	{ label: "기사 상세", path: "/articles/1778" },
	{ label: "로그인", path: "/login" },
	{ label: "회원가입", path: "/signup" },
];
const LOGIN_PAGES = [
	{ label: "메인 (랜딩)", path: "/" },
	{ label: "기사 목록", path: "/articles" },
	{ label: "기사 상세", path: "/articles/1778" },
	{ label: "프로필", path: "/profile" },
	{ label: "프로필 수정", path: "/profile/edit" },
];

export default function PreviewPage({ isLogin }: { isLogin: boolean }) {
	return (
		<div className={styles.page}>
			<h1 className={styles.title}>화면 미리보기</h1>
			<p className={styles.subtitle}></p>

			<div className={styles.grid}>
				{(isLogin ? LOGIN_PAGES : NOT_LOGIN_PAGES).map((page) => (
					<a
						key={page.path}
						className={styles.card}
						href={page.path}
						target="_blank"
						rel="noreferrer"
					>
						<div className={styles.frameWrap}>
							<iframe
								className={styles.frame}
								src={page.path}
								title={page.label}
								loading="lazy"
							/>
						</div>
						<p className={styles.cardLabel}>{page.label}</p>
					</a>
				))}
			</div>
		</div>
	);
}
