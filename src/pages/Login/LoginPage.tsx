import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { login } from "../../api/auth";
import styles from "./LoginPage.module.css";

type LoginPageProps = {
	setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function LoginPage({ setIsLogin }: LoginPageProps) {
	const [id, setId] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	// 로그인한 뒤 리디렉션할 주소
	const [searchParams] = useSearchParams("redirect");
	const redirect = searchParams.get("redirect");
	const navigate = useNavigate();

	const handleLogin = async (): Promise<void> => {
		console.log("아이디:", id);
		console.log("비밀번호:", password);

		const success = await login({ login_id: id, password: password });
		if (!success) return;

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
					/>

					<input
						className={styles.input}
						type="password"
						placeholder="비밀번호"
						value={password}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setPassword(e.target.value)
						}
					/>
				</div>

				<button className={styles.submit} onClick={handleLogin}>
					로그인
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
