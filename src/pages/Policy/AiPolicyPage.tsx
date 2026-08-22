import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import styles from "./PolicyPage.module.css";

const CONTENT = `
### AI가 생성하는 콘텐츠

서비스는 AI를 활용하여 다음과 같은 콘텐츠를 제공합니다.

- 뉴스 기사의 핵심 내용 요약
- 기사에 등장하는 어려운 용어에 대한 설명
- 뉴스가 이용자에게 미칠 수 있는 영향 및 대응 방법에 대한 해설
- 관련 기사 및 참고 자료 추천

AI가 생성한 내용은 원문을 단순히 복사하여 제공하는 것이 아니라, 서비스의 목적에 맞게 가공하여 제공됩니다.

### AI 콘텐츠의 한계

AI가 생성한 콘텐츠에는 다음과 같은 오류가 포함될 수 있습니다.

- 원문의 내용과 다른 정보가 포함될 수 있습니다.
- 중요한 내용이 누락되거나 일부 내용이 부정확하게 해석될 수 있습니다.
- 최신 정보가 충분히 반영되지 않을 수 있습니다.

따라서 본 서비스에서 제공하는 AI 생성 콘텐츠를 법률, 의료, 투자 및 기타 중요한 의사결정의 유일한 근거로 사용하지 마시고, 필요한 경우 원문 및 공식 자료를 함께 확인하시기 바랍니다.

### 원문 확인

뉴스의 구체적인 내용과 정확한 사실관계는 각 기사의 원문 및 원출처를 확인하시기 바랍니다.

본 서비스는 이용자가 기사 내용을 보다 쉽게 이해할 수 있도록 돕는 것을 목적으로 하며, 언론사의 공식 기사 또는 의견을 대신하지 않습니다.
`;

export default function AiPolicyPage() {
	const navigate = useNavigate();

	return (
		<div className={styles.page}>
			<button className={styles.backButton} onClick={() => navigate("/")}>
				← 돌아가기
			</button>

			<div className={styles.card}>
				<h1 className={styles.title}>AI 콘텐츠 안내</h1>
				<div className={styles.content}>
					<ReactMarkdown>{CONTENT}</ReactMarkdown>
				</div>
			</div>
		</div>
	);
}
