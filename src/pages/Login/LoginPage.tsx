import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { login } from "../../api/auth";
import { enableMockLogin } from "../../lib/mockAuth"; // TODO: 제출 전 삭제
import styles from "./LoginPage.module.css";

type LoginPageProps = {
	setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function LoginPage({ setIsLogin }: LoginPageProps) {
	const [id, setId] = useState<string>("");
	const [password, setPassword] = useState<string>("");
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

	// TODO: 제출 전 삭제 - 백엔드 없이 로그인 이후 화면 확인용
	const handleMockLogin = (): void => {
		enableMockLogin();
		setIsLogin(true);
		navigate(redirect ?? "/");
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

					<input
						className={styles.input}
						type="password"
						placeholder="비밀번호"
						value={password}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setPassword(e.target.value)
						}
						onKeyDown={(e) => {
							if (e.key === "Enter") handleLogin();
						}}
					/>
				</div>

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

				{/* TODO: 제출 전 삭제 - 개발 중 화면 확인용 임시 버튼 */}
				<button
					className={styles.devMockButton}
					onClick={handleMockLogin}
				>
					⚙ 테스트용 임시 로그인 (개발 중에만 사용)
				</button>
			</div>
		</div>
	);
}
