import type { INote, INoteWithPriority, TTaskStatus } from "../interface/Data";

// Parse datetime
const parseDateTime = (dateStr: string, timeStr: string): number => {
	const [day, month, year] = dateStr.split("/").map(Number);
	const [timePart, modifier] = timeStr.toLowerCase().split(" ");
	const timeList = timePart.split(":").map(Number);
	let hours = timeList[0];
	const minutes = timeList[1];

	if (modifier === "PM" && hours < 12) hours += 12;
	if (modifier === "AM" && hours === 12) hours = 0;

	return new Date(year, month - 1, day, hours, minutes).getTime();
};

const assignPriority = (item: INote): number => {
	const statusPriority: Record<TTaskStatus, number> = {
		upcoming: 0,
		ongoing: 1,
		completed: 2,
		cancelled: 3,
	};

	const typeScore = item.type === "task" ? 0 : 1; // task before note
	const favoriteScore = item.favorite ? 0 : 1; // favorite before non-favorite
	const statusScore = item.status ? statusPriority[item.status] : -1; // status priority
	const timeScore =
		item.date && item.time ? parseDateTime(item.date, item.time) : -1; // earlier time first

	// Compose into a weighted priority score
	return (
		typeScore * 1e13 + favoriteScore * 1e12 + statusScore * 1e10 + timeScore
	);
};

const tagItemsWithPriority = (items: INote[]): INoteWithPriority[] => {
	return items.map((item) => ({
		...item,
		priority: assignPriority(item),
	}));
};

export const sortNotes = (items: INote[]): INote[] => {
	return tagItemsWithPriority(items).sort((a, b) => a.priority! - b.priority!);
};
