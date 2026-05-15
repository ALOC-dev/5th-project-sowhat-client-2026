const API_BASE = "http://localhost:8000";

export async function api<T>(
	path: string,
	init?: RequestInit,
): Promise<T | void> {
	const res = await fetch(`${API_BASE}${path}`, {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...(init?.headers ?? {}),
		},
		...init,
	});

	// HTTP 자체 실패 (code가 400~500번대)
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(`${res.status} ${res.statusText} ${text}`.trim());
	}

	// Body 없는 ok 응답
	const ct = res.headers.get("content-type") ?? "";
	if (!ct.includes("application/json")) {
		return undefined;
	}

	const json = (await res.json()) as T;
	return json;
}
