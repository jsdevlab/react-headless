import type { ReactNode } from 'react';
import { type Condition, resolveCondition } from '../shared/condition';
import { Show } from '../show/show';

export interface UnlessProps {
  when: Condition;
  children: ReactNode | ((value: boolean) => ReactNode);
  fallback?: ReactNode | (() => ReactNode);
}

export function Unless({ when, children, fallback }: UnlessProps): ReactNode {
  return (
    <Show when={!resolveCondition(when)} fallback={fallback}>
      {children}
    </Show>
  );
}
