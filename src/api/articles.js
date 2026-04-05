/* 뉴스 기사 Mock data */
const MOCK_ARTICLES = [
	{
		article_id: 1,
		image: "",
		title: "첫 번째 기사",
		date: "2026-03-31",
		content: "이것은 첫 번째 기사 내용 일부입니다.",
	},
	{
		article_id: 2,
		image: "",
		title: "두 번째 기사",
		date: "2026-03-30",
		content: "이것은 두 번째 기사 내용 일부입니다.",
	},
	{
		article_id: 3,
		image: "",
		title: "세 번째 기사",
		date: "2026-03-29",
		content: "이것은 세 번째 기사 내용 일부입니다.",
	},
];

export function getArticles() {
	return MOCK_ARTICLES;
}
