import { createContext, Dispatch } from 'react';
import { linkAction } from './action';

export type LinkContext = Dispatch<typeof linkAction | unknown>;

export const LinkContext = createContext<LinkContext>(() => {});
