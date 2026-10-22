import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";

type Draft = {
  body: string;
  selection: { start: number; end: number };
  scrollY: number;
};
const empty: Draft = { body: "", selection: { start: 0, end: 0 }, scrollY: 0 };
const Context = createContext<{
  draft: Draft;
  update: (patch: Partial<Draft>) => void;
  clear: () => void;
} | null>(null);
export function WritingSessionProvider({ children }: PropsWithChildren) {
  const [draft, setDraft] = useState(empty);
  return (
    <Context.Provider
      value={{
        draft,
        update: (patch) => setDraft((previous) => ({ ...previous, ...patch })),
        clear: () => setDraft(empty),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useWritingSession() {
  const value = useContext(Context);
  if (!value) throw new Error("WritingSessionProvider is required");
  return value;
}
