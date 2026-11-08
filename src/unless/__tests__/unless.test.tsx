import { describe, expect, it } from '@rstest/core';
import { render, screen } from '@testing-library/react';
import { Unless } from '../unless';

describe('Unless', () => {
  it('renders children when when is false', () => {
    render(
      <Unless when={false}>
        <span>shown</span>
      </Unless>,
    );

    expect(screen.getByText('shown')).toBeInTheDocument();
  });

  it('does not render children when when is true', () => {
    const { container } = render(
      <Unless when={true}>
        <span>hidden</span>
      </Unless>,
    );

    expect(screen.queryByText('hidden')).not.toBeInTheDocument();
    expect(container.textContent).toBe('');
  });

  it('renders fallback when when is true', () => {
    render(
      <Unless when={true} fallback={<span>fallback shown</span>}>
        <span>main hidden</span>
      </Unless>,
    );

    expect(screen.getByText('fallback shown')).toBeInTheDocument();
    expect(screen.queryByText('main hidden')).not.toBeInTheDocument();
  });

  it('evaluates function when', () => {
    render(
      <Unless when={() => false}>
        <span>function false</span>
      </Unless>,
    );

    expect(screen.getByText('function false')).toBeInTheDocument();
  });

  it('evaluates function when that returns true', () => {
    render(
      <Unless when={() => true} fallback={<span>nope</span>}>
        <span>function true</span>
      </Unless>,
    );

    expect(screen.getByText('nope')).toBeInTheDocument();
    expect(screen.queryByText('function true')).not.toBeInTheDocument();
  });

  it('passes negated condition to function children', () => {
    render(
      <Unless when={false}>{(value) => <span>{String(value)}</span>}</Unless>,
    );

    expect(screen.getByText('true')).toBeInTheDocument();
  });

  it('calls function fallback when when is true', () => {
    render(
      <Unless when={true} fallback={() => <span>dynamic fallback</span>}>
        <span>main</span>
      </Unless>,
    );

    expect(screen.getByText('dynamic fallback')).toBeInTheDocument();
  });

  it('does not render fallback when when is false', () => {
    render(
      <Unless when={false} fallback={<span>should not show</span>}>
        <span>shown</span>
      </Unless>,
    );

    expect(screen.getByText('shown')).toBeInTheDocument();
    expect(screen.queryByText('should not show')).not.toBeInTheDocument();
  });

  it('renders nothing when when is true and no fallback', () => {
    const { container } = render(
      <Unless when={true}>
        <span>hidden</span>
      </Unless>,
    );

    expect(container.textContent).toBe('');
  });
});
