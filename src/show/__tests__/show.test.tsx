import { describe, expect, it } from '@rstest/core';
import { render, screen } from '@testing-library/react';
import { Show } from '../show';

describe('Show', () => {
  it('renders children when when is true', () => {
    render(
      <Show when={true}>
        <span>visible</span>
      </Show>,
    );

    expect(screen.getByText('visible')).toBeInTheDocument();
  });

  it('does not render children when when is false', () => {
    const { container } = render(
      <Show when={false}>
        <span>should not render</span>
      </Show>,
    );

    expect(screen.queryByText('should not render')).not.toBeInTheDocument();
    expect(container.textContent).toBe('');
  });

  it('renders fallback when when is false', () => {
    render(
      <Show when={false} fallback={<span>fallback content</span>}>
        <span>main content</span>
      </Show>,
    );

    expect(screen.getByText('fallback content')).toBeInTheDocument();
    expect(screen.queryByText('main content')).not.toBeInTheDocument();
  });

  it('evaluates function when', () => {
    render(
      <Show when={() => true}>
        <span>function true</span>
      </Show>,
    );

    expect(screen.getByText('function true')).toBeInTheDocument();
  });

  it('evaluates function when that returns false', () => {
    render(
      <Show when={() => false} fallback={<span>nope</span>}>
        <span>function false</span>
      </Show>,
    );

    expect(screen.getByText('nope')).toBeInTheDocument();
    expect(screen.queryByText('function false')).not.toBeInTheDocument();
  });

  it('passes condition value to function children', () => {
    render(<Show when={true}>{(value) => <span>{String(value)}</span>}</Show>);

    expect(screen.getByText('true')).toBeInTheDocument();
  });

  it('calls function fallback when when is false', () => {
    render(
      <Show when={false} fallback={() => <span>dynamic fallback</span>}>
        <span>main</span>
      </Show>,
    );

    expect(screen.getByText('dynamic fallback')).toBeInTheDocument();
  });

  it('does not render fallback when when is true', () => {
    render(
      <Show when={true} fallback={<span>should not show</span>}>
        <span>shown</span>
      </Show>,
    );

    expect(screen.getByText('shown')).toBeInTheDocument();
    expect(screen.queryByText('should not show')).not.toBeInTheDocument();
  });

  it('renders nothing when when is false and no fallback', () => {
    const { container } = render(
      <Show when={false}>
        <span>hidden</span>
      </Show>,
    );

    expect(container.textContent).toBe('');
  });
});
