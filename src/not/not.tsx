import type { ReactNode } from 'react';
import type { Condition } from '../shared/condition';
import { Unless } from '../unless/unless';

export interface NotProps {
  condition: Condition;
  children: ReactNode;
  fallback?: ReactNode;
}

export function Not({ condition, children, fallback }: NotProps): ReactNode {
  return (
    <Unless when={condition} fallback={fallback}>
      {children}
    </Unless>
  );
}
