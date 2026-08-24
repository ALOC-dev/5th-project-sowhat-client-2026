import { CategoryEnum } from "../types";

// 기사 원본 사진은 언론사 저작물이라 그대로 쓸 수 없어서,
// 저작권 걱정 없는 무료 사진(Unsplash) 풀에서 제목 키워드에 맞는 걸 골라 대신 붙인다.
type ImagePoolEntry = {
	url: string;
	keywords: string[];
};

const params = "w=600&h=400&fit=crop&auto=format";

const CATEGORY_IMAGE_POOL: Record<CategoryEnum, ImagePoolEntry[]> = {
	[CategoryEnum.POLITICS]: [
		{
			url: `https://images.unsplash.com/photo-1523292562811-8fa7962a78c8?${params}`,
			keywords: ["정부", "청와대", "행정", "공공", "부처"],
		},
		{
			url: `https://images.unsplash.com/photo-1762246433142-d7d357c76cb5?${params}`,
			keywords: ["국회", "의회", "입법", "법안", "본회의", "여야"],
		},
		{
			url: `https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?${params}`,
			keywords: ["선거", "투표", "대선", "총선", "재검표"],
		},
		{
			url: `https://images.unsplash.com/photo-1571795184552-5f1df723de54?${params}`,
			keywords: [
				"군",
				"국방",
				"안보",
				"병역",
				"군인",
				"병무청",
				"전차",
				"부대",
				"장갑차",
			],
		},
		{
			url: `https://images.unsplash.com/photo-1633095975779-fd354aa0dc95?${params}`,
			keywords: ["외교", "정상회담", "국제", "정상", "순방"],
		},
	],
	[CategoryEnum.ECONOMY]: [
		{
			url: `https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?${params}`,
			keywords: ["증시", "주가", "코스피", "증권", "주식", "펀드"],
		},
		{
			url: `https://images.unsplash.com/photo-1643665592005-843f3f6b4ece?${params}`,
			keywords: ["부동산", "아파트", "전세", "주택", "청약"],
		},
		{
			url: `https://images.unsplash.com/photo-1656832020447-bc9446b5028a?${params}`,
			keywords: ["물가", "장바구니", "폭염", "마트", "식품", "농산물"],
		},
		{
			url: `https://images.unsplash.com/photo-1565371768838-2479eb537a78?${params}`,
			keywords: ["금리", "한국은행", "화폐", "대출", "자금", "은행"],
		},
		{
			url: `https://images.unsplash.com/photo-1517048676732-d65bc937f952?${params}`,
			keywords: ["기업", "취업", "고용", "일자리", "실적", "경영"],
		},
		{
			url: `https://images.unsplash.com/photo-1606185540834-d6e7483ee1a4?${params}`,
			keywords: ["무역", "수출", "수입", "물류", "관세"],
		},
	],
	[CategoryEnum.SOCIETY]: [
		{
			url: `https://images.unsplash.com/photo-1535189043414-47a3c49a0bed?${params}`,
			keywords: ["동네", "지역", "마을", "골목"],
		},
		{
			url: `https://images.unsplash.com/photo-1688055536554-2716ab46aaaf?${params}`,
			keywords: ["경찰", "범죄", "수사", "사건", "검찰"],
		},
		{
			url: `https://images.unsplash.com/photo-1580582932707-520aed937b7b?${params}`,
			keywords: ["교육", "학교", "학생", "교사", "입시"],
		},
		{
			url: `https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?${params}`,
			keywords: ["복지", "아동", "돌봄", "지원", "노인", "장애"],
		},
		{
			url: `https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?${params}`,
			keywords: ["병원", "의료", "보건", "질병", "감염"],
		},
		{
			url: `https://images.unsplash.com/photo-1511898634545-c01af8a54dd5?${params}`,
			keywords: ["시위", "집회", "논란", "갈등"],
		},
	],
	[CategoryEnum.INDUSTRY_IT]: [
		{
			url: `https://images.unsplash.com/photo-1518770660439-4636190af475?${params}`,
			keywords: ["반도체", "전자", "칩", "회로", "디스플레이", "LED"],
		},
		{
			url: `https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?${params}`,
			keywords: ["자동차", "차량", "전기차", "완성차", "중고차"],
		},
		{
			url: `https://images.unsplash.com/photo-1737644467636-6b0053476bb2?${params}`,
			keywords: ["로봇", "AI", "인공지능", "자동화", "생성형"],
		},
		{
			url: `https://images.unsplash.com/photo-1578776349090-de61da00ff1a?${params}`,
			keywords: ["공장", "에너지", "제조", "발전", "전력"],
		},
		{
			url: `https://images.unsplash.com/photo-1506399309177-3b43e99fead2?${params}`,
			keywords: ["데이터센터", "서버", "클라우드", "네트워크"],
		},
		{
			url: `https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?${params}`,
			keywords: ["스마트폰", "모바일", "앱", "플랫폼"],
		},
	],
};

const DEFAULT_POOL = CATEGORY_IMAGE_POOL[CategoryEnum.SOCIETY];

function hashString(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (hash * 31 + str.charCodeAt(i)) | 0;
	}
	return Math.abs(hash);
}

export function getCategoryImage(article: {
	category?: CategoryEnum;
	title?: string;
	id?: number;
}): string {
	const pool =
		(article.category && CATEGORY_IMAGE_POOL[article.category]) ||
		DEFAULT_POOL;
	const title = article.title ?? "";

	const matched = pool.find((entry) =>
		entry.keywords.some((keyword) => title.includes(keyword)),
	);
	if (matched) return matched.url;

	// 키워드 매칭이 없으면 기사마다 다른 사진이 나오도록 고르게 분산시킨다
	const index = hashString(title || String(article.id ?? 0)) % pool.length;
	return pool[index].url;
}
