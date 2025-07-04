import { type ReactNode } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Sidebar from "./components/Sidebar/Sidebar";
import Folders from "./pages/Folders/Folders";
import Folder from "./pages/Folder/Folder";
import Notes from "./pages/Notes/Notes";
import Note from "./pages/Note/Note";
import Dashboard from "./pages/Dashboard/Dashboard";
import {
	NewFolderForm,
	NewNoteForm,
	UpdateFolderForm,
	UpdateNoteForm,
} from "./pages/Forms/Forms";
import { Toaster } from "react-hot-toast";
import BottomMenubar from "./components/Bottombar/BottomMenubar";
import NotFound from "./pages/NotFound/NotFound";

function App(): ReactNode {
	return (
		<main>
			<Toaster />
			<Navbar />
			<BottomMenubar />
			<div className="main-container">
				<Sidebar />
				<Routes>
					<Route index element={<Home />} />
					<Route path="/dashboard" element={<Dashboard />} />

					<Route path="/upcoming" element={<Notes />} />
					<Route path="/completed" element={<Notes />} />
					<Route path="/ongoing" element={<Notes />} />

					<Route path="/folders" element={<Folders />} />
					<Route path="/folders/:id" element={<Folder />} />
					<Route path="/notes" element={<Notes />} />
					<Route path="/notes/main" element={<Notes />} />
					<Route path="/tasks/main" element={<Notes />} />
					<Route path="/notes/:id" element={<Note />} />

					<Route path="/archive" element={<Notes />} />

					<Route path="/new-folder" element={<NewFolderForm />} />
					<Route path="/new-note" element={<NewNoteForm />} />
					<Route path="/new-note/:folderId" element={<NewNoteForm />} />
					<Route path="/note/update/:id" element={<UpdateNoteForm />} />
					<Route path="/folder/update/:id" element={<UpdateFolderForm />} />

					<Route path="*" element={<NotFound />} />
				</Routes>
			</div>
		</main>
	);
}

export default App;
