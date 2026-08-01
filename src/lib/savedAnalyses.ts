export type SavedAnalysisItem = {
	articleId: number;
	title: string;
	effect: string;
	solution: string;
	savedAt: string;
};

const STORAGE_KEY = "sowhat_saved_analyses";

export const getSavedAnalyses = (): SavedAnalysisItem[] => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as SavedAnalysisItem[]) : [];
	} catch {
		return [];
	}
};

export const isAnalysisSaved = (articleId: number): boolean => {
	return getSavedAnalyses().some((item) => item.articleId === articleId);
};

export const saveAnalysis = (item: {
	articleId: number;
	title: string;
	effect: string;
	solution: string;
}): void => {
	try {
		const existing = getSavedAnalyses().filter(
			(h) => h.articleId !== item.articleId,
		);
		const updated: SavedAnalysisItem[] = [
			{ ...item, savedAt: new Date().toISOString() },
			...existing,
		];
		localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
	} catch {
		// localStorage 사용 불가 환경이면 그냥 무시
	}
};

export const removeSavedAnalysis = (articleId: number): void => {
	try {
		const updated = getSavedAnalyses().filter(
			(h) => h.articleId !== articleId,
		);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
	} catch {
		// ignore
	}
};
