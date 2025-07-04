import type { ReactNode } from "react";
import styles from "./NotFound.module.scss";
export default function NotFound(): ReactNode {
	return (
		<section className={styles["not-found"]}>
			<span className="material-symbols-outlined">warning</span>
			<p>404 | Page Not Found</p>
		</section>
	);
}
