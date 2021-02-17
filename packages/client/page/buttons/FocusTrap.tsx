import { ComponentChildren, createContext, h } from 'preact';
import { useContext, useState } from 'preact/hooks';

interface FocusTrapContext {
  trapped: boolean;
  setTrapped(trapped: boolean): void;
}

export const FocusTrapContext = createContext<FocusTrapContext>({
  trapped: false,
  setTrapped() {},
});

export function FocusTrapProvider(props: { children: ComponentChildren }) {
  const [trapped, setTrapped] = useState(false);
  return (
    <FocusTrapContext.Provider value={{ trapped, setTrapped }}>
      {props.children}
    </FocusTrapContext.Provider>
  );
}

export function useFocusTrapped() {
  const { trapped } = useContext(FocusTrapContext);
  return trapped;
}
