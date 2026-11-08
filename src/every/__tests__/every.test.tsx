import { describe, expect, it } from '@rstest/core';
import { render, screen } from '@testing-library/react';
import { Every, None } from '../every';

describe('Every', () => {
  it('renders children when all conditions are true', () => {
    render(
      <Every conditions={[true, true, true]}>
        <span>all good</span>
      </Every>,
    );

    expect(screen.getByText('all good')).toBeInTheDocument();
  });

  it('renders fallback when any condition is false', () => {
    render(
      <Every conditions={[true, false, true]} fallback={<span>not all</span>}>
        <span>all good</span>
      </Every>,
    );

    expect(screen.getByText('not all')).toBeInTheDocument();
    expect(screen.queryByText('all good')).not.toBeInTheDocument();
  });

  it('renders fallback when first condition is false', () => {
    render(
      <Every conditions={[false, true, true]} fallback={<span>failed</span>}>
        <span>passed</span>
      </Every>,
    );

    expect(screen.getByText('failed')).toBeInTheDocument();
  });

  it('evaluates function conditions', () => {
    render(
      <Every conditions={[() => true, () => true]}>
        <span>functions ok</span>
      </Every>,
    );

    expect(screen.getByText('functions ok')).toBeInTheDocument();
  });

  it('evaluates mixed bool and function conditions', () => {
    render(
      <Every
        conditions={[true, () => false, true]}
        fallback={<span>mixed fail</span>}
      >
        <span>mixed pass</span>
      </Every>,
    );

    expect(screen.getByText('mixed fail')).toBeInTheDocument();
  });

  it('renders nothing when false and no fallback', () => {
    const { container } = render(
      <Every conditions={[false]}>
        <span>hidden</span>
      </Every>,
    );

    expect(container.textContent).toBe('');
  });
});

describe('None', () => {
  it('renders children when all conditions are false', () => {
    render(
      <None conditions={[false, false, false]}>
        <span>none true</span>
      </None>,
    );

    expect(screen.getByText('none true')).toBeInTheDocument();
  });

  it('renders fallback when any condition is true', () => {
    render(
      <None conditions={[false, true, false]} fallback={<span>some true</span>}>
        <span>none true</span>
      </None>,
    );

    expect(screen.getByText('some true')).toBeInTheDocument();
    expect(screen.queryByText('none true')).not.toBeInTheDocument();
  });

  it('evaluates function conditions', () => {
    render(
      <None conditions={[() => false, () => false]}>
        <span>functions false</span>
      </None>,
    );

    expect(screen.getByText('functions false')).toBeInTheDocument();
  });
});
