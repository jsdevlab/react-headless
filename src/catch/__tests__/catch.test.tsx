import { afterEach, beforeEach, describe, expect, it, rs } from '@rstest/core';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { Catch } from '../catch';

let restoreConsole: () => void;

beforeEach(() => {
  const spy = rs.spyOn(console, 'error').mockImplementation(() => {});
  restoreConsole = () => spy.mockRestore();
});

afterEach(() => {
  restoreConsole();
});

function Bomb(): ReactNode {
  throw new Error('boom');
}

let shouldThrow = false;

function Recoverable(): ReactNode {
  if (shouldThrow) {
    throw new Error('boom');
  }

  return <span>recovered</span>;
}

describe('Catch', () => {
  it('renders children when there is no error', () => {
    render(
      <Catch fallback={() => <span>error</span>}>
        <span>content</span>
      </Catch>,
    );

    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('renders fallback with the caught error', () => {
    render(
      <Catch
        fallback={(error) => (
          <span>{error instanceof Error ? error.message : String(error)}</span>
        )}
      >
        <Bomb />
      </Catch>,
    );

    expect(screen.getByText('boom')).toBeInTheDocument();
  });

  it('renders nothing on error without a fallback', () => {
    const { container } = render(
      <Catch>
        <Bomb />
      </Catch>,
    );

    expect(container.textContent).toBe('');
  });

  it('calls onError with the caught error', () => {
    const onError = rs.fn();

    render(
      <Catch onError={onError} fallback={() => <span>error</span>}>
        <Bomb />
      </Catch>,
    );

    expect(onError).toHaveBeenCalledWith(expect.any(Error), expect.anything());
  });

  it('resets from the fallback', () => {
    shouldThrow = true;

    render(
      <Catch
        fallback={(_, reset) => (
          <button type="button" onClick={reset}>
            retry
          </button>
        )}
      >
        <Recoverable />
      </Catch>,
    );

    expect(screen.getByText('retry')).toBeInTheDocument();

    shouldThrow = false;
    fireEvent.click(screen.getByText('retry'));

    expect(screen.getByText('recovered')).toBeInTheDocument();
  });

  it('resets when resetKeys are added', () => {
    shouldThrow = true;

    const { rerender } = render(
      <Catch fallback={() => <span>error</span>}>
        <Recoverable />
      </Catch>,
    );

    expect(screen.getByText('error')).toBeInTheDocument();

    shouldThrow = false;
    rerender(
      <Catch resetKeys={[0]} fallback={() => <span>error</span>}>
        <Recoverable />
      </Catch>,
    );

    expect(screen.getByText('recovered')).toBeInTheDocument();
  });

  it('resets when resetKeys length changes', () => {
    shouldThrow = true;

    const { rerender } = render(
      <Catch resetKeys={[0]} fallback={() => <span>error</span>}>
        <Recoverable />
      </Catch>,
    );

    expect(screen.getByText('error')).toBeInTheDocument();

    shouldThrow = false;
    rerender(
      <Catch resetKeys={[0, 1]} fallback={() => <span>error</span>}>
        <Recoverable />
      </Catch>,
    );

    expect(screen.getByText('recovered')).toBeInTheDocument();
  });

  it('resets when resetKeys change', () => {
    shouldThrow = true;

    const { rerender } = render(
      <Catch resetKeys={[0]} fallback={() => <span>error</span>}>
        <Recoverable />
      </Catch>,
    );

    expect(screen.getByText('error')).toBeInTheDocument();

    shouldThrow = false;
    rerender(
      <Catch resetKeys={[1]} fallback={() => <span>error</span>}>
        <Recoverable />
      </Catch>,
    );

    expect(screen.getByText('recovered')).toBeInTheDocument();
  });
});
