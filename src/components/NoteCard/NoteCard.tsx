import { useContext, useState, type ReactNode } from "react";
import styles from "./NoteCard.module.scss";
import type { INote, TTaskStatus } from "../../interface/Data";
import type { IDataContext, ISettingsContext } from "../../interface/Context";
import SettingsContext from "../../context/settings/settings.context";
import { DataContext } from "../../context/data/data.context";

const statusBgColor: Record<TTaskStatus, string> = {
	completed: "#22c55e", // green
	ongoing: "#3b82f6", // blue
	upcoming: "#fde047", // yellow
	cancelled: "#ef4444", // red
};

const statusOptions: TTaskStatus[] = [
	"upcoming",
	"ongoing",
	"completed",
	"cancelled",
];

export default function NoteCard({ note }: { note: INote }): ReactNode {
	const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
	const [isOpenStatus, setIsOpenStatus] = useState<boolean>(false);
	const { navigate } = useContext(SettingsContext) as ISettingsContext;
	const { updateNote, archivedDate, updateArchivedData, removeNote } =
		useContext(DataContext) as IDataContext;

	return (
		<div className={styles["note-card"]}>
			{isOpenMenu && (
				<div
					className={styles.options}
					onMouseLeave={() => setIsOpenMenu(false)}
				>
					{note.status && (
						<button
							onClick={async () =>
								await updateNote(note.id, { favorite: !note.favorite })
							}
						>
							<span
								className={`material-symbols-outlined ${
									note.favorite && styles.favorite
								}`}
							>
								star
							</span>
							{note.favorite && <p>Unfavorite </p>}
							{!note.favorite && <p>Favorite</p>}
						</button>
					)}
					<button onClick={() => navigate(`/note/update/${note.id}`)}>
						<span className="material-symbols-outlined">edit</span>
						<p>Update</p>
					</button>
					<button
						onClick={async () => {
							if (archivedDate.includes(note.id))
								await updateArchivedData("remove", note.id);
							else await updateArchivedData("add", note.id);
						}}
					>
						{!archivedDate.includes(note.id) && (
							<span className="material-symbols-outlined">archive</span>
						)}
						{archivedDate.includes(note.id) && (
							<span className="material-symbols-outlined">outbox</span>
						)}

						{!archivedDate.includes(note.id) && <p>Archive</p>}
						{archivedDate.includes(note.id) && <p>Unarchive</p>}
					</button>
					<button
						onClick={async () => {
							await removeNote(note.id);
						}}
					>
						<span className="material-symbols-outlined">delete</span>
						<p>Delete</p>
					</button>
				</div>
			)}

			<header>
				<div className={styles.left}>
					<p>{note.date ?? note.updatedAt ?? note.createdAt}</p>
				</div>
				<div className={styles.right}>
					{/* Task status */}
					{note.status && note.type == "task" && (
						<div
							className={styles.status}
							onClick={() => setIsOpenStatus((prev) => !prev)}
						>
							<button
								className={`status-indicator status-${note.status}`}
							></button>
							<span style={{ color: statusBgColor[note.status] }}>
								{note.status.toUpperCase()}
							</span>
							{isOpenStatus && (
								<div
									className={styles["status-options"]}
									onMouseLeave={() => setIsOpenStatus(false)}
								>
									{statusOptions.map((option, i) => (
										<div
											className={styles.option}
											key={i}
											onClick={async () => {
												await updateNote(note.id, { status: option });
											}}
										>
											<button
												className={`status-indicator status-${option}`}
											></button>
											<span style={{ color: statusBgColor[option] }}>
												{option.toUpperCase()}
											</span>
										</div>
									))}
								</div>
							)}
						</div>
					)}
					{!note.status && (
						<button
							onClick={async () =>
								await updateNote(note.id, { favorite: !note.favorite })
							}
							className={styles.favorite}
						>
							<span
								className={`material-symbols-outlined ${
									note.favorite && styles.favorite
								}`}
							>
								star
							</span>
						</button>
					)}
					<button
						className={styles.more}
						onClick={() => setIsOpenMenu((prev) => !prev)}
					>
						<span className="material-symbols-outlined">more_horiz</span>
					</button>
				</div>
			</header>

			<h1
				onClick={() => {
					navigate(`/notes/${note.id}`);
					window.scrollTo(0, 0);
				}}
			>
				<div className={styles.icon}>
					{note.type == "note" && (
						<span
							className={`material-symbols-outlined ${styles["main-icon"]}`}
						>
							description
						</span>
					)}
					{note.type == "task" && (
						<span
							className={`material-symbols-outlined ${styles["main-icon"]}`}
						>
							assignment
						</span>
					)}
					{note.icon && (
						<span
							className={`material-symbols-outlined ${styles["minor-icon"]}`}
						>
							{note.icon}
						</span>
					)}
				</div>
				<p>{note.title}</p>
			</h1>

			{note.content && (
				<div
					className={styles.content}
					dangerouslySetInnerHTML={{
						__html: `${note.content.slice(0, 200)} ${
							note.content.length > 200 ? "..." : ""
						}`,
					}}
					onClick={() => {
						navigate(`/notes/${note.id}`);
						window.scrollTo(0, 0);
					}}
				></div>
			)}
			{note.time && note.day && (
				<div className={styles.foot}>
					<span className="material-symbols-outlined">alarm</span>
					<p>
						{note.time.toUpperCase()}, {note.day}
					</p>
				</div>
			)}
		</div>
	);
}
