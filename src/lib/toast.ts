export type Toast = {
	id: number;
	message: string;
};

type Listener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
let nextId = 0;
const listeners = new Set<Listener>();

function emit() {
	listeners.forEach((listener) => listener(toasts));
}

export function subscribeToasts(listener: Listener): () => void {
	listeners.add(listener);
	listener(toasts);
	return () => listeners.delete(listener);
}

export function dismissToast(id: number): void {
	toasts = toasts.filter((t) => t.id !== id);
	emit();
}

export function notifyError(message: string): void {
	const id = nextId++;
	toasts = [...toasts, { id, message }];
	emit();
}
