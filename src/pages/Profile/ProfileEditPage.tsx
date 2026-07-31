import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, updateUser } from "../../api/users";
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

export default function ProfileEditPage() {
	const navigate = useNavigate();
	const [original, setOriginal] = useState<User | null>(null);
	const [form, setForm] = useState<User | null>(null);
	const [isSaving, setIsSaving] = useState<boolean>(false);

	useEffect(() => {
		const fetchUser = async () => {
			const fetched = await getUser();
			setOriginal(fetched ?? null);
			setForm(fetched ?? null);
		};

		fetchUser();
	}, []);

	const handleSave = async () => {
		if (!original || !form) return;
		setIsSaving(true);

		const updated = await updateUser({
			username: form.username == original.username ? undefined : form.username,
			age: form.age == original.age ? undefined : form.age,
			gender: form.gender == original.gender ? undefined : form.gender,
			region: form.region == original.region ? undefined : form.region,
			job: form.job == original.job ? undefined : form.job,
			interest:
				form.interest == original.interest ? undefined : form.interest,
			purpose:
				form.purpose == original.purpose ? undefined : form.purpose,
			extra_information:
				form.extra_information == original.extra_information
					? undefined
					: form.extra_information,
		});

		setIsSaving(false);
		if (updated) navigate("/profile");
	};

	if (!form) {
		return (
			<div className={styles.page}>
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
						value={form.age}
						onChange={(e) =>
							setForm({ ...form, age: Number(e.target.value) })
						}
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
