import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, updateUser } from "../../api/users";
import { CategoryEnum, GenderEnum, PurposeEnum, User } from "../../types";
import styles from "./ProfilePage.module.css";

type ProfilePageProps = {
	setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

const GENDERS: GenderEnum[] = ["남", "여"];
const REGIONS = ["서울", "부산", "대구", "인천", "대전"];
const JOBS = ["학생", "경영·사업", "공학·기술", "취업준비생", "기타"];
const CATEGORIES: CategoryEnum[] = ["정치", "경제", "사회", "산업/IT"];
const PURPOSES: PurposeEnum[] = ["일반", "공부", "취·창업", "투자"];

export default function ProfilePage({ setIsLogin }: ProfilePageProps) {
	const navigate = useNavigate();
	const [user, setUser] = useState<User | null>(null);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [form, setForm] = useState<User | null>(null);

	const handleLogout = (): void => {
		setIsLogin(false);
		navigate("/");
	};

	useEffect(() => {
		const fetchUser = async () => {
			const fetched = await getUser();
			setUser((prev) => fetched ?? null);
		};

		fetchUser();
	}, []);

	const startEditing = () => {
		if (!user) return;
		setForm(user);
		setIsEditing(true);
	};

	const cancelEditing = () => {
		setForm(null);
		setIsEditing(false);
	};

	const saveEditing = async () => {
		if (!user || !form) return;
		setIsSaving(true);
		const updated = await updateUser({
			username: form.username,
			age: form.age,
			gender: form.gender,
			region: form.region,
			job: form.job,
			interest: form.interest,
			purpose: form.purpose,
			extra_information: form.extra_information,
		});
		setIsSaving(false);
		if (updated) {
			setUser(updated);
			setIsEditing(false);
			setForm(null);
		}
	};

	return (
		<div className={styles.page}>
			<button className={styles.backButton} onClick={() => navigate(-1)}>
				← 돌아가기
			</button>

			<h2 className={styles.title}>내 정보 보기</h2>

			<div className={styles.profileIcon}>👤</div>

			{isEditing && form ? (
				<div className={styles.infoBox}>
					<div className={styles.editRow}>
						<label className={styles.label}>나이</label>
						<input
							className={styles.editInput}
							type="number"
							value={form.age}
							onChange={(e) =>
								setForm({
									...form,
									age: Number(e.target.value),
								})
							}
						/>
					</div>

					<div className={styles.editRow}>
						<label className={styles.label}>성별</label>
						<select
							className={styles.editInput}
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

					<div className={styles.editRow}>
						<label className={styles.label}>거주지역</label>
						<select
							className={styles.editInput}
							value={form.region}
							onChange={(e) =>
								setForm({
									...form,
									region: e.target.value,
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

					<div className={styles.editRow}>
						<label className={styles.label}>직업</label>
						<select
							className={styles.editInput}
							value={form.job}
							onChange={(e) =>
								setForm({
									...form,
									job: e.target.value,
								})
							}
						>
							{JOBS.map((j) => (
								<option key={j} value={j}>
									{j}
								</option>
							))}
						</select>
					</div>

					<div className={styles.editRow}>
						<label className={styles.label}>관심분야</label>
						<select
							className={styles.editInput}
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

					<div className={styles.editRow}>
						<label className={styles.label}>관심목적</label>
						<select
							className={styles.editInput}
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

					<div className={styles.editRow}>
						<label className={styles.label}>추가 정보</label>
						<textarea
							className={styles.editTextarea}
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
			) : (
				<div className={styles.infoBox}>
					<div className={styles.infoRow}>
						<span className={styles.label}>나이</span>
						<span className={styles.value}>
							{user ? user.age : "-"}
						</span>
					</div>

					<div className={styles.infoRow}>
						<span className={styles.label}>성별</span>
						<span className={styles.value}>
							{user ? user.gender : "-"}
						</span>
					</div>

					<div className={styles.infoRow}>
						<span className={styles.label}>거주지역</span>
						<span className={styles.value}>
							{user ? user.region : "-"}
						</span>
					</div>

					<div className={styles.infoRow}>
						<span className={styles.label}>직업</span>
						<span className={styles.value}>
							{user ? user.job : "-"}
						</span>
					</div>

					<div className={styles.infoRow}>
						<span className={styles.label}>관심분야</span>
						<span className={styles.value}>
							{user ? user.interest : "-"}
						</span>
					</div>

					<div className={styles.infoRow}>
						<span className={styles.label}>관심목적</span>
						<span className={styles.value}>
							{user ? user.purpose : "-"}
						</span>
					</div>

					{user?.extra_information && (
						<div className={styles.infoRow}>
							<span className={styles.label}>추가 정보</span>
							<span className={styles.value}>
								{user.extra_information}
							</span>
						</div>
					)}
				</div>
			)}

			<div className={styles.buttonGroup}>
				{isEditing ? (
					<>
						<button
							className={styles.editButton}
							onClick={cancelEditing}
							disabled={isSaving}
						>
							취소
						</button>

						<button
							className={styles.logoutButton}
							onClick={saveEditing}
							disabled={isSaving}
						>
							{isSaving ? "저장 중..." : "저장하기"}
						</button>
					</>
				) : (
					<>
						<button
							className={styles.editButton}
							onClick={startEditing}
						>
							수정하기
						</button>

						<button
							className={styles.logoutButton}
							onClick={handleLogout}
						>
							로그아웃
						</button>
					</>
				)}
			</div>
		</div>
	);
}
