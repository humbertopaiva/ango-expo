import { createContext } from "react";
import { IProfileViewModel } from "../view-models/profile.view-model.interface";

export const ProfileContext = createContext<IProfileViewModel | undefined>(
  undefined
);
