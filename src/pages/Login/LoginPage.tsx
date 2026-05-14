import { useState } from "react";

export default function LoginPage() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
    console.log("아이디:", id);
    console.log("비밀번호:", password);
  };

  return (
    <div className="login-page">
      <h2>로그인</h2>

      <input
        type="text"
        placeholder="아이디"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />

      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>로그인</button>

      
    </div>
  );
}