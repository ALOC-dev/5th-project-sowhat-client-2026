import { CategoryEnum } from "../types";

export type ReadingHistoryItem = {
	id: number;
	title: string;
	category?: CategoryEnum;
	viewedAt: string;
};

const STORAGE_KEY = "sowhat_reading_history";
const MAX_ITEMS = 30;

export const getReadingHistory = (): ReadingHistoryItem[] => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as ReadingHistoryItem[]) : [];
	} catch {
		return [];
	}
};

export const recordArticleView = (item: {
	id: number;
	title: string;
	category?: CategoryEnum;
}): void => {
	try {
		const existing = getReadingHistory().filter((h) => h.id !== item.id);
		const updated: ReadingHistoryItem[] = [
			{ ...item, viewedAt: new Date().toISOString() },
			...existing,
		].slice(0, MAX_ITEMS);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
	} catch {
		// localStorage 사용 불가 환경이면 그냥 무시
	}
};
