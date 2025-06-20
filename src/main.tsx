import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import SettingsProvider from "./context/settings/settings.provider.tsx";
import DataProvider from "./context/data/data.provider.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<SettingsProvider>
				<DataProvider>
					<App />
				</DataProvider>
			</SettingsProvider>
		</BrowserRouter>
	</StrictMode>
);
