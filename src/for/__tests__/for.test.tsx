import { describe, expect, it } from '@rstest/core';
import { render, screen } from '@testing-library/react';
import { For } from '../for';

describe('For', () => {
  it('renders children for each item in the array', () => {
    const items = ['a', 'b', 'c'];
    render(
      <ul>
        <For each={items}>{(item, index) => <li key={index}>{item}</li>}</For>
      </ul>,
    );

    expect(screen.getByText('a')).toBeInTheDocument();
    expect(screen.getByText('b')).toBeInTheDocument();
    expect(screen.getByText('c')).toBeInTheDocument();
  });

  it('renders with index parameter', () => {
    const items = ['x', 'y'];
    render(
      <ul>
        <For each={items}>
          {(item, index) => (
            <li key={index}>
              {index}:{item}
            </li>
          )}
        </For>
      </ul>,
    );

    expect(screen.getByText('0:x')).toBeInTheDocument();
    expect(screen.getByText('1:y')).toBeInTheDocument();
  });

  it('filters items when filter prop is provided', () => {
    const items: number[] = [1, 2, 3, 4, 5];
    render(
      <ul>
        <For each={items} filter={(item) => item % 2 === 0}>
          {(item) => <li key={item}>{item}</li>}
        </For>
      </ul>,
    );

    expect(screen.queryByText('1')).not.toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.queryByText('3')).not.toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.queryByText('5')).not.toBeInTheDocument();
  });

  it('filter receives index parameter', () => {
    const items = [10, 20, 30];
    render(
      <ul>
        <For each={items} filter={(_, index) => index !== 1}>
          {(item, index) => <li key={index}>{item}</li>}
        </For>
      </ul>,
    );

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.queryByText('20')).not.toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('shows fallback when each is an empty array', () => {
    render(
      <For each={[]} fallback={<span>No items</span>}>
        {(item) => <div>{item}</div>}
      </For>,
    );

    expect(screen.getByText('No items')).toBeInTheDocument();
  });

  it('renders nothing when empty and no fallback', () => {
    const { container } = render(
      <For each={[]}>{(item) => <div>{item}</div>}</For>,
    );

    expect(container.textContent).toBe('');
  });

  it('renders nothing when all items are filtered out without a fallback', () => {
    const { container } = render(
      <For each={[1, 2, 3]} filter={() => false}>
        {(item) => <div>{item}</div>}
      </For>,
    );

    expect(container.textContent).toBe('');
  });

  it('shows fallback when all items are filtered out', () => {
    render(
      <For each={[1, 2, 3]} filter={() => false} fallback={<span>empty</span>}>
        {(item) => <div>{item}</div>}
      </For>,
    );

    expect(screen.getByText('empty')).toBeInTheDocument();
  });

  it('supports keyBy for item keys', () => {
    render(
      <ul>
        <For each={['a', 'b']} keyBy={(item) => item}>
          {(item) => <li>{item}</li>}
        </For>
      </ul>,
    );

    expect(screen.getByText('a')).toBeInTheDocument();
    expect(screen.getByText('b')).toBeInTheDocument();
  });

  it('works with readonly arrays', () => {
    const items: readonly string[] = ['readonly-a', 'readonly-b'] as const;
    render(
      <ul>
        <For each={items}>{(item) => <li key={item}>{item}</li>}</For>
      </ul>,
    );

    expect(screen.getByText('readonly-a')).toBeInTheDocument();
    expect(screen.getByText('readonly-b')).toBeInTheDocument();
  });
});
