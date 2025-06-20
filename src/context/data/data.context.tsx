import { createContext } from "react";
import type { IDataContext } from "../../interface/Context";

export const DataContext = createContext<IDataContext | undefined>(undefined);
