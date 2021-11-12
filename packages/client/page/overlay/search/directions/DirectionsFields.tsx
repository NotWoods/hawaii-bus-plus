import { Point } from '@hawaii-bus-plus/presentation';
import { Fragment, h, Ref } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import type { SearchResults } from '../../../../worker-search';
import { useSearch } from '../simple/useSearch';
import { DirectionsField } from './DirectionsField';

interface Props {
  depart?: Point;
  arrive?: Point;
  field: 'depart' | 'arrive';
  departRef?: Ref<HTMLInputElement>;
  arriveRef?: Ref<HTMLInputElement>;
  setDepart(depart: Point | undefined): void;
  setArrive(depart: Point | undefined): void;
  onSearchResults(results: FieldsSearchResults): void;
  onKeyDown?(event: KeyboardEvent): void;
}

export interface FieldsSearchResults {
  readonly field: 'depart' | 'arrive';
  readonly results: SearchResults;
}

function useAbortController() {
  const aborter = useRef<AbortController>();

  useEffect(() => {
    aborter.current = new AbortController();
    return () => aborter.current?.abort();
  }, []);

  return aborter;
}

export function DirectionsFields(props: Props) {
  const abort = useAbortController();
  const getSearchResults = useSearch();

  async function performSearch(field: 'depart' | 'arrive', value: string) {
    const results = await getSearchResults(value, abort.current!.signal);
    props.onSearchResults({ field, results });
  }

  return (
    <>
      <DirectionsField
        id="directionsDepart"
        aria-owns="searchResults_depart"
        inputRef={props.departRef}
        aria-expanded={props.field === 'depart'}
        label="Departing from"
        point={props.depart}
        onChange={props.setDepart}
        onSearch={(value) => performSearch('depart', value)}
        onKeyDown={props.onKeyDown}
      />
      <DirectionsField
        id="directionsArrive"
        aria-owns="searchResults_arrive"
        inputRef={props.arriveRef}
        aria-expanded={props.field === 'depart'}
        label="Arriving at"
        point={props.arrive}
        onChange={props.setArrive}
        onSearch={(value) => performSearch('arrive', value)}
        onKeyDown={props.onKeyDown}
      />
    </>
  );
}
