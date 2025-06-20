import { useContext, useState, type ReactNode } from "react";
import styles from "./Navbar.module.scss";
import SettingsContext from "../../context/settings/settings.context";
import type { ISettingsContext } from "../../interface/Context";
import userIcon from "../../assets/user_icon.jpg";

export default function Navbar(): ReactNode {
	const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
	const { isMenuOpen, setIsMenuOpen, searchInput, setSearchInput } = useContext(
		SettingsContext
	) as ISettingsContext;

	return (
		<nav>
			{isSearchOpen && (
				<input
					type="text"
					className={styles["float-input"]}
					placeholder="Search ..."
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
				/>
			)}
			<div className={styles.left}>
				<button onClick={() => setIsMenuOpen((prev) => !prev)}>
					<span className="material-symbols-outlined">
						{isMenuOpen ? "close" : "menu"}
					</span>
				</button>
				<h1>Taskify</h1>
			</div>
			<div className={styles.right}>
				<div className={styles.search}>
					<span
						className="material-symbols-outlined"
						onClick={() => setIsSearchOpen((prev) => !prev)}
					>
						search
					</span>
					<input
						type="text"
						placeholder="Search ..."
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
					/>
				</div>
				<div className={styles["user-icon"]}>
					<img src={userIcon} alt="" />
				</div>
			</div>
		</nav>
	);
}
