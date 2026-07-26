export type GenderEnum = "남" | "여";
export type RegionEnum =
	| "서울"
	| "부산"
	| "대구"
	| "인천"
	| "대전"
	| "울산"
	| "경기"
	| "강원"
	| "충북"
	| "충남"
	| "전북"
	| "전남"
	| "경북"
	| "경남"
	| "제주";
export type JobEnum =
	| "경영·사업"
	| "금융·투자"
	| "회계·세무"
	| "법률·사법"
	| "공공·행정"
	| "정치·외교"
	| "교육"
	| "과학·연구"
	| "IT·소프트웨어"
	| "데이터·AI"
	| "공학·기술"
	| "의료·보건"
	| "사회복지·상담"
	| "언론·미디어"
	| "문화·예술"
	| "콘텐츠·엔터테인먼트"
	| "디자인·광고·마케팅"
	| "건설·건축"
	| "제조·생산"
	| "판매·유통·영업"
	| "운송·물류"
	| "농림·축산·어업"
	| "서비스·관광·외식"
	| "스포츠·체육"
	| "군인·소방·경찰"
	| "학생"
	| "취업준비생"
	| "주부·가사"
	| "은퇴·무직";
export type CategoryEnum = "정치" | "경제" | "사회" | "산업/IT";
export type PurposeEnum = "일반" | "공부" | "취·창업" | "투자";

export type KeywordItem = {
	word: string;
	description: string;
};

export type Article = {
	id: number;
	title: string;
	source_url: string;
	publisher: string;
	published_at: Date;
	category: CategoryEnum;
	content: string;
};

export type ArticleDetail = {
	id: number;
	title: string;
	source_url: string;
	publisher: string;
	published_at: Date;
	reporter: string;
	category: CategoryEnum;
	content: string;
	summary: string;
	keyword: KeywordItem[];
};

export type PersonalAnalysis = {
	effect: string;
	solution: string;
	links: string[];
};

export type User = {
	id: number;
	login_id: string;
	username: string;
	age: number;
	gender: GenderEnum;
	region: RegionEnum;
	job: JobEnum;
	interest: CategoryEnum;
	purpose: PurposeEnum;
	extra_information: string;
};
