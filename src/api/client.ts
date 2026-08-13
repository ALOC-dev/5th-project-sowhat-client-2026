import { notifyError } from "../lib/toast";

const API_BASE = "http://localhost:8000";

export class ApiError extends Error {
	status: number;

	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

// 이 경로들은 401이 나도 refresh를 시도하지 않는다 (무한루프/불필요한 호출 방지)
const NO_REFRESH_PATHS = [
	"/api/auth/login",
	"/api/auth/signup",
	"/api/auth/refresh",
];

function isNoRefreshPath(path: string): boolean {
	return NO_REFRESH_PATHS.includes(path);
}

// 여러 요청이 동시에 401을 받아도 refresh는 한 번만 실행되도록 공유
let refreshPromise: Promise<boolean> | null = null;

function refreshSession(): Promise<boolean> {
	if (!refreshPromise) {
		refreshPromise = fetch(`${API_BASE}/api/auth/refresh`, {
			method: "POST",
			credentials: "include",
		})
			.then((res) => res.ok)
			.catch(() => false)
			.finally(() => {
				refreshPromise = null;
			});
	}
	return refreshPromise;
}

async function extractErrorMessage(res: Response): Promise<string> {
	const text = await res.text().catch(() => "");
	try {
		const json = JSON.parse(text);
		if (typeof json?.message === "string") return json.message;
	} catch {
		// JSON이 아니면 그냥 무시
	}
	return text || res.statusText;
}

function doFetch(path: string, init?: RequestInit): Promise<Response> {
	return fetch(`${API_BASE}${path}`, {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...(init?.headers ?? {}),
		},
		...init,
	});
}

export type ApiOptions = {
	// true면 실패해도 alert을 띄우지 않는다 (로그인 여부 확인처럼 실패가 정상 상황인 요청용)
	silent?: boolean;
};

export async function api<T>(
	path: string,
	init?: RequestInit,
	opts?: ApiOptions,
): Promise<T | void> {
	let res = await doFetch(path, init);

	// access token이 만료된 것뿐일 수 있으니, refresh token으로 한 번 갱신 후 재시도
	if (res.status === 401 && !isNoRefreshPath(path)) {
		const refreshed = await refreshSession();
		if (refreshed) {
			res = await doFetch(path, init);
		}
	}

	// HTTP 자체 실패 (code가 400~500번대)
	if (!res.ok) {
		const message = await extractErrorMessage(res);
		if (!opts?.silent) notifyError(message);
		throw new ApiError(res.status, message);
	}

	// Body 없는 ok 응답
	const ct = res.headers.get("content-type") ?? "";
	if (!ct.includes("application/json")) {
		return undefined;
	}

	const json = (await res.json()) as T;
	return json;
}

export type SSEEventHandler = (event: string, data: string) => void;

function parseSSEBlock(block: string, onEvent: SSEEventHandler) {
	let event = "message";
	const dataLines: string[] = [];

	for (const line of block.split("\n")) {
		if (line.startsWith("event:")) {
			event = line.slice(6).trim();
		} else if (line.startsWith("data:")) {
			dataLines.push(line.slice(5).trim());
		}
	}

	if (dataLines.length === 0) return;
	onEvent(event, dataLines.join("\n"));
}

// text/event-stream 응답을 순서대로 읽어 이벤트가 도착할 때마다 onEvent를 호출한다
export async function apiStream(
	path: string,
	onEvent: SSEEventHandler,
	signal?: AbortSignal,
): Promise<void> {
	const streamHeaders = { Accept: "text/event-stream" };
	let res = await doFetch(path, { headers: streamHeaders, signal });

	if (res.status === 401 && !isNoRefreshPath(path)) {
		const refreshed = await refreshSession();
		if (refreshed) {
			res = await doFetch(path, { headers: streamHeaders, signal });
		}
	}

	if (!res.ok || !res.body) {
		const message = await extractErrorMessage(res);
		notifyError(message);
		throw new ApiError(res.status, message);
	}

	const reader = res.body.getReader();
	const decoder = new TextDecoder();
	let buffer = "";

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		buffer += decoder.decode(value, { stream: true });

		let sepIndex: number;
		while ((sepIndex = buffer.indexOf("\n\n")) !== -1) {
			const rawEvent = buffer.slice(0, sepIndex);
			buffer = buffer.slice(sepIndex + 2);
			parseSSEBlock(rawEvent, onEvent);
		}
	}
}
