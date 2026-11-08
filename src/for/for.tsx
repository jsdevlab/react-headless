import { Fragment, type Key, type ReactNode } from 'react';

export interface ForProps<T> {
  each: readonly T[];
  children: (item: T, index: number) => ReactNode;
  filter?: (item: T, index: number) => boolean;
  fallback?: ReactNode;
  keyBy?: (item: T, index: number) => Key;
}

export function For<T>({
  each,
  children,
  filter,
  fallback = null,
  keyBy,
}: ForProps<T>) {
  const items = filter ? each.filter(filter) : each;

  if (items.length === 0) {
    return fallback;
  }

  return items.map((item, index) => (
    <Fragment key={keyBy ? keyBy(item, index) : index}>
      {children(item, index)}
    </Fragment>
  ));
}
