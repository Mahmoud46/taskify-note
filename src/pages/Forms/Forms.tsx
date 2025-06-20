import { useContext, useEffect, useState, type ReactNode, useRef } from "react";
import SettingsContext from "../../context/settings/settings.context";
import type { IDataContext, ISettingsContext } from "../../interface/Context";
import { DataContext } from "../../context/data/data.context";
import styles from "./Forms.module.scss";
import { dailyUseIcons } from "../../constants/constants";
import { v4 } from "uuid";
import type { IFolder, INote, TWeekDay } from "../../interface/Data";
import { useParams } from "react-router-dom";
import "quill/dist/quill.snow.css";
import Quill from "quill";

const noteTypes = [
	{ title: "Note", value: "note" },
	{ title: "Task", value: "task" },
];

const QuillEditor = ({
	description,
	setDescription,
}: {
	description?: string;
	setDescription: React.Dispatch<React.SetStateAction<string>>;
}): ReactNode => {
	const editorRef = useRef<HTMLDivElement | null>(null);
	const quillInstance = useRef<Quill | null>(null);

	useEffect(() => {
		if (editorRef.current && !quillInstance.current) {
			quillInstance.current = new Quill(editorRef.current, {
				theme: "snow",
				modules: {
					toolbar: [
						[{ header: [1, 2, 3, false] }],
						["bold", "italic", "underline", "strike"],
						[{ list: "ordered" }, { list: "bullet" }],
						[{ script: "sub" }, { script: "super" }],
						[{ indent: "-1" }, { indent: "+1" }],
						[{ align: [] }],
						["blockquote", "code-block"],
						[{ color: [] }, { background: [] }],
						["clean"],
					],
				},
			});
			if (description) {
				quillInstance.current.clipboard.dangerouslyPasteHTML(description);
			}
			quillInstance.current.on("text-change", () => {
				const html = editorRef.current?.querySelector(".ql-editor")?.innerHTML;
				if (html) setDescription(html);
			});
		}
	}, []);

	return (
		<div className={styles.textarea}>
			<div ref={editorRef} className={styles["text-input"]} />
		</div>
	);
};

const Header = ({ title }: { title: string }): ReactNode => {
	const { navigate } = useContext(SettingsContext) as ISettingsContext;
	return (
		<div className={styles["head"]}>
			<h1>{title}</h1>
			<button
				onClick={() => {
					navigate(-1);
				}}
			>
				Cancel
			</button>
		</div>
	);
};

export const NewFolderForm = (): ReactNode => {
	const [description, setDescription] = useState<string>("");
	const [title, setTitle] = useState<string>("");
	const [icon, setIcon] = useState<string>("add");
	const [isIconsOpen, setIsIconsOpen] = useState<boolean>(false);
	const [isHover, setIsHover] = useState<boolean>(false);
	const { addFolder } = useContext(DataContext) as IDataContext;
	const { navigate } = useContext(SettingsContext) as ISettingsContext;
	const today = new Date();
	const formatted = `${today.getDate().toString().padStart(2, "0")}/${(
		today.getMonth() + 1
	)
		.toString()
		.padStart(2, "0")}/${today.getFullYear()}`;

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await addFolder({
			id: v4(),
			title: title,
			icon: icon,
			notes: [],
			createdAt: formatted,
			description: description,
		});
		navigate("/folders");
	};
	return (
		<section className={styles.forms}>
			<Header title="New Folder" />
			<form onSubmit={handleSubmit}>
				{isIconsOpen && (
					<div
						className={styles.icons}
						onClick={() => setIsIconsOpen((prev) => !prev)}
						onMouseLeave={() => setIsIconsOpen((prev) => !prev)}
					>
						{dailyUseIcons.map((icon, i) => (
							<span
								className="material-symbols-outlined"
								onClick={() => setIcon(icon)}
								key={i}
							>
								{icon}
							</span>
						))}
					</div>
				)}
				<header>
					<div className={styles.left}>
						<div
							className={styles["icon-cont"]}
							onClick={() => setIsIconsOpen((prev) => !prev)}
						>
							<span className={`material-symbols-outlined ${styles.icon}`}>
								folder
							</span>
							<span
								className={`material-symbols-outlined ${styles["sub-icon"]}`}
							>
								{icon}
							</span>
						</div>
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Folder Title"
							required
						/>
					</div>
				</header>
				<textarea
					placeholder="Description (optional)"
					onChange={(e) => {
						setDescription(e.target.value);
					}}
					value={description}
				>
					{description}
				</textarea>
				{/* <QuillEditor setDescription={setDescription} /> */}
				<button
					className={`${styles["submit-btn"]} ${isHover && styles.open}`}
					onMouseEnter={() => setIsHover(true)}
					onMouseLeave={() => setIsHover(false)}
					type="submit"
				>
					<span className="material-symbols-outlined">create_new_folder</span>
					{isHover && <p>Create</p>}
				</button>
			</form>
		</section>
	);
};

export const NewNoteForm = (): ReactNode => {
	const { folderId } = useParams();
	const [title, setTitle] = useState<string>("");
	const [type, setType] = useState<string>("note");
	const [content, setContent] = useState<string>("");
	const [icon, setIcon] = useState<string>("add");
	const [date, setDate] = useState<string>("");
	const [time, setTime] = useState<string>("");

	const [isIconsOpen, setIsIconsOpen] = useState<boolean>(false);
	const [isHover, setIsHover] = useState<boolean>(false);
	const { addNote } = useContext(DataContext) as IDataContext;
	const { navigate, convertTo12Hour, getDayName } = useContext(
		SettingsContext
	) as ISettingsContext;

	const today = new Date();
	const formatted = `${today.getDate().toString().padStart(2, "0")}/${(
		today.getMonth() + 1
	)
		.toString()
		.padStart(2, "0")}/${today.getFullYear()}`;

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (folderId) {
			if (type == "task")
				await addNote(
					{
						id: v4(),
						title: title,
						createdAt: formatted,
						type: "task",
						icon: icon,
						content: content,
						date: date.split("-").reverse().join("/"),
						time: convertTo12Hour(time),
						status: "upcoming",
						favorite: false,
						day: getDayName(date) as TWeekDay,
						folderId: folderId,
					},
					folderId
				);
			else
				await addNote(
					{
						id: v4(),
						title: title,
						createdAt: formatted,
						type: "note",
						icon: icon,
						content: content,
						favorite: false,
						folderId: folderId,
					},
					folderId
				);
		} else if (type == "task")
			await addNote({
				id: v4(),
				title: title,
				createdAt: formatted,
				type: "task",
				icon: icon,
				content: content,
				date: date.split("-").reverse().join("/"),
				time: convertTo12Hour(time),
				status: "upcoming",
				favorite: false,
				day: getDayName(date) as TWeekDay,
			});
		else
			await addNote({
				id: v4(),
				title: title,
				createdAt: formatted,
				type: "note",
				icon: icon,
				content: content,
				favorite: false,
			});
		if (folderId) navigate(`/folders/${folderId}`);
		else navigate("/notes");
	};

	return (
		<section className={styles.forms}>
			<Header title={`New ${type == "task" ? "Task" : "Note"}`} />
			<ul className={styles["note-types"]}>
				{noteTypes.map((t, i) => (
					<li
						key={i}
						className={`${t.value == type && styles.active}`}
						onClick={() => setType(t.value)}
					>
						{t.title}
					</li>
				))}
			</ul>
			<form onSubmit={handleSubmit}>
				{isIconsOpen && (
					<div
						className={styles.icons}
						onClick={() => setIsIconsOpen((prev) => !prev)}
						onMouseLeave={() => setIsIconsOpen((prev) => !prev)}
					>
						{dailyUseIcons.map((icon, i) => (
							<span
								className="material-symbols-outlined"
								onClick={() => setIcon(icon)}
								key={i}
							>
								{icon}
							</span>
						))}
					</div>
				)}
				<header>
					<div className={styles.left}>
						<div
							className={styles["icon-cont"]}
							onClick={() => setIsIconsOpen((prev) => !prev)}
						>
							{type == "task" && (
								<span className={`material-symbols-outlined ${styles.icon}`}>
									assignment
								</span>
							)}
							{type == "note" && (
								<span className={`material-symbols-outlined ${styles.icon}`}>
									note
								</span>
							)}

							<span
								className={`material-symbols-outlined ${styles["sub-icon"]}`}
							>
								{icon}
							</span>
						</div>
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder={`${type == "task" ? "Task" : "Note"} Title`}
							required
						/>
					</div>
				</header>
				{type == "task" && (
					<div className={styles["time-date"]}>
						<div>
							<label htmlFor="time">
								<span className="material-symbols-outlined">schedule</span>
							</label>
							<input
								type="time"
								value={time}
								onChange={(e) => setTime(e.target.value)}
								id="time"
								required
							/>
						</div>
						<div>
							<label htmlFor="date">
								<span className="material-symbols-outlined">
									calendar_month
								</span>
							</label>
							<input
								type="date"
								required
								onChange={(e) => setDate(e.target.value)}
								value={date}
								min={formatted.split("/").reverse().join("-")}
								id="date"
							/>
						</div>
						<div
							className={styles["today-btn"]}
							onClick={() => setDate(formatted.split("/").reverse().join("-"))}
						>
							<span className="material-symbols-outlined">today</span>
							<p>Today</p>
						</div>
					</div>
				)}
				<QuillEditor setDescription={setContent} />
				<button
					className={`${styles["submit-btn"]} ${isHover && styles.open}`}
					onMouseEnter={() => setIsHover(true)}
					onMouseLeave={() => setIsHover(false)}
					type="submit"
				>
					<span className="material-symbols-outlined">
						{type == "task" ? "add_task" : "note_add"}
					</span>
					{isHover && <p>Create </p>}
				</button>
			</form>
		</section>
	);
};

export const UpdateFolderForm = (): ReactNode => {
	const { id } = useParams();
	const [folder, setFolder] = useState<IFolder | null>(null);
	const [description, setDescription] = useState<string>("");
	const [title, setTitle] = useState<string>("");
	const [icon, setIcon] = useState<string>("add");
	const [isIconsOpen, setIsIconsOpen] = useState<boolean>(false);
	const [isHover, setIsHover] = useState<boolean>(false);
	const { updateFolder, folders } = useContext(DataContext) as IDataContext;
	const { navigate } = useContext(SettingsContext) as ISettingsContext;
	const today = new Date();
	const formatted = `${today.getDate().toString().padStart(2, "0")}/${(
		today.getMonth() + 1
	)
		.toString()
		.padStart(2, "0")}/${today.getFullYear()}`;

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await updateFolder(id as string, {
			title: title,
			icon: icon,
			description: description,
			updatedAt: formatted,
		});
		navigate("/folders");
	};

	useEffect(() => {
		const folderIndex = folders.findIndex((folder) => folder.id == id);
		if (folderIndex != -1) {
			setFolder(folders[folderIndex]);
			setTitle(folders[folderIndex].title);
			if (folders[folderIndex].description)
				setDescription(folders[folderIndex].description);
			if (folders[folderIndex].icon) setIcon(folders[folderIndex].icon);
		}
	}, [id, folders]);

	return (
		<section className={styles.forms}>
			<Header title="Update Folder" />
			{folder && (
				<form onSubmit={handleSubmit}>
					{isIconsOpen && (
						<div
							className={styles.icons}
							onClick={() => setIsIconsOpen((prev) => !prev)}
							onMouseLeave={() => setIsIconsOpen((prev) => !prev)}
						>
							{dailyUseIcons.map((icon, i) => (
								<span
									className="material-symbols-outlined"
									onClick={() => setIcon(icon)}
									key={i}
								>
									{icon}
								</span>
							))}
						</div>
					)}
					<header>
						<div className={styles.left}>
							<div
								className={styles["icon-cont"]}
								onClick={() => setIsIconsOpen((prev) => !prev)}
							>
								<span className={`material-symbols-outlined ${styles.icon}`}>
									folder
								</span>
								<span
									className={`material-symbols-outlined ${styles["sub-icon"]}`}
								>
									{icon}
								</span>
							</div>
							<input
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Folder Title"
								required
							/>
						</div>
					</header>

					<textarea
						placeholder="Description (optional)"
						onChange={(e) => {
							setDescription(e.target.value);
						}}
						value={description}
					>
						{folder.description}
					</textarea>
					{/* <QuillEditor
						setDescription={setDescription}
						description={folder.description}
					/> */}
					<button
						className={`${styles["submit-btn"]} ${isHover && styles.open}`}
						onMouseEnter={() => setIsHover(true)}
						onMouseLeave={() => setIsHover(false)}
						type="submit"
					>
						<span className="material-symbols-outlined">edit</span>
						{isHover && <p>Update</p>}
					</button>
				</form>
			)}
			{!folder && <p>No folder exists</p>}
		</section>
	);
};

export const UpdateNoteForm = (): ReactNode => {
	const { id } = useParams();
	const [note, setNote] = useState<INote | null>(null);
	const [title, setTitle] = useState<string>("");
	const [content, setContent] = useState<string>("");
	const [icon, setIcon] = useState<string>("add");
	const [date, setDate] = useState<string>("");
	const [time, setTime] = useState<string>("");

	const [isIconsOpen, setIsIconsOpen] = useState<boolean>(false);
	const [isHover, setIsHover] = useState<boolean>(false);
	const { updateNote, notes } = useContext(DataContext) as IDataContext;
	const { navigate, convertTo12Hour, getDayName, convertTo24Hour } = useContext(
		SettingsContext
	) as ISettingsContext;

	const today = new Date();
	const formatted = `${today.getDate().toString().padStart(2, "0")}/${(
		today.getMonth() + 1
	)
		.toString()
		.padStart(2, "0")}/${today.getFullYear()}`;

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (note?.type == "task")
			await updateNote(id as string, {
				title: title,

				icon: icon,
				content: content,
				date: date.split("-").reverse().join("/"),
				time: convertTo12Hour(time),

				day: getDayName(date) as TWeekDay,
			});
		else
			await updateNote(id as string, {
				title: title,
				icon: icon,
				content: content,
				updatedAt: formatted,
			});

		navigate("/notes");
	};

	useEffect(() => {
		const noteIndex = notes.findIndex((note) => note.id == id);
		if (noteIndex != -1) {
			setNote(notes[noteIndex]);
			setTitle(notes[noteIndex].title);
			if (notes[noteIndex].icon) setIcon(notes[noteIndex].icon as string);
			if (notes[noteIndex].content) setContent(notes[noteIndex].content);
			if (notes[noteIndex].type == "task") {
				setDate(
					notes[noteIndex].date?.split("/").reverse().join("-") as string
				);

				setTime(convertTo24Hour(notes[noteIndex].time as string));
			}
		}
	}, [id, notes]);
	return (
		<section className={styles.forms}>
			{note && (
				<>
					<Header title={`Update ${note.type == "task" ? "Task" : "Note"}`} />

					<form onSubmit={handleSubmit}>
						{isIconsOpen && (
							<div
								className={styles.icons}
								onClick={() => setIsIconsOpen((prev) => !prev)}
								onMouseLeave={() => setIsIconsOpen((prev) => !prev)}
							>
								{dailyUseIcons.map((icon, i) => (
									<span
										className="material-symbols-outlined"
										onClick={() => setIcon(icon)}
										key={i}
									>
										{icon}
									</span>
								))}
							</div>
						)}
						<header>
							<div className={styles.left}>
								<div
									className={styles["icon-cont"]}
									onClick={() => setIsIconsOpen((prev) => !prev)}
								>
									{note.type == "task" && (
										<span
											className={`material-symbols-outlined ${styles.icon}`}
										>
											assignment
										</span>
									)}
									{note.type == "note" && (
										<span
											className={`material-symbols-outlined ${styles.icon}`}
										>
											note
										</span>
									)}

									<span
										className={`material-symbols-outlined ${styles["sub-icon"]}`}
									>
										{icon}
									</span>
								</div>
								<input
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									placeholder={`${note.type == "task" ? "Task" : "Note"} Title`}
									required
								/>
							</div>
						</header>
						{note.type == "task" && (
							<div className={styles["time-date"]}>
								<div>
									<label htmlFor="time">
										<span className="material-symbols-outlined">schedule</span>
									</label>
									<input
										type="time"
										value={time}
										onChange={(e) => setTime(e.target.value)}
										id="time"
										required
									/>
								</div>
								<div>
									<label htmlFor="date">
										<span className="material-symbols-outlined">
											calendar_month
										</span>
									</label>
									<input
										type="date"
										required
										onChange={(e) => setDate(e.target.value)}
										value={date}
										min={formatted.split("/").reverse().join("-")}
										id="date"
									/>
								</div>
								<div
									className={styles["today-btn"]}
									onClick={() =>
										setDate(formatted.split("/").reverse().join("-"))
									}
								>
									<span className="material-symbols-outlined">today</span>
									<p>Today</p>
								</div>
							</div>
						)}
						<QuillEditor
							setDescription={setContent}
							description={note.content}
						/>

						<button
							className={`${styles["submit-btn"]} ${isHover && styles.open}`}
							onMouseEnter={() => setIsHover(true)}
							onMouseLeave={() => setIsHover(false)}
							type="submit"
						>
							<span className="material-symbols-outlined">edit</span>
							{isHover && <p>Update</p>}
						</button>
					</form>
				</>
			)}
			{!note && <p>No Note Found!</p>}
		</section>
	);
};
