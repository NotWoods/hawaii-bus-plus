import { createContext, h, ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';
import type { RouteDetails } from '../../../worker-info/route-details';

interface RouteDetailContext {
  details?: RouteDetails;
  directionId: number;
  setDetails(details: RouteDetails | undefined): void;
  switchDirection?(): void;
}

export const RouteDetailContext = createContext<RouteDetailContext>({
  directionId: 0,
  setDetails() {},
});

function validIndexes(directions?: readonly unknown[]) {
  const result: number[] = [];
  directions?.forEach((_, i) => result.push(i));
  return result;
}

export function RouteDetailProvider(props: { children: ComponentChildren }) {
  const [details, setDetailState] = useState<RouteDetails | undefined>();

  const directionIds = validIndexes(details?.directions);
  const [selectedIdIndex, setSelectedIdIndex] = useState(directionIds[0]);
  const directionId = directionIds[selectedIdIndex % directionIds.length] || 0;

  function setDetails(details: RouteDetails | undefined) {
    setDetailState(details);
    setSelectedIdIndex(0);
  }

  function switchDirection() {
    setSelectedIdIndex(selectedIdIndex + 1);
  }

  return (
    <RouteDetailContext.Provider
      value={{
        details,
        directionId,
        setDetails,
        switchDirection: directionIds.length > 0 ? switchDirection : undefined,
      }}
    >
      {props.children}
    </RouteDetailContext.Provider>
  );
}
