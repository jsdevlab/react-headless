'use client';

import { type ErrorInfo, type ReactNode, Suspense, use } from 'react';
import { Catch } from '../catch/catch';

export interface AwaitProps<T> {
  promise: Promise<T>;
  children: (value: T) => ReactNode;
  fallback?: ReactNode;
  error?: (error: unknown, reset: () => void) => ReactNode;
  onError?: (error: unknown, info: ErrorInfo) => void;
}

interface ResolveProps<T> {
  promise: Promise<T>;
  children: (value: T) => ReactNode;
}

function Resolve<T>({ promise, children }: ResolveProps<T>): ReactNode {
  return children(use(promise));
}

/**
 * Reads a promise with React's `use` API and renders `children` with the
 * resolved value. Pending renders `fallback`; rejected promises use `error`
 * when provided, otherwise they propagate to the nearest error boundary.
 *
 * The `promise` should be stable across renders.
 */
export function Await<T>({
  promise,
  children,
  fallback = null,
  error,
  onError,
}: AwaitProps<T>): ReactNode {
  const content = (
    <Suspense fallback={fallback}>
      <Resolve promise={promise}>{children}</Resolve>
    </Suspense>
  );

  if (!error) {
    return content;
  }

  return (
    <Catch fallback={error} {...(onError ? { onError } : {})}>
      {content}
    </Catch>
  );
}
