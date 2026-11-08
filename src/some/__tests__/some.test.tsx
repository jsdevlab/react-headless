import { describe, expect, it } from '@rstest/core';
import { render, screen } from '@testing-library/react';
import { Some } from '../some';

describe('Some', () => {
  it('renders children when at least one condition is true', () => {
    render(
      <Some conditions={[false, false, true]}>
        <span>at least one</span>
      </Some>,
    );

    expect(screen.getByText('at least one')).toBeInTheDocument();
  });

  it('renders children when first condition is true', () => {
    render(
      <Some conditions={[true, false, false]}>
        <span>first ok</span>
      </Some>,
    );

    expect(screen.getByText('first ok')).toBeInTheDocument();
  });

  it('renders fallback when all conditions are false', () => {
    render(
      <Some conditions={[false, false, false]} fallback={<span>none</span>}>
        <span>some true</span>
      </Some>,
    );

    expect(screen.getByText('none')).toBeInTheDocument();
    expect(screen.queryByText('some true')).not.toBeInTheDocument();
  });

  it('evaluates function conditions', () => {
    render(
      <Some conditions={[() => false, () => true]}>
        <span>func match</span>
      </Some>,
    );

    expect(screen.getByText('func match')).toBeInTheDocument();
  });

  it('evaluates mixed bool and function conditions', () => {
    render(
      <Some conditions={[false, () => false, true]}>
        <span>mixed pass</span>
      </Some>,
    );

    expect(screen.getByText('mixed pass')).toBeInTheDocument();
  });

  it('renders nothing when all false and no fallback', () => {
    const { container } = render(
      <Some conditions={[false, false]}>
        <span>hidden</span>
      </Some>,
    );

    expect(container.textContent).toBe('');
  });
});
