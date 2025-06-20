import { useEffect, useState, type ReactNode } from "react";
import { DataContext } from "./data.context";
import type { IDataContext } from "../../interface/Context";
import type { IFolder, INote } from "../../interface/Data";
import toast from "react-hot-toast";

export default function DataProvider({
	children,
}: {
	children: ReactNode;
}): ReactNode {
	const [folders, setFolders] = useState<IFolder[]>([]);
	const [notes, setNotes] = useState<INote[]>([]);
	const [archivedDate, setArchivedDate] = useState<string[]>([]);

	// Function to add Folder
	const addFolder = async (folder: IFolder) => {
		setFolders((prev) => {
			prev = prev.reverse();
			prev.push(folder);
			prev = prev.reverse();
			localStorage.setItem("folders", JSON.stringify(prev));
			return prev;
		});
		toast.success("Folder created sucessfully");
	};

	// Fuction to update features of folder
	const updateFolder = async <K extends keyof Omit<IFolder, "id">>(
		id: string,
		update: { [P in K]: IFolder[P] }
	) => {
		setFolders((prev) => {
			prev = prev.map((folder) => {
				if (folder.id == id) folder = { ...folder, ...update };
				return folder;
			});
			prev = [...new Set(prev)];
			localStorage.setItem("folders", JSON.stringify(prev));
			return prev;
		});
		toast.success("Folder updated sucessfully");
	};

	const recentFilter = (
		date: string,
		today: Date,
		monthsAgo: Date
	): boolean => {
		const [day, month, year] = date.split("/").map(Number);
		const itemDate = new Date(year, month - 1, day);
		return itemDate >= monthsAgo && itemDate <= today;
	};

	const addNoteToFolder = (folderId: string, noteId: string) => {
		setFolders((prev) => {
			prev = prev.map((folder) => {
				if (folder.id == folderId) folder.notes.reverse().push(noteId);
				return folder;
			});

			localStorage.setItem("folders", JSON.stringify(prev));
			return prev;
		});
	};

	// Function to add note
	const addNote = async (note: INote, folderId?: string) => {
		setNotes((prev) => {
			prev = [note, ...prev];
			localStorage.setItem("notes", JSON.stringify(prev));
			return prev;
		});
		if (folderId) addNoteToFolder(folderId, note.id);
		if (note.type == "task") toast.success("Task created successfully");
		else toast.success("Note created successfully");
	};

	// Function to update features of a note except the id
	const updateNote = async <K extends keyof Omit<INote, "id">>(
		id: string,
		update: { [P in K]: INote[P] }
	) => {
		setNotes((prev) => {
			prev = prev.map((note) =>
				note.id === id ? { ...note, ...update } : note
			);
			localStorage.setItem("notes", JSON.stringify(prev));
			return prev;
		});
		toast.success("Note updated sucessfully");
	};

	// Function to update archived data
	const updateArchivedData = async (flag: "add" | "remove", id: string) => {
		if (flag == "add") {
			setArchivedDate((prev) => {
				prev = [...prev, id];
				localStorage.setItem("archivedDate", JSON.stringify(prev));
				return prev;
			});
			toast.success("Note archived sucessfully");
		} else {
			setArchivedDate((prev) => {
				prev = prev.filter((dataId) => dataId != id);
				localStorage.setItem("archivedDate", JSON.stringify(prev));
				return prev;
			});
			toast.success("Note Unarchived sucessfully");
		}
	};

	// Function to remove function from folder
	const removeNoteFromFolder = (noteId: string, folderId: string) => {
		setFolders((prev) => {
			prev = prev.map((folder) => {
				if (folder.id == folderId) {
					return {
						...folder,
						notes: folder.notes.filter((id) => id != noteId),
					};
				}

				return folder;
			});

			localStorage.setItem("folders", JSON.stringify(prev));
			return prev;
		});
	};

	// Function to remove note
	const removeNote = async (id: string, folderId?: string) => {
		setNotes((prev) => {
			prev = prev.filter((note) => note.id != id);
			localStorage.setItem("notes", JSON.stringify(prev));
			return prev;
		});
		if (archivedDate.includes(id)) updateArchivedData("remove", id);
		if (folderId) removeNoteFromFolder(id, folderId);
		toast.success("Note deleted sucessfully");
	};

	// Function to remove folder
	const removeFolder = async (id: string) => {
		setFolders((prev) => {
			prev = prev.filter((folder) => folder.id != id);
			localStorage.setItem("folders", JSON.stringify(prev));
			return prev;
		});
		toast.success("Folder deleted sucessfully");
	};

	useEffect(() => {
		const foldersData = localStorage.getItem("folders");
		const notesData = localStorage.getItem("notes");
		const archivedNotesDate = localStorage.getItem("archivedDate");

		if (foldersData) setFolders([...new Set<IFolder>(JSON.parse(foldersData))]);
		if (notesData) setNotes(JSON.parse(notesData));
		if (archivedNotesDate) setArchivedDate(JSON.parse(archivedNotesDate));
	}, []);

	const dataValue: IDataContext = {
		folders,
		notes,
		updateNote,
		archivedDate,
		updateArchivedData,
		removeNote,
		removeFolder,
		addFolder,
		updateFolder,
		recentFilter,
		addNote,
	};
	return (
		<DataContext.Provider value={dataValue}>{children}</DataContext.Provider>
	);
}
