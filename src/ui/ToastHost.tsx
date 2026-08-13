import { useEffect, useState } from "react";
import { dismissToast, subscribeToasts, Toast } from "../lib/toast";
import styles from "./ToastHost.module.css";

const AUTO_DISMISS_MS = 3000;

export default function ToastHost() {
	const [toasts, setToasts] = useState<Toast[]>([]);

	useEffect(() => subscribeToasts(setToasts), []);

	useEffect(() => {
		const timers = toasts.map((toast) =>
			setTimeout(() => dismissToast(toast.id), AUTO_DISMISS_MS),
		);
		return () => timers.forEach(clearTimeout);
	}, [toasts]);

	if (toasts.length === 0) return null;

	return (
		<div className={styles.container}>
			{toasts.map((toast) => (
				<div key={toast.id} className={styles.toast}>
					{toast.message}
				</div>
			))}
		</div>
	);
}
