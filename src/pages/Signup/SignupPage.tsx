import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../../api/auth";
import { ApiError } from "../../api/client";
import { getUser } from "../../api/users";
import {
	CategoryEnum,
	GenderEnum,
	JobEnum,
	PurposeEnum,
	RegionEnum,
	User,
} from "../../types";
import styles from "./SignupPage.module.css";

type SignupPageProps = {
	setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const GENDERS = Object.values(GenderEnum);
const REGIONS = Object.values(RegionEnum);
const JOBS = Object.values(JobEnum);
const CATEGORIES = Object.values(CategoryEnum);
const PURPOSES = Object.values(PurposeEnum);

export default function SignupPage({ setIsLogin, setUser }: SignupPageProps) {
	const navigate = useNavigate();
	const [step, setStep] = useState<1 | 2>(1);
	const [error, setError] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	// Step 1: 계정 정보
	const [loginId, setLoginId] = useState<string>("");
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [passwordConfirm, setPasswordConfirm] = useState<string>("");
	const [showPassword, setShowPassword] = useState<boolean>(false);

	// Step 2: 개인 정보
	const [age, setAge] = useState<string>("");
	const [gender, setGender] = useState<GenderEnum>(GenderEnum.MALE);
	const [region, setRegion] = useState<RegionEnum>(RegionEnum.SEOUL);
	const [job, setJob] = useState<JobEnum>(JobEnum.STUDENT);
	const [interest, setInterest] = useState<CategoryEnum>(
		CategoryEnum.POLITICS,
	);
	const [purpose, setPurpose] = useState<PurposeEnum>(PurposeEnum.GENERAL);
	const [extraInformation, setExtraInformation] = useState<string>("");

	const isIdValid = loginId.trim().length >= 4;
	const passwordTypeCount = [
		/[A-Za-z]/.test(password),
		/[0-9]/.test(password),
		/[^A-Za-z0-9]/.test(password),
	].filter(Boolean).length;
	const isPasswordValid = password.length >= 8 && passwordTypeCount >= 2;
	const isPasswordConfirmValid =
		passwordConfirm.length > 0 && password === passwordConfirm;

	const canGoNext =
		isIdValid &&
		username.trim().length > 0 &&
		isPasswordValid &&
		isPasswordConfirmValid;

	const handleNext = () => {
		setError("");
		setStep(2);
	};

	const canSubmit =
		age.trim().length > 0 && Number(age) >= 0 && !isSubmitting;

	const handleSubmit = async () => {
		if (!canSubmit) return;
		setIsSubmitting(true);
		setError("");

		try {
			await signup({
				login_id: loginId,
				password,
				username,
				age: Number(age),
				gender,
				region,
				job,
				interest,
				purpose,
				extra_information: extraInformation,
			});

			const success = await login({ login_id: loginId, password });
			if (!success) {
				setError(
					"가입은 완료됐지만 로그인에 실패했어요. 로그인 화면에서 다시 시도해주세요.",
				);
				return;
			}

			const fetched = await getUser();
			setUser(fetched ?? null);
			setIsLogin(true);
			navigate("/");
		} catch (e) {
			if (e instanceof ApiError && e.status === 409) {
				setError("이미 사용 중인 아이디예요.");
			} else {
				setError("가입에 실패했어요. 잠시 후 다시 시도해주세요.");
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className={styles.page}>
			<div className={styles.card}>
				<p className={styles.eyebrow}>Join us</p>
				<h2 className={styles.logo}>So What?</h2>
				<p className={styles.subtitle}>
					{step === 1
						? "아이디와 비밀번호를 정해주세요"
						: "마지막으로 몇 가지만 알려주세요"}
				</p>

				<div className={styles.stepIndicator}>
					<span data-active={step === 1}>1. 계정 정보</span>
					<span className={styles.stepArrow}>→</span>
					<span data-active={step === 2}>2. 개인 정보</span>
				</div>

				{step === 1 ? (
					<div className={styles.fields}>
						<input
							className={styles.input}
							type="text"
							placeholder="아이디"
							value={loginId}
							onChange={(e) => setLoginId(e.target.value)}
						/>
						{loginId.length > 0 && !isIdValid && (
							<p className={styles.fieldError}>
								아이디는 4자 이상 입력해주세요.
							</p>
						)}
						<input
							className={styles.input}
							type="text"
							placeholder="이름 (닉네임)"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
						<div className={styles.passwordField}>
							<input
								className={styles.input}
								type={showPassword ? "text" : "password"}
								placeholder="비밀번호"
								value={password}
								onChange={(e) =>
									setPassword(e.target.value)
								}
							/>
							<button
								type="button"
								className={styles.togglePassword}
								onClick={() =>
									setShowPassword((v) => !v)
								}
								tabIndex={-1}
							>
								{showPassword ? "숨기기" : "보기"}
							</button>
						</div>
						{password.length > 0 && !isPasswordValid && (
							<p className={styles.fieldError}>
								비밀번호는 8자 이상이며 영문·숫자·특수문자
								중 2가지 이상을 포함해야 해요.
							</p>
						)}
						<div className={styles.passwordField}>
							<input
								className={styles.input}
								type={showPassword ? "text" : "password"}
								placeholder="비밀번호 확인"
								value={passwordConfirm}
								onChange={(e) =>
									setPasswordConfirm(e.target.value)
								}
							/>
							<button
								type="button"
								className={styles.togglePassword}
								onClick={() =>
									setShowPassword((v) => !v)
								}
								tabIndex={-1}
							>
								{showPassword ? "숨기기" : "보기"}
							</button>
						</div>
						{passwordConfirm.length > 0 &&
							password !== passwordConfirm && (
								<p className={styles.fieldError}>
									비밀번호가 일치하지 않아요.
								</p>
							)}

						{error && <p className={styles.error}>{error}</p>}

						<button
							className={styles.submit}
							disabled={!canGoNext}
							onClick={handleNext}
						>
							다음
						</button>
					</div>
				) : (
					<div className={styles.fields}>
						<div className={styles.fieldGroup}>
							<label className={styles.fieldLabel}>나이</label>
							<input
								className={styles.input}
								type="number"
								min="0"
								max="120"
								placeholder="나이"
								value={age}
								onChange={(e) => {
									const v = e.target.value;
									if (v === "" || Number(v) >= 0)
										setAge(v);
								}}
							/>
						</div>

						<div className={styles.grid2}>
							<div className={styles.fieldGroup}>
								<label className={styles.fieldLabel}>
									성별
								</label>
								<select
									className={styles.input}
									value={gender}
									onChange={(e) =>
										setGender(
											e.target.value as GenderEnum,
										)
									}
								>
									{GENDERS.map((g) => (
										<option key={g} value={g}>
											{g}
										</option>
									))}
								</select>
							</div>

							<div className={styles.fieldGroup}>
								<label className={styles.fieldLabel}>
									거주지역
								</label>
								<select
									className={styles.input}
									value={region}
									onChange={(e) =>
										setRegion(
											e.target.value as RegionEnum,
										)
									}
								>
									{REGIONS.map((r) => (
										<option key={r} value={r}>
											{r}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className={styles.grid2}>
							<div className={styles.fieldGroup}>
								<label className={styles.fieldLabel}>
									직업
								</label>
								<select
									className={styles.input}
									value={job}
									onChange={(e) =>
										setJob(e.target.value as JobEnum)
									}
								>
									{JOBS.map((j) => (
										<option key={j} value={j}>
											{j}
										</option>
									))}
								</select>
							</div>

							<div className={styles.fieldGroup}>
								<label className={styles.fieldLabel}>
									관심분야
								</label>
								<select
									className={styles.input}
									value={interest}
									onChange={(e) =>
										setInterest(
											e.target.value as CategoryEnum,
										)
									}
								>
									{CATEGORIES.map((c) => (
										<option key={c} value={c}>
											{c}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className={styles.fieldGroup}>
							<label className={styles.fieldLabel}>
								관심목적
							</label>
							<select
								className={styles.input}
								value={purpose}
								onChange={(e) =>
									setPurpose(
										e.target.value as PurposeEnum,
									)
								}
							>
								{PURPOSES.map((p) => (
									<option key={p} value={p}>
										{p}
									</option>
								))}
							</select>
						</div>

						<textarea
							className={styles.textarea}
							placeholder="보유 주식, 이사·여행 계획, 대출 현황 등 자유롭게 알려주세요 (선택)"
							value={extraInformation}
							onChange={(e) =>
								setExtraInformation(e.target.value)
							}
						/>

						{error && <p className={styles.error}>{error}</p>}

						<div className={styles.buttonRow}>
							<button
								className={styles.backStepButton}
								onClick={() => setStep(1)}
								disabled={isSubmitting}
							>
								이전
							</button>
							<button
								className={styles.submit}
								disabled={!canSubmit}
								onClick={handleSubmit}
							>
								{isSubmitting
									? "가입 중..."
									: "가입하고 시작하기"}
							</button>
						</div>
					</div>
				)}

				<p className={styles.footer}>
					이미 계정이 있으신가요?{" "}
					<button
						className={styles.link}
						onClick={() => navigate("/login")}
					>
						로그인
					</button>
				</p>
			</div>
		</div>
	);
}
