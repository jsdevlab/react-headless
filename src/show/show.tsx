import type { ReactNode } from 'react';
import { type Condition, resolveCondition } from '../shared/condition';
import { isFunction } from '../shared/is-function';

export interface ShowProps {
  when: Condition;
  children: ReactNode | ((value: boolean) => ReactNode);
  fallback?: ReactNode | (() => ReactNode);
}

export function Show({ when, children, fallback }: ShowProps): ReactNode {
  const condition = resolveCondition(when);

  if (!condition) {
    return isFunction(fallback) ? fallback() : fallback;
  }

  return isFunction(children) ? children(condition) : children;
}

export const When = Show;
