import { describe, expect, it } from '@rstest/core';
import { render, screen } from '@testing-library/react';
import { Range, Repeat } from '../repeat';

function item(value: number) {
  return <span data-testid="item">{value}</span>;
}

describe('Repeat', () => {
  it('renders children times with zero-based indexes', () => {
    render(
      <Repeat times={3}>
        {(index) => <span data-testid="item">{index}</span>}
      </Repeat>,
    );

    expect(
      screen.getAllByTestId('item').map((node) => node.textContent),
    ).toEqual(['0', '1', '2']);
  });

  it('truncates fractional times', () => {
    render(<Repeat times={2.9}>{(index) => item(index)}</Repeat>);

    expect(screen.getAllByTestId('item')).toHaveLength(2);
  });

  it('renders fallback for zero or negative times', () => {
    const { container } = render(
      <>
        <Repeat times={0} fallback={<span>zero</span>}>
          {() => null}
        </Repeat>
        <Repeat times={-2} fallback={<span>negative</span>}>
          {() => null}
        </Repeat>
      </>,
    );

    expect(container.textContent).toBe('zeronegative');
  });

  it('renders fallback for non-finite times', () => {
    const { container } = render(
      <>
        <Repeat times={Number.NaN} fallback={<span>nan</span>}>
          {() => null}
        </Repeat>
        <Repeat
          times={Number.POSITIVE_INFINITY}
          fallback={<span>infinite</span>}
        >
          {() => null}
        </Repeat>
      </>,
    );

    expect(container.textContent).toBe('naninfinite');
  });
});

describe('Range', () => {
  it('renders ascending values excluding to', () => {
    render(
      <Range from={1} to={4}>
        {(value) => item(value)}
      </Range>,
    );

    expect(
      screen.getAllByTestId('item').map((node) => node.textContent),
    ).toEqual(['1', '2', '3']);
  });

  it('supports a positive step', () => {
    render(
      <Range from={0} to={6} step={2}>
        {(value) => item(value)}
      </Range>,
    );

    expect(
      screen.getAllByTestId('item').map((node) => node.textContent),
    ).toEqual(['0', '2', '4']);
  });

  it('supports a negative step', () => {
    render(
      <Range from={5} to={1} step={-1}>
        {(value) => item(value)}
      </Range>,
    );

    expect(
      screen.getAllByTestId('item').map((node) => node.textContent),
    ).toEqual(['5', '4', '3', '2']);
  });

  it('renders fallback for empty ranges', () => {
    render(
      <Range from={5} to={5} fallback={<span>empty</span>}>
        {(value) => item(value)}
      </Range>,
    );

    expect(screen.getByText('empty')).toBeInTheDocument();
  });

  it('renders fallback for invalid steps', () => {
    const { container } = render(
      <>
        <Range from={0} to={3} step={0} fallback={<span>zero-step</span>}>
          {(value) => item(value)}
        </Range>
        <Range
          from={0}
          to={3}
          step={Number.NaN}
          fallback={<span>nan-step</span>}
        >
          {(value) => item(value)}
        </Range>
      </>,
    );

    expect(container.textContent).toBe('zero-stepnan-step');
  });

  it('renders fallback for non-finite bounds', () => {
    const { container } = render(
      <>
        <Range from={Number.NaN} to={3} fallback={<span>nan-from</span>}>
          {(value) => item(value)}
        </Range>
        <Range
          from={0}
          to={Number.POSITIVE_INFINITY}
          fallback={<span>infinite-to</span>}
        >
          {(value) => item(value)}
        </Range>
      </>,
    );

    expect(container.textContent).toBe('nan-frominfinite-to');
  });
});
