import { useContext, useState, type ReactNode } from "react";
import styles from "./Sidebar.module.scss";
import SettingsContext from "../../context/settings/settings.context";
import type { ISettingsContext } from "../../interface/Context";
import { useLocation } from "react-router-dom";

const sideBarElements = [
	{
		icon: "home",
		name: "Home",
		path: "/",
	},
	{
		icon: "dashboard",
		name: "Dashboard",
		path: "/dashboard",
	},
	{
		icon: "event_upcoming",
		name: "Upcoming",
		path: "/upcoming",
	},
	{
		icon: "task",
		name: "Completed",
		path: "/completed",
	},
	{
		icon: "archive",
		name: "Archive",
		path: "/archive",
	},
];

export default function Sidebar(): ReactNode {
	const [isAddNew, setIsAddNew] = useState<boolean>(false);
	const { isMenuOpen, navigate } = useContext(
		SettingsContext
	) as ISettingsContext;
	const location = useLocation();

	return (
		<div className={styles.sidebar}>
			<div className={styles.new}>
				<button
					className={`${styles["add-btn"]} ${
						isAddNew ? styles["stop-rotate"] : ""
					}`}
					onClick={() => setIsAddNew((prev) => !prev)}
				>
					<span className="material-symbols-outlined">
						{isAddNew ? "keyboard_arrow_up" : "add"}
					</span>
					{isMenuOpen && isAddNew && <p>Close</p>}
					{isMenuOpen && !isAddNew && <p>Add New</p>}
				</button>
				{isAddNew && (
					<div
						className={`${styles["new-items"]} ${
							isMenuOpen ? styles.open : ""
						}`}
					>
						<button onClick={() => navigate("/new-folder")}>
							<span className="material-symbols-outlined">
								create_new_folder
							</span>
							{isMenuOpen && <p>New Folder</p>}
						</button>
						<button onClick={() => navigate("/new-note")}>
							<span className="material-symbols-outlined">note_add</span>
							{isMenuOpen && <p>New Note</p>}
						</button>
					</div>
				)}
			</div>

			<div className={styles.more}>
				{sideBarElements.map((element, i) => (
					<button
						key={i}
						className={`${location.pathname == element.path && styles.active}`}
						onClick={() => navigate(element.path)}
					>
						<span className="material-symbols-outlined">{element.icon}</span>
						{isMenuOpen && <p>{element.name}</p>}
					</button>
				))}
			</div>
		</div>
	);
}
