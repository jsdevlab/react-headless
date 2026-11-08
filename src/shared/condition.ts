import type { ReactNode } from 'react';
import { isFunction } from './is-function';

export type Condition = boolean | (() => boolean);

export type Conditions = readonly Condition[];

export interface ConditionsProps {
  conditions: Conditions;
  children: ReactNode;
  fallback?: ReactNode;
}

export function resolveCondition(condition: Condition): boolean {
  return isFunction(condition) ? condition() : condition;
}

export function allConditions(conditions: Conditions): boolean {
  return conditions.every(resolveCondition);
}

export function anyConditions(conditions: Conditions): boolean {
  return conditions.some(resolveCondition);
}
