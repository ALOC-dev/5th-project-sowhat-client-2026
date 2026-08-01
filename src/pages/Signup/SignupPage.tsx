import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../api/users";
import {
	CategoryEnum,
	GenderEnum,
	JobEnum,
	PurposeEnum,
	RegionEnum,
} from "../../types";
import styles from "./SignupPage.module.css";

type SignupPageProps = {
	setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

const GENDERS = Object.values(GenderEnum);
const REGIONS = Object.values(RegionEnum);
const JOBS = Object.values(JobEnum);
const CATEGORIES = Object.values(CategoryEnum);
const PURPOSES = Object.values(PurposeEnum);

export default function SignupPage({ setIsLogin }: SignupPageProps) {
	const navigate = useNavigate();
	const [step, setStep] = useState<1 | 2>(1);
	const [error, setError] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	// Step 1: 계정 정보
	const [loginId, setLoginId] = useState<string>("");
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [passwordConfirm, setPasswordConfirm] = useState<string>("");

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

	const canGoNext =
		loginId.trim().length > 0 &&
		username.trim().length > 0 &&
		password.length >= 4 &&
		password === passwordConfirm;

	const handleNext = () => {
		if (!loginId.trim() || !username.trim()) {
			setError("아이디와 이름을 입력해주세요.");
			return;
		}
		if (password.length < 4) {
			setError("비밀번호는 4자 이상 입력해주세요.");
			return;
		}
		if (password !== passwordConfirm) {
			setError("비밀번호가 서로 달라요.");
			return;
		}
		setError("");
		setStep(2);
	};

	const canSubmit =
		age.trim().length > 0 && Number(age) >= 0 && !isSubmitting;

	const handleSubmit = async () => {
		if (!canSubmit) return;
		setIsSubmitting(true);
		setError("");

		const created = await createUser({
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

		setIsSubmitting(false);

		if (created) {
			setIsLogin(true);
			navigate("/");
		} else {
			setError("가입에 실패했어요. 아이디가 이미 사용 중일 수 있어요.");
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
						<input
							className={styles.input}
							type="text"
							placeholder="이름 (닉네임)"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
						<input
							className={styles.input}
							type="password"
							placeholder="비밀번호"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<input
							className={styles.input}
							type="password"
							placeholder="비밀번호 확인"
							value={passwordConfirm}
							onChange={(e) =>
								setPasswordConfirm(e.target.value)
							}
						/>

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
						<input
							className={styles.input}
							type="number"
							min="0"
							max="120"
							placeholder="나이"
							value={age}
							onChange={(e) => {
								const v = e.target.value;
								if (v === "" || Number(v) >= 0) setAge(v);
							}}
						/>

						<select
							className={styles.input}
							value={gender}
							onChange={(e) =>
								setGender(e.target.value as GenderEnum)
							}
						>
							{GENDERS.map((g) => (
								<option key={g} value={g}>
									{g}
								</option>
							))}
						</select>

						<select
							className={styles.input}
							value={region}
							onChange={(e) =>
								setRegion(e.target.value as RegionEnum)
							}
						>
							{REGIONS.map((r) => (
								<option key={r} value={r}>
									{r}
								</option>
							))}
						</select>

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

						<select
							className={styles.input}
							value={interest}
							onChange={(e) =>
								setInterest(e.target.value as CategoryEnum)
							}
						>
							{CATEGORIES.map((c) => (
								<option key={c} value={c}>
									{c}
								</option>
							))}
						</select>

						<select
							className={styles.input}
							value={purpose}
							onChange={(e) =>
								setPurpose(e.target.value as PurposeEnum)
							}
						>
							{PURPOSES.map((p) => (
								<option key={p} value={p}>
									{p}
								</option>
							))}
						</select>

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
