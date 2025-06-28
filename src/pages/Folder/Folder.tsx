import { useContext, useEffect, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import type { IFolder } from "../../interface/Data";
import { DataContext } from "../../context/data/data.context";
import type { IDataContext, ISettingsContext } from "../../interface/Context";
import styles from "./Folder.module.scss";
import SettingsContext from "../../context/settings/settings.context";
import NoteCard from "../../components/NoteCard/NoteCard";
import { sortNotes } from "../../utils/sort";

const notesTypes = [
	{ name: "All", value: "all" },
	{ name: "Notes", value: "note" },
	{ name: "Tasks", value: "task" },
];

const Btn = ({
	title,
	icon,
	path,
	func,
}: {
	title: string;
	icon: string;
	path?: string;
	func?: () => void;
}): ReactNode => {
	const [isHover, setIsHover] = useState<boolean>(false);
	const { navigate } = useContext(SettingsContext) as ISettingsContext;

	return (
		<button
			className={`${styles.btn} ${isHover && styles.open}`}
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
			onClick={() => {
				if (path) navigate(path);
				else if (func) {
					func();
					navigate("/");
				}
			}}
		>
			<span className="material-symbols-outlined">{icon}</span>
			{isHover && <p>{title}</p>}
		</button>
	);
};

export default function Folder(): ReactNode {
	const { id } = useParams();
	const [folder, setFolder] = useState<IFolder | null>(null);
	const { searchInput } = useContext(SettingsContext) as ISettingsContext;
	const { folders, removeFolder, notes } = useContext(
		DataContext
	) as IDataContext;
	const [typeFilter, setTypeFilter] = useState<string>("all");

	useEffect(() => {
		const folderIndex = folders.findIndex((folder) => folder.id == id);
		if (folderIndex != -1) setFolder(folders[folderIndex]);
	}, [id, folders]);

	return (
		<section className={styles["main-folder"]}>
			{folder && (
				<>
					<header>
						<div className={styles.left}>
							<div className={styles["icon-cont"]}>
								<span className={`material-symbols-outlined ${styles.icon}`}>
									folder
								</span>
								{folder.icon && (
									<span
										className={`material-symbols-outlined ${styles["sub-icon"]}`}
									>
										{folder.icon}
									</span>
								)}
							</div>
							<h1>{folder.title}</h1>
						</div>
						<div className={styles.btns}>
							<Btn
								title="Update"
								icon="edit"
								path={`/folder/update/${folder.id}`}
							/>
							<Btn
								title="Delete"
								icon="delete"
								func={async () => await removeFolder(folder.id)}
							/>
						</div>
					</header>
					{folder.description && folder.description.trim() != "" && (
						<p dangerouslySetInnerHTML={{ __html: folder.description }}></p>
					)}
					<p>{new Set(folder.notes).size} Items</p>
					<div className={styles.content}>
						<div className={styles["content-header"]}>
							<div className={styles.left}>
								<h2>Content</h2>
								<ul>
									{notesTypes.map((type, i) => (
										<li
											onClick={() => setTypeFilter(type.value)}
											key={i}
											className={`${typeFilter == type.value && styles.active}`}
										>
											{type.name}
										</li>
									))}
								</ul>
							</div>
							<div className={styles.right}>
								<Btn
									title="New Note"
									icon="note_add"
									path={`/new-note/${folder.id}`}
								/>
							</div>
						</div>

						<div className={styles["folder-notes"]}>
							{folder.notes.length > 0 &&
								sortNotes(notes)
									.filter(
										(note) =>
											folder.notes.includes(note.id) &&
											(searchInput.trim() == ""
												? true
												: note.title
														.toLowerCase()
														.includes(searchInput.toLowerCase())) &&
											(typeFilter == "all"
												? true
												: typeFilter == "task"
												? note.type == "task"
												: note.type == "note")
									)
									.map((note, i) => <NoteCard note={note} key={i} />)}
							{folder.notes.length == 0 && <p>No Items Found</p>}
						</div>
					</div>
				</>
			)}
			{!folder && <div>No Folder Found</div>}
		</section>
	);
}
