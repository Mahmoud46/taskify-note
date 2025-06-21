import { useContext, useEffect, useState, type ReactNode } from "react";
import styles from "./Home.module.scss";
import FolderCard from "../../components/FolderCard/FolderCard";
import SettingsContext from "../../context/settings/settings.context";
import type { IDataContext, ISettingsContext } from "../../interface/Context";
import NoteCard from "../../components/NoteCard/NoteCard";
import { DataContext } from "../../context/data/data.context";
import type { IFolder } from "../../interface/Data";
const filterCategory = [
	{ title: "All", value: "all" },
	{ title: "Recent", value: "recent" },
];

function RecentFolders(): ReactNode {
	const today = new Date();
	const fourMonthsAgo = new Date(
		today.getFullYear(),
		today.getMonth() - 4,
		today.getDate()
	);
	const { navigate, searchInput } = useContext(
		SettingsContext
	) as ISettingsContext;
	const { folders, recentFilter } = useContext(DataContext) as IDataContext;
	const [filter, setFilter] = useState<string>("all");
	const [filterdFolders, setFilterdFolders] = useState<IFolder[]>([]);

	useEffect(() => {
		setFilterdFolders(
			folders.filter(
				(folder) =>
					(searchInput == ""
						? true
						: folder.title.toLowerCase().includes(searchInput.toLowerCase())) &&
					(filter == "all"
						? true
						: recentFilter(folder.createdAt, today, fourMonthsAgo) ||
						  (folder.updatedAt &&
								recentFilter(folder.updatedAt, today, fourMonthsAgo)))
			)
		);
	}, [folders, filter, searchInput]);
	return (
		<>
			<h1>My Folders</h1>
			<ul>
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
			</ul>

			<div className={styles["list-cont"]}>
				<div className={styles["list-cont-sm"]}>
					<div
						className={`${styles.list} ${
							folders.length > 2 ? styles.hidden : styles.auto
						}`}
					>
						{filterdFolders.slice(0, 3).map((folder, i) => (
							<div style={{ width: "300px" }} key={i}>
								<FolderCard folder={folder} />
							</div>
						))}
					</div>
					{filterdFolders.length > 2 && (
						<div className={styles["more-btn"]}>
							<button
								onClick={() => {
									navigate("/folders");
									window.scrollTo(0, 0);
								}}
							>
								<span className="material-symbols-outlined">
									keyboard_arrow_right
								</span>
							</button>
						</div>
					)}
				</div>
				<button
					className={styles["new-btn"]}
					onClick={() => navigate("/new-folder")}
				>
					<span className="material-symbols-outlined">create_new_folder</span>
					<p>New Folder</p>
				</button>
			</div>
		</>
	);
}

function RecentNotes(): ReactNode {
	const { navigate } = useContext(SettingsContext) as ISettingsContext;
	const { notes, archivedDate } = useContext(DataContext) as IDataContext;

	return (
		<>
			<h1>Recent Notes</h1>

			{/* <ul>
				<li className={styles.active}>Today</li>
				<li>This Week</li>
				<li>This Month</li>
			</ul> */}

			<div className={styles["list-cont"]}>
				<div className={styles["list-cont-sm"]}>
					<div
						className={`${styles.list} ${
							notes.length > 2 ? styles.hidden : styles.auto
						}`}
					>
						{notes
							.filter((note) => !archivedDate.includes(note.id))
							.slice(0, 3)
							.map((folder, i) => (
								<div style={{ width: "300px" }} key={i}>
									<NoteCard note={folder} />
								</div>
							))}
					</div>
					{notes.filter((note) => !archivedDate.includes(note.id)).length >
						2 && (
						<div className={styles["more-btn"]}>
							<button
								onClick={() => {
									navigate("/notes");
									window.scrollTo(0, 0);
								}}
							>
								<span className="material-symbols-outlined">
									keyboard_arrow_right
								</span>
							</button>
						</div>
					)}
				</div>
				<button
					className={styles["new-btn"]}
					onClick={() => navigate("/new-note")}
				>
					<span className="material-symbols-outlined">note_add</span>
					<p>New Note</p>
				</button>
			</div>
		</>
	);
}

export default function Home(): ReactNode {
	return (
		<section className={styles.home}>
			<RecentFolders />
			<RecentNotes />
		</section>
	);
}
