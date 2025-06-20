import { useContext, useEffect, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import type { INote, TTaskStatus } from "../../interface/Data";
import { DataContext } from "../../context/data/data.context";
import type { IDataContext, ISettingsContext } from "../../interface/Context";
import styles from "./Note.module.scss";
import SettingsContext from "../../context/settings/settings.context";

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

const Btn = ({
	title,
	icon,
	path,
	func,
	flag,
	isFav,
}: {
	title: string;
	icon: string;
	path?: string;
	func?: () => void;
	flag?: boolean;
	isFav?: boolean;
}): ReactNode => {
	const [isHover, setIsHover] = useState<boolean>(false);
	const { navigate } = useContext(SettingsContext) as ISettingsContext;

	return (
		<button
			className={`${styles.btn} ${isHover && styles.open} ${
				isFav && styles.active
			}`}
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
			onClick={() => {
				if (path) navigate(path);
				else if (func && !flag) {
					func();
					navigate("/");
				} else if (func) {
					func();
				}
			}}
		>
			<span className="material-symbols-outlined">{icon}</span>
			{isHover && <p>{title}</p>}
		</button>
	);
};

export default function Note(): ReactNode {
	const { id } = useParams();
	const [note, setNote] = useState<INote | null>(null);
	const { notes, removeNote, updateNote, archivedDate, updateArchivedData } =
		useContext(DataContext) as IDataContext;
	const [isOpenStatus, setIsOpenStatus] = useState<boolean>(false);

	useEffect(() => {
		const noteIndex = notes.findIndex((note) => note.id == id);
		if (noteIndex != -1) setNote(notes[noteIndex]);
	}, [id, notes]);
	return (
		<section className={styles.note}>
			{note && (
				<>
					<p>{note.date ?? note.updatedAt ?? note.createdAt}</p>

					<header>
						<div className={styles.left}>
							<div className={styles["icon-cont"]}>
								<span className={`material-symbols-outlined ${styles.icon}`}>
									{note.type == "note" ? "note" : "assignment"}
								</span>
								{note.icon && (
									<span
										className={`material-symbols-outlined ${styles["sub-icon"]}`}
									>
										{note.icon}
									</span>
								)}
							</div>
							<h1>{note.title}</h1>
						</div>
						<div className={styles.btns}>
							<Btn
								title={note.favorite ? "Unfavorite" : "Favorite"}
								icon="star"
								func={async () =>
									await updateNote(note.id, { favorite: !note.favorite })
								}
								flag={true}
								isFav={note.favorite}
							/>
							<Btn
								title={archivedDate.includes(note.id) ? "Unarchive" : "Archive"}
								icon={archivedDate.includes(note.id) ? "outbox" : "archive"}
								func={async () => {
									if (archivedDate.includes(note.id))
										await updateArchivedData("remove", note.id);
									else await updateArchivedData("add", note.id);
								}}
								flag={true}
							/>
							<Btn
								title="Update"
								icon="edit"
								path={`/note/update/${note.id}`}
							/>
							<Btn
								title="Delete"
								icon="delete"
								func={async () => await removeNote(note.id)}
							/>
						</div>
					</header>
					{note.type == "task" && (
						<div className={styles.more}>
							{note.status && (
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
							<div className={styles.time}>
								<span className="material-symbols-outlined">alarm</span>
								<p>
									{note.time?.toUpperCase()}, {note.day}
								</p>
							</div>
						</div>
					)}
					{note.content && note.content.trim() != "" && (
						<div
							className={styles.content}
							dangerouslySetInnerHTML={{ __html: note.content }}
						></div>
					)}
				</>
			)}
			{!note && (
				<>
					<p>No Note Found!</p>
				</>
			)}
		</section>
	);
}
