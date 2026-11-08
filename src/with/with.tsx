import type { ReactNode } from 'react';
import { isFunction } from '../shared/is-function';

export interface WithProps<T> {
  value: T | null | undefined | false;
  children: ReactNode | ((value: NonNullable<T>) => ReactNode);
  fallback?: ReactNode | (() => ReactNode);
}

function isPresent<T>(
  value: T | null | undefined | false,
): value is NonNullable<T> {
  return value !== false && value !== null && value !== undefined;
}

/**
 * Renders children when `value` is present, and narrows the value type for a
 * render function. Unlike a truthiness check, `0` and `''` are present.
 */
export function With<T>({
  value,
  children,
  fallback,
}: WithProps<T>): ReactNode {
  if (!isPresent(value)) {
    return isFunction(fallback) ? fallback() : fallback;
  }

  return isFunction(children) ? children(value) : children;
}
