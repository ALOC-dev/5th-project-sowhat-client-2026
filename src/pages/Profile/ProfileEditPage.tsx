import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updatePassword, updateUser } from "../../api/users";
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
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export default function ProfileEditPage({
	user,
	setUser,
}: ProfileEditPageProps) {
	const navigate = useNavigate();
	const [form, setForm] = useState<User | null>(user);
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const [newPassword, setNewPassword] = useState<string>("");
	const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>("");
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [passwordError, setPasswordError] = useState<string>("");

	useEffect(() => {
		setForm(user);
	}, [user]);

	const passwordTypeCount = [
		/[A-Za-z]/.test(newPassword),
		/[0-9]/.test(newPassword),
		/[^A-Za-z0-9]/.test(newPassword),
	].filter(Boolean).length;
	const isNewPasswordValid =
		newPassword.length === 0 ||
		(newPassword.length >= 8 && passwordTypeCount >= 2);
	const isNewPasswordConfirmValid =
		newPassword.length === 0 || newPassword === newPasswordConfirm;

	const handleSave = async () => {
		if (!user || !form) return;

		if (newPassword.length > 0) {
			if (!isNewPasswordValid) {
				setPasswordError(
					"비밀번호는 8자 이상이며 영문·숫자·특수문자 중 2가지 이상을 포함해야 해요.",
				);
				return;
			}
			if (!isNewPasswordConfirmValid) {
				setPasswordError("비밀번호가 일치하지 않아요.");
				return;
			}
		}
		setPasswordError("");
		setIsSaving(true);

		try {
			if (newPassword.length > 0) {
				await updatePassword(newPassword);
			}

			const updated = await updateUser({
				username:
					form.username == user.username ? undefined : form.username,
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

			if (updated) {
				setUser(updated);
				navigate("/profile");
			}
		} finally {
			setIsSaving(false);
		}
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
				<p className={styles.sectionLabel}>기본 정보</p>

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

				<div className={styles.grid2}>
					<div className={styles.row}>
						<label className={styles.label}>나이</label>
						<input
							className={styles.input}
							type="number"
							min="1"
							max="120"
							value={form.age}
							onChange={(e) => {
								const v = Number(e.target.value);
								if (v >= 1) setForm({ ...form, age: v });
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
				</div>

				<div className={styles.grid2}>
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
								setForm({
									...form,
									job: e.target.value as JobEnum,
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
				</div>

				<p className={styles.sectionLabel}>관심 정보</p>

				<div className={styles.grid2}>
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
				</div>

				<p className={styles.sectionLabel}>비밀번호 변경</p>

				<div className={styles.row}>
					<label className={styles.label}>새 비밀번호</label>
					<div className={styles.passwordField}>
						<input
							className={styles.input}
							type={showPassword ? "text" : "password"}
							placeholder="변경하지 않으려면 비워두세요"
							value={newPassword}
							onChange={(e) => {
								setNewPassword(e.target.value);
								setPasswordError("");
							}}
						/>
						<button
							type="button"
							className={styles.togglePassword}
							onClick={() => setShowPassword((v) => !v)}
							tabIndex={-1}
						>
							{showPassword ? "숨기기" : "보기"}
						</button>
					</div>
					{newPassword.length > 0 && !isNewPasswordValid && (
						<p className={styles.fieldError}>
							비밀번호는 8자 이상이며 영문·숫자·특수문자 중 2가지
							이상을 포함해야 해요.
						</p>
					)}
				</div>

				<div className={styles.row}>
					<label className={styles.label}>새 비밀번호 확인</label>
					<div className={styles.passwordField}>
						<input
							className={styles.input}
							type={showPassword ? "text" : "password"}
							placeholder="새 비밀번호를 다시 입력해주세요"
							value={newPasswordConfirm}
							onChange={(e) => {
								setNewPasswordConfirm(e.target.value);
								setPasswordError("");
							}}
						/>
						<button
							type="button"
							className={styles.togglePassword}
							onClick={() => setShowPassword((v) => !v)}
							tabIndex={-1}
						>
							{showPassword ? "숨기기" : "보기"}
						</button>
					</div>
					{newPasswordConfirm.length > 0 &&
						!isNewPasswordConfirmValid && (
							<p className={styles.fieldError}>
								비밀번호가 일치하지 않아요.
							</p>
						)}
					{passwordError && (
						<p className={styles.fieldError}>{passwordError}</p>
					)}
				</div>

				<p className={styles.sectionLabel}>기타</p>

				<div className={styles.row}>
					<label className={styles.label}>추가 정보</label>
					<textarea
						className={styles.textarea}
						value={form.extra_information}
						placeholder={
							"보유 주식, 이사 계획 등 자유롭게 입력해주세요.\n" +
							"(전화번호, 주민등록번호, 계좌번호, 상세 주소 등 개인을 직접 식별할 수 있는 정보나 민감한 개인정보는 입력하지 마세요.\n" +
							"또한 폭력·범죄 등 위험한 내용이나 서비스의 정상적인 작동을 방해하거나 AI 시스템을 조작하려는 내용이 포함된 입력은 제한될 수 있습니다.)"
						}
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
