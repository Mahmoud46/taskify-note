import { useState, type ReactNode } from "react";
import SettingsContext from "./settings.context";
import type { ISettingsContext } from "../../interface/Context";
import { useNavigate } from "react-router-dom";
import { weekDays } from "../../constants/constants";

export default function SettingsProvider({
	children,
}: {
	children: ReactNode;
}): ReactNode {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const [searchInput, setSearchInput] = useState<string>("");
	const navigate = useNavigate();

	const convertTo12Hour = (time24: string): string => {
		const [hourStr, minute] = time24.split(":");
		let hour = parseInt(hourStr);
		const ampm = hour >= 12 ? "PM" : "AM";
		hour = hour % 12 || 12;
		return `${hour}:${minute} ${ampm}`;
	};

	const convertTo24Hour = (time12h: string): string => {
		const [time, modifier] = time12h.split(" ");
		const timeArr = time.split(":").map(Number);

		if (modifier === "PM" && timeArr[0] !== 12) {
			timeArr[0] += 12;
		}

		if (modifier === "AM" && timeArr[0] === 12) {
			timeArr[0] = 0;
		}

		const hoursStr = timeArr[0].toString().padStart(2, "0");
		return `${hoursStr}:${timeArr[1].toString().padStart(2, "0")}`;
	};

	const getDayName = (date: string): string => {
		const day = new Date(date);
		return weekDays[day.getDay()];
	};

	const settingsValue: ISettingsContext = {
		isMenuOpen,
		setIsMenuOpen,
		searchInput,
		setSearchInput,
		navigate,
		convertTo12Hour,
		getDayName,
		convertTo24Hour,
	};
	return (
		<SettingsContext.Provider value={settingsValue}>
			{children}
		</SettingsContext.Provider>
	);
}
