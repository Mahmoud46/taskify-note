import { createContext } from "react";
import type { ISettingsContext } from "../../interface/Context";

const SettingsContext = createContext<ISettingsContext | undefined>(undefined);

export default SettingsContext;
