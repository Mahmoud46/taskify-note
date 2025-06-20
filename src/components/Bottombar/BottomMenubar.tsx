import { useContext, useState, type ReactNode } from "react";
import styles from "./BottomMenubar.module.scss";
import { useLocation } from "react-router-dom";
import SettingsContext from "../../context/settings/settings.context";
import type { ISettingsContext } from "../../interface/Context";

const bottomBarElements = [
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

export default function BottomMenubar(): ReactNode {
	const location = useLocation();
	const { navigate } = useContext(SettingsContext) as ISettingsContext;
	const [isShowOptions, setIsShowOptions] = useState<boolean>(false);
	return (
		<div className={styles["bottom-bar-menu"]}>
			{isShowOptions && (
				<div className={styles.options}>
					<button
						onClick={() => {
							setIsShowOptions(false);
							navigate("/new-folder");
							window.scrollTo(0, 0);
						}}
					>
						<span className="material-symbols-outlined">create_new_folder</span>
						<p>New Folder</p>
					</button>
					<button
						onClick={() => {
							setIsShowOptions(false);
							navigate("/new-note");
							window.scrollTo(0, 0);
						}}
					>
						<span className="material-symbols-outlined">note_add</span>
						<p>New Note</p>
					</button>
				</div>
			)}
			<button
				className={styles.new}
				onClick={() => setIsShowOptions((prev) => !prev)}
			>
				{!isShowOptions && (
					<span className="material-symbols-outlined">add</span>
				)}
				{isShowOptions && (
					<span className="material-symbols-outlined">close</span>
				)}
			</button>
			{bottomBarElements.map((element, i) => (
				<button
					key={i}
					className={`${location.pathname == element.path && styles.active}`}
					onClick={() => navigate(element.path)}
				>
					<span className="material-symbols-outlined">{element.icon}</span>
				</button>
			))}
		</div>
	);
}
