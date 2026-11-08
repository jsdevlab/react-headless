import type { ReactNode } from 'react';
import { Await } from '../../await/await';
import { Range, Repeat } from '../../repeat/repeat';
import { With } from '../with';

interface User {
  name: string;
}

declare const user: User | null;
declare const userPromise: Promise<User>;

export const withValue: ReactNode = (
  <With value={user}>{(value) => value.name}</With>
);

export const wrongWithValue: ReactNode = (
  // @ts-expect-error -- the render function receives a User, not a string
  <With value={user}>{(value: string) => value}</With>
);

export const awaitValue: ReactNode = (
  <Await promise={userPromise}>{(value) => value.name}</Await>
);

export const wrongAwaitValue: ReactNode = (
  // @ts-expect-error -- the render function receives a User, not a string
  <Await promise={userPromise}>{(value: string) => value}</Await>
);

export const repeatIndex: ReactNode = (
  <Repeat times={2}>{(index) => String(index)}</Repeat>
);

export const rangeValue: ReactNode = (
  <Range from={1} to={3}>
    {(value) => String(value)}
  </Range>
);
