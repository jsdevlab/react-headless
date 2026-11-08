import { describe, expect, it } from '@rstest/core';
import { render, screen } from '@testing-library/react';
import { Not } from '../not';

describe('Not', () => {
  it('renders children when condition is false', () => {
    render(
      <Not condition={false}>
        <span>shown</span>
      </Not>,
    );

    expect(screen.getByText('shown')).toBeInTheDocument();
  });

  it('does not render children when condition is true', () => {
    const { container } = render(
      <Not condition={true}>
        <span>hidden</span>
      </Not>,
    );

    expect(screen.queryByText('hidden')).not.toBeInTheDocument();
    expect(container.textContent).toBe('');
  });

  it('renders fallback when condition is true', () => {
    render(
      <Not condition={true} fallback={<span>fallback</span>}>
        <span>main</span>
      </Not>,
    );

    expect(screen.getByText('fallback')).toBeInTheDocument();
    expect(screen.queryByText('main')).not.toBeInTheDocument();
  });

  it('evaluates function condition (false → shows children)', () => {
    render(
      <Not condition={() => false}>
        <span>func false</span>
      </Not>,
    );

    expect(screen.getByText('func false')).toBeInTheDocument();
  });

  it('evaluates function condition (true → shows fallback)', () => {
    render(
      <Not condition={() => true} fallback={<span>nope</span>}>
        <span>func true</span>
      </Not>,
    );

    expect(screen.getByText('nope')).toBeInTheDocument();
    expect(screen.queryByText('func true')).not.toBeInTheDocument();
  });

  it('renders nothing when condition is true and no fallback', () => {
    const { container } = render(
      <Not condition={true}>
        <span>hidden</span>
      </Not>,
    );

    expect(container.textContent).toBe('');
  });
});
