/**
 * ⚠️ 임시 개발용 파일입니다.
 * 백엔드 회원가입/로그인이 느릴 때 로그인 이후 화면을 빠르게 확인하기 위한 용도예요.
 * 실제 제출/배포 전에는 이 파일과, 이 파일을 사용하는 부분(LoginPage의 "테스트용 임시 로그인"
 * 버튼, App.tsx의 isMockLogin 체크)을 꼭 지워주세요.
 */
import { CategoryEnum, GenderEnum, JobEnum, PurposeEnum, RegionEnum, User } from "../types";

const MOCK_FLAG_KEY = "sowhat_dev_mock_login";

export const MOCK_USER: User = {
	id: 0,
	login_id: "tester",
	username: "테스터",
	age: 25,
	gender: GenderEnum.MALE,
	region: RegionEnum.SEOUL,
	job: JobEnum.STUDENT,
	interest: CategoryEnum.ECONOMY,
	purpose: PurposeEnum.GENERAL,
	extra_information: "임시 테스트 계정입니다.",
};

export const enableMockLogin = (): void => {
	try {
		localStorage.setItem(MOCK_FLAG_KEY, "1");
	} catch {
		// ignore
	}
};

export const disableMockLogin = (): void => {
	try {
		localStorage.removeItem(MOCK_FLAG_KEY);
	} catch {
		// ignore
	}
};

export const isMockLoginEnabled = (): boolean => {
	try {
		return localStorage.getItem(MOCK_FLAG_KEY) === "1";
	} catch {
		return false;
	}
};
