export interface IFolder {
	id: string;
	title: string;
	createdAt: string;
	icon?: string;
	notes: string[]; // Contians all notes ids related to the folder
	description?: string;
	updatedAt?: string;
	updatedAtDateTime?: string;
	createAtDateTime?: string;
}

export interface INote {
	id: string; // gen
	title: string;
	createdAt: string; // gen
	type: "note" | "task";
	icon?: string;
	content?: string;
	date?: string;
	time?: string;
	category?: TNoteCategory;
	status?: TTaskStatus;
	favorite: boolean; // gen
	day?: TWeekDay;
	folderId?: string;
	updatedAt?: string;
	updatedAtDateTime?: string;
	createAtDateTime?: string;
}

export type TTaskStatus = "upcoming" | "ongoing" | "completed" | "cancelled";
export type TWeekDay =
	| "Monday"
	| "Tuesday"
	| "Wednesday"
	| "Thursday"
	| "Friday"
	| "Saturday"
	| "Sunday";

export type TNoteCategory = "personal" | "learning" | "event" | "work";

export interface INoteWithPriority extends INote {
	priority: number;
}
