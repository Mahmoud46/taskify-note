import { useContext, useState, type ReactNode } from "react";
import FolderCard from "../../components/FolderCard/FolderCard";
import styles from "./Folders.module.scss";
import SettingsContext from "../../context/settings/settings.context";
import type { IDataContext, ISettingsContext } from "../../interface/Context";
import { DataContext } from "../../context/data/data.context";

const filterCategory = [
	{ title: "All", value: "all" },
	{ title: "Recent", value: "recent" },
];

export default function Folders(): ReactNode {
	const today = new Date();
	const fourMonthsAgo = new Date(
		today.getFullYear(),
		today.getMonth() - 4,
		today.getDate()
	);
	const [isHover, setIsHover] = useState<boolean>(false);
	const [filter, setFilter] = useState<string>("all");
	const { searchInput, navigate } = useContext(
		SettingsContext
	) as ISettingsContext;
	const { folders, recentFilter } = useContext(DataContext) as IDataContext;

	return (
		<section className={styles.folders}>
			<header>
				<h1>My Folders</h1>
				<ul>
					{filterCategory.map((category, i) => (
						<li
							className={`${category.value == filter && styles.active}`}
							key={i}
							onClick={() => setFilter(category.value)}
						>
							{category.title}
						</li>
					))}
				</ul>
				<button
					className={`${styles["new-btn"]} ${isHover && styles.open}`}
					onMouseEnter={() => setIsHover(true)}
					onMouseLeave={() => setIsHover(false)}
					onClick={() => navigate("/new-folder")}
				>
					<span className="material-symbols-outlined">create_new_folder</span>
					{isHover && <p>New Folder</p>}
				</button>
			</header>
			<div className={styles["folders-cont"]}>
				{folders
					.filter(
						(folder) =>
							(searchInput == ""
								? true
								: folder.title
										.toLowerCase()
										.includes(searchInput.toLowerCase())) &&
							(filter == "all"
								? true
								: recentFilter(folder.createdAt, today, fourMonthsAgo) ||
								  (folder.updatedAt &&
										recentFilter(folder.updatedAt, today, fourMonthsAgo)))
					)
					.map((folder, i) => (
						<FolderCard folder={folder} key={i} />
					))}
			</div>
		</section>
	);
}
