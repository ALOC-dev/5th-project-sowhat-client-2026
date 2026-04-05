import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
	// <StrictMode>
	<App />,
	// </StrictMode>,
	/* Strictmode 넣으면 페이지가 두번 로드되어 불편함! */
);
