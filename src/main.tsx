import { createContext, useContext } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import type { IFirebaseContextType } from "./firebase/types.tsx";
import { auth, firestore } from "./firebase/config.tsx";

export const Context = createContext<IFirebaseContextType | null>(null);

createRoot(document.getElementById("root")!).render(
  <Context.Provider
    value={{
      auth,
      firestore,
    }}
  >
    <App />
  </Context.Provider>,
);
