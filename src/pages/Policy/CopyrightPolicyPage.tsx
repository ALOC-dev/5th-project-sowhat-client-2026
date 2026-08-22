import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import styles from "./PolicyPage.module.css";

const CONTENT = `
본 서비스는 뉴스 및 공공정보를 보다 쉽게 이해할 수 있도록 돕기 위한 비상업적 학생 프로젝트입니다.

### 기사 콘텐츠의 이용

본 서비스는 외부 언론사 및 웹사이트의 기사를 수집하여 서비스 목적에 맞게 일부 가공하여 제공합니다.

기사의 원문 전체를 제공하지 않으며, 서비스에서 제공되는 기사 관련 콘텐츠는 이용자의 이해를 돕기 위한 요약 및 해설을 목적으로 합니다.

기사의 원문 및 상세한 내용은 각 기사에 표시된 원출처 링크를 통해 확인할 수 있습니다.

### 콘텐츠의 범위

서비스에서 제공하는 기사 관련 콘텐츠는 원문의 전체 내용을 대체하지 않으며, 원문의 일부 내용만을 서비스 목적에 맞게 가공하여 제공합니다.

기사 제목, 출처 및 원문 링크 등 출처 정보를 함께 제공하여 이용자가 원문을 확인할 수 있도록 하고 있습니다.

### 비상업적 운영

본 서비스는 학생 프로젝트의 목적으로 운영되며, 현재 별도의 광고나 유료 서비스를 통한 수익을 창출하지 않습니다.

### 검색엔진 및 외부 공유

서비스에서 제공하는 기사 관련 콘텐츠가 검색엔진을 통해 무분별하게 확산되지 않도록 검색엔진의 색인을 제한하고 있습니다.

서비스 내에서 제공되는 콘텐츠의 외부 공유가 필요한 경우에도 원문 자체를 재배포하기보다는 해당 기사 및 원출처를 확인할 수 있는 링크를 이용해 주시기 바랍니다.

### 저작권 관련 요청

본 서비스에 게시된 콘텐츠와 관련하여 저작권 또는 기타 권리 침해가 우려되는 경우 아래의 이메일을 통해 문의해 주시기 바랍니다.

문의: sowhat.aloc@gmail.com

권리자의 요청이 접수되는 경우 해당 콘텐츠의 이용 경위와 내용을 확인하고 필요한 조치를 검토하겠습니다.
`;

export default function CopyrightPolicyPage() {
	const navigate = useNavigate();

	return (
		<div className={styles.page}>
			<div className={styles.backButtonRow}>
				<button
					className={styles.backButton}
					onClick={() => navigate("/")}
				>
					← 돌아가기
				</button>
			</div>

			<div className={styles.card}>
				<h1 className={styles.title}>저작권 및 콘텐츠 이용정책</h1>
				<div className={styles.content}>
					<ReactMarkdown>{CONTENT}</ReactMarkdown>
				</div>
			</div>
		</div>
	);
}
