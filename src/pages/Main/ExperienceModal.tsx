import { useState } from "react";
import { CategoryEnum, JobEnum } from "../../types";
import styles from "./ExperienceModal.module.css";

export type ExperienceProfile = {
	ageGroup: string;
	job: JobEnum;
	interest: CategoryEnum;
};

export const EXPERIENCE_STORAGE_KEY = "sowhat_experience";

export const readExperienceProfile = (): ExperienceProfile | null => {
	try {
		const raw = sessionStorage.getItem(EXPERIENCE_STORAGE_KEY);
		return raw ? (JSON.parse(raw) as ExperienceProfile) : null;
	} catch {
		return null;
	}
};

export const clearExperienceProfile = (): void => {
	try {
		sessionStorage.removeItem(EXPERIENCE_STORAGE_KEY);
	} catch {
		// sessionStorage 사용 불가 환경이면 그냥 무시
	}
};

const AGE_GROUPS = ["10대", "20대", "30대", "40대", "50대 이상"];
const JOBS = [
	JobEnum.STUDENT,
	JobEnum.MANAGEMENT_BUSINESS,
	JobEnum.ENGINEERING_TECHNICAL,
	JobEnum.JOB_SEEKER,
	JobEnum.RETIRED_UNEMPLOYED,
];
const CATEGORIES = Object.values(CategoryEnum);

type ExperienceModalProps = {
	onClose: (profile: ExperienceProfile | null) => void;
};

export default function ExperienceModal({ onClose }: ExperienceModalProps) {
	const [ageGroup, setAgeGroup] = useState<string>("");
	const [job, setJob] = useState<string>("");
	const [interest, setInterest] = useState<string>("");

	const canSubmit = ageGroup && job && interest;

	const handleSubmit = () => {
		if (!canSubmit) return;
		const profile: ExperienceProfile = {
			ageGroup,
			job: job as JobEnum,
			interest: interest as CategoryEnum,
		};
		try {
			sessionStorage.setItem(
				EXPERIENCE_STORAGE_KEY,
				JSON.stringify(profile),
			);
		} catch {
			// sessionStorage 사용 불가 환경이면 그냥 무시
		}
		onClose(profile);
	};

	return (
		<div
			className={styles.overlay}
			onClick={() => {
				clearExperienceProfile();
				onClose(null);
			}}
		>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<p className={styles.title}>
					<span className={styles.sparkle}>✨</span> 맞춤 해설
					체험하기
				</p>
				<p className={styles.subtitle}>
					간단한 정보로 나에게 맞는 해설을 바로 확인해보세요
				</p>

				<select
					className={styles.select}
					value={ageGroup}
					onChange={(e) => setAgeGroup(e.target.value)}
				>
					<option value="">나이대 선택</option>
					{AGE_GROUPS.map((a) => (
						<option key={a} value={a}>
							{a}
						</option>
					))}
				</select>

				<select
					className={styles.select}
					value={job}
					onChange={(e) => setJob(e.target.value)}
				>
					<option value="">직업 선택</option>
					{JOBS.map((j) => (
						<option key={j} value={j}>
							{j}
						</option>
					))}
				</select>

				<select
					className={styles.select}
					value={interest}
					onChange={(e) => setInterest(e.target.value)}
				>
					<option value="">주요 관심분야</option>
					{CATEGORIES.map((c) => (
						<option key={c} value={c}>
							{c}
						</option>
					))}
				</select>

				<button
					className={styles.submit}
					disabled={!canSubmit}
					onClick={handleSubmit}
				>
					체험 해설 보기
				</button>

				<button
					className={styles.skip}
					onClick={() => {
						clearExperienceProfile();
						onClose(null);
					}}
				>
					건너뛰기
				</button>
			</div>
		</div>
	);
}
