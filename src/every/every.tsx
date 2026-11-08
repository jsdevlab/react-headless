import type { ReactNode } from 'react';
import {
  allConditions,
  anyConditions,
  type ConditionsProps,
} from '../shared/condition';

export function Every({
  conditions,
  children,
  fallback = null,
}: ConditionsProps): ReactNode {
  return allConditions(conditions) ? children : fallback;
}

export function None({
  conditions,
  children,
  fallback = null,
}: ConditionsProps): ReactNode {
  return anyConditions(conditions) ? fallback : children;
}
