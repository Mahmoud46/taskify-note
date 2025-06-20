import { useContext, useState, type ReactNode } from "react";
import styles from "./Notes.module.scss";
import NoteCard from "../../components/NoteCard/NoteCard";
import type { IDataContext, ISettingsContext } from "../../interface/Context";
import { DataContext } from "../../context/data/data.context";
import { useLocation } from "react-router-dom";
import SettingsContext from "../../context/settings/settings.context";

const noteCategoriesMenuElements = [
	{ name: "All", value: "all" },
	{ name: "Favorite", value: "favorite" },
];

export default function Notes(): ReactNode {
	const [isHover, setIsHover] = useState<boolean>(false);
	const { notes, archivedDate } = useContext(DataContext) as IDataContext;
	const { searchInput, navigate } = useContext(
		SettingsContext
	) as ISettingsContext;
	const [filterCategory, setFilterCategory] = useState<string>("all");
	const location = useLocation();

	return (
		<section className={styles.notes}>
			<header>
				{location.pathname == "/notes" && <h1>My Notes</h1>}
				{location.pathname == "/archive" && <h1>Archived Notes</h1>}
				{location.pathname == "/completed" && <h1>Completed Tasks</h1>}
				{location.pathname == "/upcoming" && <h1>Upcoming Tasks</h1>}

				<ul>
					{noteCategoriesMenuElements.map((category, i) => (
						<li
							onClick={() => setFilterCategory(category.value)}
							key={i}
							className={`${filterCategory == category.value && styles.active}`}
						>
							{category.name}
						</li>
					))}
				</ul>
				<button
					className={`${styles["new-btn"]} ${isHover && styles.open}`}
					onMouseEnter={() => setIsHover(true)}
					onMouseLeave={() => setIsHover(false)}
					onClick={() => navigate("/new-note")}
				>
					<span className="material-symbols-outlined">note_add</span>
					{isHover && <p>New Note</p>}
				</button>
			</header>
			<div className={styles["notes-cont"]}>
				{location.pathname == "/notes" &&
					notes
						.filter(
							(note) =>
								(searchInput.trim() == ""
									? true
									: note.title
											.toLowerCase()
											.includes(searchInput.toLowerCase())) &&
								!archivedDate.includes(note.id) &&
								(filterCategory == "all" || note.favorite)
						)
						.map((note, i) => <NoteCard note={note} key={i} />)}

				{/* Upcoming tasks */}
				{location.pathname == "/upcoming" &&
					notes
						.filter(
							(note) =>
								(filterCategory == "all" || note.favorite) &&
								note.status == "upcoming" &&
								note.type == "task" &&
								!archivedDate.includes(note.id) &&
								(searchInput.trim() == ""
									? true
									: note.title
											.toLowerCase()
											.includes(searchInput.toLowerCase()))
						)
						.map((note, i) => <NoteCard note={note} key={i} />)}

				{/* Completed tasks */}
				{location.pathname == "/completed" &&
					notes
						.filter(
							(note) =>
								(searchInput.trim() == ""
									? true
									: note.title
											.toLowerCase()
											.includes(searchInput.toLowerCase())) &&
								(filterCategory == "all" || note.favorite) &&
								note.status == "completed" &&
								note.type == "task" &&
								!archivedDate.includes(note.id)
						)
						.map((note, i) => <NoteCard note={note} key={i} />)}

				{/* Archived notes */}
				{location.pathname == "/archive" &&
					notes
						.filter(
							(note) =>
								(searchInput.trim() == ""
									? true
									: note.title
											.toLowerCase()
											.includes(searchInput.toLowerCase())) &&
								(filterCategory == "all" || note.favorite) &&
								archivedDate.includes(note.id)
						)
						.map((note, i) => <NoteCard note={note} key={i} />)}

				<div></div>
				<div></div>
			</div>
		</section>
	);
}
