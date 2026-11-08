import { afterEach, beforeEach, describe, expect, it, rs } from '@rstest/core';
import { act, render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { Catch } from '../../catch/catch';
import { Await } from '../await';

async function renderAsync(element: ReactElement) {
  await act(async () => {
    render(element);
  });
}

let restoreConsole: () => void;

beforeEach(() => {
  const spy = rs.spyOn(console, 'error').mockImplementation(() => {});
  restoreConsole = () => spy.mockRestore();
});

afterEach(() => {
  restoreConsole();
});

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, reject, resolve };
}

describe('Await', () => {
  it('renders the resolved value', async () => {
    await renderAsync(
      <Await promise={Promise.resolve('Ada')}>
        {(value) => <span>{value}</span>}
      </Await>,
    );

    expect(screen.getByText('Ada')).toBeInTheDocument();
  });

  it('renders fallback while pending', async () => {
    const pending = deferred<string>();

    await renderAsync(
      <Await promise={pending.promise} fallback={<span>loading</span>}>
        {(value) => <span>{value}</span>}
      </Await>,
    );

    expect(screen.getByText('loading')).toBeInTheDocument();

    await act(async () => {
      pending.resolve('Ada');
    });

    expect(await screen.findByText('Ada')).toBeInTheDocument();
  });

  it('renders the error fallback when rejected', async () => {
    const pending = deferred<string>();

    await renderAsync(
      <Await
        promise={pending.promise}
        fallback={<span>loading</span>}
        error={(error) => (
          <span>
            error: {error instanceof Error ? error.message : String(error)}
          </span>
        )}
      >
        {(value) => <span>{value}</span>}
      </Await>,
    );

    await act(async () => {
      pending.reject(new Error('boom'));
    });

    expect(await screen.findByText('error: boom')).toBeInTheDocument();
  });

  it('calls onError when rejected', async () => {
    const pending = deferred<string>();
    const onError = rs.fn();

    await renderAsync(
      <Await
        promise={pending.promise}
        error={() => <span>error</span>}
        onError={onError}
      >
        {() => null}
      </Await>,
    );

    await act(async () => {
      pending.reject(new Error('boom'));
    });

    expect(await screen.findByText('error')).toBeInTheDocument();
    expect(onError).toHaveBeenCalled();
  });

  it('propagates rejection without an error fallback', async () => {
    const pending = deferred<string>();

    await renderAsync(
      <Catch fallback={() => <span>outer error</span>}>
        <Await promise={pending.promise}>{() => null}</Await>
      </Catch>,
    );

    await act(async () => {
      pending.reject(new Error('boom'));
    });

    expect(await screen.findByText('outer error')).toBeInTheDocument();
  });
});
