import type { NavigateFunction } from "react-router-dom";
import type { IFolder, INote } from "./Data";

export interface ISettingsContext {
	isMenuOpen: boolean;
	setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
	searchInput: string;
	setSearchInput: React.Dispatch<React.SetStateAction<string>>;
	navigate: NavigateFunction;
	convertTo12Hour: (time24: string) => string;
	getDayName: (date: string) => string;
	convertTo24Hour: (time12h: string) => string;
}

export interface IDataContext {
	notes: INote[];
	folders: IFolder[];
	updateNote: <K extends keyof Omit<INote, "id">>(
		id: string,
		update: { [P in K]: INote[P] }
	) => Promise<void>;
	archivedDate: string[];
	updateArchivedData: (flag: "add" | "remove", id: string) => Promise<void>;
	removeNote: (id: string) => Promise<void>;
	removeFolder: (id: string) => Promise<void>;
	addFolder: (folder: IFolder) => Promise<void>;
	updateFolder: <K extends keyof Omit<IFolder, "id">>(
		id: string,
		update: { [P in K]: IFolder[P] }
	) => Promise<void>;
	recentFilter: (date: string, today: Date, monthsAgo: Date) => boolean;
	addNote: (note: INote, folderId?: string) => Promise<void>;
}
