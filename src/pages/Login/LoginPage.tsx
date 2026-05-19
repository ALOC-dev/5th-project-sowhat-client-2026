import { useState } from "react";
import { useNavigate } from "react-router-dom";

type LoginPageProps = {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function LoginPage({ setIsLogin }: LoginPageProps) {
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleLogin = (): void => {
    console.log("아이디:", id);
    console.log("비밀번호:", password);

    setIsLogin(true);
    navigate("/");
  };

  return (
    <div className="login-page">
      <h2>로그인</h2>

      <input
        type="text"
        placeholder="아이디"
        value={id}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setId(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
      />

      <button onClick={handleLogin}>로그인</button>
    </div>
  );
}