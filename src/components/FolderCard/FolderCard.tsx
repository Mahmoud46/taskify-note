import { useContext, useState, type ReactNode } from "react";
import styles from "./FolderCard.module.scss";
import type { IFolder } from "../../interface/Data";
import SettingsContext from "../../context/settings/settings.context";
import type { IDataContext, ISettingsContext } from "../../interface/Context";
import { DataContext } from "../../context/data/data.context";

export default function FolderCard({ folder }: { folder: IFolder }): ReactNode {
	const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
	const { navigate } = useContext(SettingsContext) as ISettingsContext;
	const { removeFolder } = useContext(DataContext) as IDataContext;

	return (
		<div className={styles["folder-card"]}>
			{isOpenMenu && (
				<div
					className={styles.options}
					onMouseLeave={() => setIsOpenMenu(false)}
				>
					<button onClick={() => navigate(`/folder/update/${folder.id}`)}>
						<span className="material-symbols-outlined">edit</span>
						<p>Update</p>
					</button>
					<button onClick={async () => await removeFolder(folder.id)}>
						<span className="material-symbols-outlined">delete</span>
						<p>Delete</p>
					</button>
				</div>
			)}

			<div className={styles["folder-head"]}>
				<div
					className={styles["icon-cont"]}
					onClick={() => navigate(`/folders/${folder.id}`)}
				>
					<span className={`material-symbols-outlined ${styles.icon}`}>
						folder
					</span>
					{folder.icon && (
						<span className={`material-symbols-outlined ${styles["sub-icon"]}`}>
							{folder.icon}
						</span>
					)}
				</div>
				<div
					className={styles.space}
					onClick={() => navigate(`/folders/${folder.id}`)}
				></div>
				<button onClick={() => setIsOpenMenu((prev) => !prev)}>
					<span className="material-symbols-outlined">more_horiz</span>
				</button>
			</div>
			<div
				className={styles["folder-details"]}
				onClick={() => navigate(`/folders/${folder.id}`)}
			>
				<p>{folder.title}</p>
				<p>{folder.updatedAt ? folder.updatedAt : folder.createdAt}</p>
			</div>
		</div>
	);
}
