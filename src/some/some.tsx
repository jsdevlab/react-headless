import type { ReactNode } from 'react';
import { anyConditions, type ConditionsProps } from '../shared/condition';

export function Some({
  conditions,
  children,
  fallback = null,
}: ConditionsProps): ReactNode {
  return anyConditions(conditions) ? children : fallback;
}
