import { useContext, useEffect, useState, type ReactNode } from "react";
import styles from "./Dashboard.module.scss";
import { DataContext } from "../../context/data/data.context";
import type { IDataContext, ISettingsContext } from "../../interface/Context";
import {
	LineChart,
	Line,
	XAxis,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import SettingsContext from "../../context/settings/settings.context";

type Event = { date: string; title: string };

function MyCalendar({ events }: { events: Event[] }): ReactNode {
	const [value, setValue] = useState(new Date());

	const tileContent = ({ date, view }: { date: Date; view: string }) => {
		if (view === "month") {
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const day = String(date.getDate()).padStart(2, "0");
			const dateString = `${year}-${month}-${day}`; // Local YYYY-MM-DD

			const hasEvent = events.find((e) => e.date === dateString);

			if (hasEvent) {
				return (
					<div className={styles["event-dot"]} title={hasEvent.title}></div>
				);
			}
		}
		return null;
	};

	return (
		<div className={styles["calendar-container"]}>
			<Calendar
				className={styles["main-calendar"]}
				onChange={(val) => setValue(val as Date)}
				value={value}
				tileContent={tileContent}
			/>
		</div>
	);
}

function Clock(): ReactNode {
	const [hours, setHours] = useState<string>("");
	const [minutes, setMinutes] = useState<string>("");
	const [ampm, setAmpm] = useState<string>("");
	const [date, setDate] = useState<string>("");
	const { getDayName } = useContext(SettingsContext) as ISettingsContext;

	const updateTime = () => {
		const now = new Date();
		let hours = now.getHours();
		const minutes = String(now.getMinutes()).padStart(2, "0");

		const ampm = hours >= 12 ? "PM" : "AM";
		hours = hours % 12 || 12; // Convert 0 to 12
		const hoursStr = String(hours).padStart(2, "0");

		setHours(hoursStr);
		setMinutes(minutes);
		setAmpm(ampm);
		setDate(
			`${now.getFullYear()}-${(now.getMonth() + 1)
				.toString()
				.padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`
		);
	};
	useEffect(() => {
		const interval = setInterval(updateTime, 1000);
		updateTime();
		return () => clearInterval(interval);
	}, []);
	return (
		<div className={styles.clock}>
			<small>{ampm}</small>
			<p className={styles.time}>{hours}</p>
			<p className={styles.time}>{minutes}</p>
			<p className={styles.day}>{getDayName(date)}</p>
			<p>{date.split("-").reverse().join("/")}</p>
		</div>
	);
}

function MyChart({ events }: { events: Record<string, number> }) {
	const data: { date: string; count: number }[] = Object.entries(events).map(
		([key, value]) => ({ date: key, count: value })
	);

	return (
		<div className={styles["my-chart"]}>
			<ResponsiveContainer width="100%" height="100%" className={styles.chart}>
				<LineChart data={data}>
					<XAxis
						dataKey="date"
						angle={-45}
						textAnchor="end"
						interval={0}
						tick={{
							fontSize: 10,
						}}
					/>
					<Tooltip />
					<Legend />
					<Line
						type="monotone"
						dataKey="count"
						stroke="#8884d8"
						name="Total Items (Notes and Tasks)"
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}

function sortRecordWithDate(
	data: Record<string, number>
): Record<string, number> {
	const sortedEntries = Object.entries(data).sort(([a], [b]) => {
		const parseDate = (s: string) => {
			const [day, month, year] = s.split("/").map(Number);
			return new Date(year, month - 1, day);
		};
		return parseDate(a).getTime() - parseDate(b).getTime();
	});
	return Object.fromEntries(sortedEntries);
}

export default function Dashboard(): ReactNode {
	const [foldersCount, setFoldersCount] = useState<number>(0);
	const [notesCount, setNotesCount] = useState<number>(0);
	const [tasksCount, setTasksCount] = useState<number>(0);
	const [upcomingCount, setUpcomingCount] = useState<number>(0);
	const [ongoingCount, setOngoingCount] = useState<number>(0);
	const [completedCount, setCompletedCount] = useState<number>(0);
	const [events, setEvents] = useState<Event[]>([]);
	const [dateItem, setDateItem] = useState<Record<string, number>>({});
	const { folders, notes } = useContext(DataContext) as IDataContext;
	const { navigate } = useContext(SettingsContext) as ISettingsContext;

	useEffect(() => {
		setFoldersCount(folders.length);
		setNotesCount(notes.filter((note) => note.type == "note").length);
		setTasksCount(notes.filter((note) => note.type == "task").length);
		setUpcomingCount(notes.filter((note) => note.status == "upcoming").length);
		setCompletedCount(
			notes.filter((note) => note.status == "completed").length
		);
		setOngoingCount(notes.filter((note) => note.status == "ongoing").length);
		setEvents(
			notes
				.filter(
					(note) =>
						note.type == "task" &&
						(note.status == "ongoing" || note.status == "upcoming")
				)
				.map((note) => ({
					date: note.date?.split("/").reverse().join("-") as string,
					title: note.title,
				}))
		);
		const eventsCount: Record<string, number> = {};

		notes.map((note) => {
			if (
				!eventsCount[note.date ?? note.updatedAt ?? (note.createdAt as string)]
			)
				eventsCount[
					note.date ?? note.updatedAt ?? (note.createdAt as string)
				] = 0;
			eventsCount[
				note.date ?? note.updatedAt ?? (note.createdAt as string)
			] += 1;
		});

		setDateItem(sortRecordWithDate(eventsCount));
	}, [folders, notes]);

	return (
		<section className={styles.dashboard}>
			<div className={styles["content"]}>
				<div className={styles.count}>
					<span className={`material-symbols-outlined ${styles.icon}`}>
						folder
					</span>
					<div className={styles.details}>
						<div className={styles.head}>
							<p>Folders</p>
							<span
								className="material-symbols-outlined"
								onClick={() => navigate("/folders")}
							>
								arrow_outward
							</span>
						</div>
						<h2>{foldersCount}</h2>
					</div>
				</div>
				<div className={styles.count}>
					<span className={`material-symbols-outlined ${styles.icon}`}>
						note
					</span>
					<div className={styles.details}>
						<div className={styles.head}>
							<p>Notes</p>
							<span
								className="material-symbols-outlined"
								onClick={() => navigate("/notes/main")}
							>
								arrow_outward
							</span>
						</div>
						<h2>{notesCount}</h2>
					</div>
				</div>
				<div className={styles.count}>
					<span className={`material-symbols-outlined ${styles.icon}`}>
						assignment
					</span>
					<div className={styles.details}>
						<div className={styles.head}>
							<p>Tasks</p>
							<span
								className="material-symbols-outlined"
								onClick={() => navigate("/tasks/main")}
							>
								arrow_outward
							</span>
						</div>
						<h2>{tasksCount}</h2>
					</div>
				</div>
				<div className={styles.count}>
					<span className={`material-symbols-outlined ${styles.icon}`}>
						pending_actions
					</span>
					<div className={styles.details}>
						<div className={styles.head}>
							<p>Ongoing</p>
							<span
								className="material-symbols-outlined"
								onClick={() => navigate("/ongoing")}
							>
								arrow_outward
							</span>
						</div>
						<h2>
							{ongoingCount}
							<small>/{tasksCount}</small>
						</h2>
					</div>
				</div>
				<div className={styles.count}>
					<span className={`material-symbols-outlined ${styles.icon}`}>
						event_upcoming
					</span>
					<div className={styles.details}>
						<div className={styles.head}>
							<p>Upcoming</p>
							<span
								className="material-symbols-outlined"
								onClick={() => navigate("/upcoming")}
							>
								arrow_outward
							</span>
						</div>
						<h2>
							{upcomingCount}
							<small>/{tasksCount}</small>
						</h2>
					</div>
				</div>
				<div className={styles.count}>
					<span className={`material-symbols-outlined ${styles.icon}`}>
						task
					</span>
					<div className={styles.details}>
						<div className={styles.head}>
							<p>Completed</p>
							<span
								className="material-symbols-outlined"
								onClick={() => navigate("/completed")}
							>
								arrow_outward
							</span>
						</div>
						<h2>
							{completedCount}
							<small>/{tasksCount}</small>
						</h2>
					</div>
				</div>
				<div className={styles.count}>
					<span className={`material-symbols-outlined ${styles.icon}`}>
						vital_signs
					</span>
					<div className={styles.details}>
						<div className={styles.head}>
							<p>Performance </p>
						</div>
						<h2>
							{(
								(tasksCount + notesCount) /
								Object.keys(dateItem).length
							).toFixed(1)}{" "}
							<small title="task per day">t/d</small>
						</h2>
					</div>
				</div>
				<MyChart events={dateItem} />
				<Clock />
				<MyCalendar events={events} />
			</div>
		</section>
	);
}
