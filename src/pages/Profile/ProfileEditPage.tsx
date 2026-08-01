import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../api/users";
import { isMockLoginEnabled, MOCK_USER } from "../../lib/mockAuth"; // TODO: 제출 전 삭제
import {
	CategoryEnum,
	GenderEnum,
	JobEnum,
	PurposeEnum,
	RegionEnum,
	User,
} from "../../types";
import styles from "./ProfileEditPage.module.css";

const GENDERS = Object.values(GenderEnum);
const REGIONS = Object.values(RegionEnum);
const JOBS = Object.values(JobEnum);
const CATEGORIES = Object.values(CategoryEnum);
const PURPOSES = Object.values(PurposeEnum);

type ProfileEditPageProps = {
	user: User | null;
};

export default function ProfileEditPage({ user }: ProfileEditPageProps) {
	const navigate = useNavigate();
	const [form, setForm] = useState<User | null>(user);
	const [isSaving, setIsSaving] = useState<boolean>(false);

	useEffect(() => {
		setForm(user);
	}, [user]);

	const handleSave = async () => {
		if (!user || !form) return;
		setIsSaving(true);

		if (isMockLoginEnabled()) {
			// TODO: 제출 전 삭제 - 목업 로그인 모드에서는 실제 저장 대신 화면 확인용으로 목업 데이터만 갱신
			Object.assign(MOCK_USER, form);
			setIsSaving(false);
			navigate("/profile");
			return;
		}

		const updated = await updateUser({
			username: form.username == user.username ? undefined : form.username,
			age: form.age == user.age ? undefined : form.age,
			gender: form.gender == user.gender ? undefined : form.gender,
			region: form.region == user.region ? undefined : form.region,
			job: form.job == user.job ? undefined : form.job,
			interest:
				form.interest == user.interest ? undefined : form.interest,
			purpose:
				form.purpose == user.purpose ? undefined : form.purpose,
			extra_information:
				form.extra_information == user.extra_information
					? undefined
					: form.extra_information,
		});

		setIsSaving(false);
		if (updated) navigate("/profile");
	};

	if (!form) {
		return (
			<div className={styles.page}>
				<button
					className={styles.backButton}
					onClick={() => navigate("/profile")}
				>
					← 돌아가기
				</button>
				<p>불러오는 중...</p>
			</div>
		);
	}

	return (
		<div className={styles.page}>
			<button
				className={styles.backButton}
				onClick={() => navigate("/profile")}
			>
				← 취소하고 돌아가기
			</button>

			<h2 className={styles.title}>내 정보 수정</h2>

			<div className={styles.formBox}>
				<div className={styles.row}>
					<label className={styles.label}>이름</label>
					<input
						className={styles.input}
						type="text"
						value={form.username}
						onChange={(e) =>
							setForm({ ...form, username: e.target.value })
						}
					/>
				</div>

				<div className={styles.row}>
					<label className={styles.label}>나이</label>
					<input
						className={styles.input}
						type="number"
						min="0"
						max="120"
						value={form.age}
						onChange={(e) => {
							const v = Number(e.target.value);
							if (v >= 0) setForm({ ...form, age: v });
						}}
					/>
				</div>

				<div className={styles.row}>
					<label className={styles.label}>성별</label>
					<select
						className={styles.input}
						value={form.gender}
						onChange={(e) =>
							setForm({
								...form,
								gender: e.target.value as GenderEnum,
							})
						}
					>
						{GENDERS.map((g) => (
							<option key={g} value={g}>
								{g}
							</option>
						))}
					</select>
				</div>

				<div className={styles.row}>
					<label className={styles.label}>거주지역</label>
					<select
						className={styles.input}
						value={form.region}
						onChange={(e) =>
							setForm({
								...form,
								region: e.target.value as RegionEnum,
							})
						}
					>
						{REGIONS.map((r) => (
							<option key={r} value={r}>
								{r}
							</option>
						))}
					</select>
				</div>

				<div className={styles.row}>
					<label className={styles.label}>직업</label>
					<select
						className={styles.input}
						value={form.job}
						onChange={(e) =>
							setForm({ ...form, job: e.target.value as JobEnum })
						}
					>
						{JOBS.map((j) => (
							<option key={j} value={j}>
								{j}
							</option>
						))}
					</select>
				</div>

				<div className={styles.row}>
					<label className={styles.label}>관심분야</label>
					<select
						className={styles.input}
						value={form.interest}
						onChange={(e) =>
							setForm({
								...form,
								interest: e.target.value as CategoryEnum,
							})
						}
					>
						{CATEGORIES.map((c) => (
							<option key={c} value={c}>
								{c}
							</option>
						))}
					</select>
				</div>

				<div className={styles.row}>
					<label className={styles.label}>관심목적</label>
					<select
						className={styles.input}
						value={form.purpose}
						onChange={(e) =>
							setForm({
								...form,
								purpose: e.target.value as PurposeEnum,
							})
						}
					>
						{PURPOSES.map((p) => (
							<option key={p} value={p}>
								{p}
							</option>
						))}
					</select>
				</div>

				<div className={styles.row}>
					<label className={styles.label}>추가 정보</label>
					<textarea
						className={styles.textarea}
						value={form.extra_information}
						placeholder="보유 주식, 이사 계획 등 자유롭게 입력해주세요"
						onChange={(e) =>
							setForm({
								...form,
								extra_information: e.target.value,
							})
						}
					/>
				</div>
			</div>

			<div className={styles.buttonGroup}>
				<button
					className={styles.cancelButton}
					onClick={() => navigate("/profile")}
					disabled={isSaving}
				>
					취소
				</button>
				<button
					className={styles.saveButton}
					onClick={handleSave}
					disabled={isSaving}
				>
					{isSaving ? "저장 중..." : "저장하기"}
				</button>
			</div>
		</div>
	);
}
