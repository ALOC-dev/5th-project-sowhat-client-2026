import styles from "./PreviewPage.module.css";

const PAGES = [
	{ label: "메인 (랜딩)", path: "/" },
	{ label: "기사 목록", path: "/articles" },
	{ label: "기사 상세", path: "/articles/1" },
	{ label: "로그인", path: "/login" },
	{ label: "프로필", path: "/profile" },
];

export default function PreviewPage() {
	return (
		<div className={styles.page}>
			<h1 className={styles.title}>화면 미리보기</h1>
			<p className={styles.subtitle}>
				실제 페이지를 축소해서 보여줘요. 클릭하면 새 탭에서 열려요.
			</p>

			<div className={styles.grid}>
				{PAGES.map((page) => (
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
