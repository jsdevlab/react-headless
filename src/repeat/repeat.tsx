import { Fragment, type ReactNode } from 'react';

export interface RepeatProps {
  times: number;
  children: (index: number) => ReactNode;
  fallback?: ReactNode;
}

/**
 * Renders `children` `times` times with a zero-based index. Non-finite and
 * non-positive values render `fallback`.
 */
export function Repeat({
  times,
  children,
  fallback = null,
}: RepeatProps): ReactNode {
  const count = Number.isFinite(times) ? Math.max(0, Math.trunc(times)) : 0;

  if (count === 0) {
    return fallback;
  }

  return Array.from({ length: count }, (_, index) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: generated positions are stable
    <Fragment key={index}>{children(index)}</Fragment>
  ));
}

export interface RangeProps {
  from: number;
  to: number;
  step?: number;
  children: (value: number) => ReactNode;
  fallback?: ReactNode;
}

/**
 * Renders values from `from` (inclusive) to `to` (exclusive), advancing by
 * `step`. A negative step iterates downwards. Empty or invalid ranges render
 * `fallback`.
 */
export function Range({
  from,
  to,
  step = 1,
  children,
  fallback = null,
}: RangeProps): ReactNode {
  if (
    !Number.isFinite(from) ||
    !Number.isFinite(to) ||
    !Number.isFinite(step) ||
    step === 0
  ) {
    return fallback;
  }

  const values: number[] = [];

  if (step > 0) {
    for (let value = from; value < to; value += step) {
      values.push(value);
    }
  } else {
    for (let value = from; value > to; value += step) {
      values.push(value);
    }
  }

  if (values.length === 0) {
    return fallback;
  }

  return values.map((value) => (
    <Fragment key={value}>{children(value)}</Fragment>
  ));
}
