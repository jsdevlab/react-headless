'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

export interface CatchProps {
  children: ReactNode;
  fallback?: (error: unknown, reset: () => void) => ReactNode;
  onError?: (error: unknown, info: ErrorInfo) => void;
  resetKeys?: readonly unknown[];
}

interface CatchState {
  error: unknown;
  hasError: boolean;
}

function haveSameKeys(
  a: readonly unknown[] | undefined,
  b: readonly unknown[] | undefined,
): boolean {
  if (a === b) {
    return true;
  }

  if (!a || !b || a.length !== b.length) {
    return false;
  }

  return a.every((value, index) => Object.is(value, b[index]));
}

/**
 * A headless error boundary. The fallback receives the caught error and a
 * reset callback.
 */
export class Catch extends Component<CatchProps, CatchState> {
  override state: CatchState = { error: null, hasError: false };

  static getDerivedStateFromError(error: unknown): CatchState {
    return { error, hasError: true };
  }

  override componentDidCatch(error: unknown, info: ErrorInfo): void {
    this.props.onError?.(error, info);
  }

  override componentDidUpdate(prevProps: CatchProps): void {
    if (
      this.state.hasError &&
      !haveSameKeys(prevProps.resetKeys, this.props.resetKeys)
    ) {
      this.reset();
    }
  }

  private readonly reset = (): void => {
    this.setState({ error: null, hasError: false });
  };

  override render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return this.props.fallback
      ? this.props.fallback(this.state.error, this.reset)
      : null;
  }
}
