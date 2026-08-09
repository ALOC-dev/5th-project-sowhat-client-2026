import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { login } from "../../api/auth";
import { getUser } from "../../api/users";
import { User } from "../../types";
import styles from "./LoginPage.module.css";

const REMEMBER_ID_KEY = "sowhat_remember_login_id";

type LoginPageProps = {
	setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export default function LoginPage({ setIsLogin, setUser }: LoginPageProps) {
	const [id, setId] = useState<string>(() => {
		try {
			return localStorage.getItem(REMEMBER_ID_KEY) ?? "";
		} catch {
			return "";
		}
	});
	const [rememberId, setRememberId] = useState<boolean>(() => {
		try {
			return localStorage.getItem(REMEMBER_ID_KEY) !== null;
		} catch {
			return false;
		}
	});
	const [password, setPassword] = useState<string>("");
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	// 로그인한 뒤 리디렉션할 주소
	const [searchParams] = useSearchParams("redirect");
	const redirect = searchParams.get("redirect");
	const navigate = useNavigate();

	const handleLogin = async (): Promise<void> => {
		if (!id.trim() || !password.trim()) {
			setError("아이디와 비밀번호를 입력해주세요.");
			return;
		}

		setError("");
		setIsSubmitting(true);

		try {
			const success = await login({ login_id: id, password: password });
			if (!success) {
				setError("아이디 또는 비밀번호가 올바르지 않아요.");
				return;
			}

			try {
				if (rememberId) {
					localStorage.setItem(REMEMBER_ID_KEY, id);
				} else {
					localStorage.removeItem(REMEMBER_ID_KEY);
				}
			} catch {
				// localStorage 사용 불가 환경이면 그냥 무시
			}

			const fetched = await getUser();
			setUser(fetched ?? null);
			setIsLogin(true);
			navigate(redirect ?? "/");
		} catch (e) {
			setError(
				"로그인 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className={styles.page}>
			<div className={styles.card}>
				<p className={styles.eyebrow}>Welcome back</p>
				<h2 className={styles.logo}>So What?</h2>
				<p className={styles.subtitle}>
					로그인하고 나만의 뉴스 분석을 받아보세요
				</p>

				<div className={styles.fields}>
					<input
						className={styles.input}
						type="text"
						placeholder="아이디"
						value={id}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setId(e.target.value)
						}
						onKeyDown={(e) => {
							if (e.key === "Enter") handleLogin();
						}}
					/>

					<div className={styles.passwordField}>
						<input
							className={styles.input}
							type={showPassword ? "text" : "password"}
							placeholder="비밀번호"
							value={password}
							onChange={(
								e: React.ChangeEvent<HTMLInputElement>,
							) => setPassword(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") handleLogin();
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
				</div>

				<label className={styles.rememberRow}>
					<input
						type="checkbox"
						checked={rememberId}
						onChange={(e) => setRememberId(e.target.checked)}
					/>
					아이디 저장
				</label>

				{error && <p className={styles.error}>{error}</p>}

				<button
					className={styles.submit}
					onClick={handleLogin}
					disabled={isSubmitting}
				>
					{isSubmitting ? "로그인 중..." : "로그인"}
				</button>

				<p className={styles.footer}>
					계정이 없으신가요?{" "}
					<button
						className={styles.link}
						onClick={() => navigate("/signup")}
					>
						회원가입
					</button>
				</p>
			</div>
		</div>
	);
}
