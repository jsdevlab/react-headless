import { describe, expect, it } from '@rstest/core';
import { render, screen } from '@testing-library/react';
import { Case, createSwitch, Default, Switch } from '../switch';

describe('Switch', () => {
  it('renders the matching case', () => {
    render(
      <Switch value="b">
        <Case value="a">got-a</Case>
        <Case value="b">got-b</Case>
        <Case value="c">got-c</Case>
      </Switch>,
    );

    expect(screen.getByText('got-b')).toBeInTheDocument();
    expect(screen.queryByText('got-a')).not.toBeInTheDocument();
    expect(screen.queryByText('got-c')).not.toBeInTheDocument();
  });

  it('renders the first matching case only', () => {
    render(
      <Switch value="a">
        <Case value="a">first-a</Case>
        <Case value="a">second-a</Case>
      </Switch>,
    );

    expect(screen.getByText('first-a')).toBeInTheDocument();
    expect(screen.queryByText('second-a')).not.toBeInTheDocument();
  });

  it('renders default when no case matches', () => {
    render(
      <Switch value="z">
        <Case value="a">got-a</Case>
        <Case value="b">got-b</Case>
        <Default>no-match</Default>
      </Switch>,
    );

    expect(screen.getByText('no-match')).toBeInTheDocument();
  });

  it('matches array value (any element match)', () => {
    render(
      <Switch value="b">
        <Case value={['a', 'b', 'c']}>multi-match</Case>
        <Default>default</Default>
      </Switch>,
    );

    expect(screen.getByText('multi-match')).toBeInTheDocument();
  });

  it('matches with function predicate', () => {
    render(
      <Switch value={5}>
        <Case value={(v: number) => v > 3}>greater-than-3</Case>
        <Default>default</Default>
      </Switch>,
    );

    expect(screen.getByText('greater-than-3')).toBeInTheDocument();
  });

  it('function predicate that returns false does not match', () => {
    render(
      <Switch value={2}>
        <Case value={(v: number) => v > 3}>greater-than-3</Case>
        <Default>default</Default>
      </Switch>,
    );

    expect(screen.getByText('default')).toBeInTheDocument();
  });

  it('renders multiple matches in multiple mode', () => {
    render(
      <Switch value="a" multiple={true}>
        <Case value="a">first-a</Case>
        <Case value="a">second-a</Case>
      </Switch>,
    );

    expect(screen.getByText(/first-a/)).toBeInTheDocument();
    expect(screen.getByText(/second-a/)).toBeInTheDocument();
  });

  it('renders nothing when no match and no default', () => {
    const { container } = render(
      <Switch value="z">
        <Case value="a">got-a</Case>
      </Switch>,
    );

    expect(container.textContent).toBe('');
  });

  it('passes matched value to function children', () => {
    render(
      <Switch value={42}>
        <Case value={42}>{(v: number) => <span>matched: {v}</span>}</Case>
      </Switch>,
    );

    expect(screen.getByText('matched: 42')).toBeInTheDocument();
  });

  it('renders function default children', () => {
    render(
      <Switch value="z">
        <Case value="a">got-a</Case>
        <Default>{() => <span>dynamic default</span>}</Default>
      </Switch>,
    );

    expect(screen.getByText('dynamic default')).toBeInTheDocument();
  });

  it('only renders first default when multiple defaults exist', () => {
    render(
      <Switch value="z">
        <Case value="a">got-a</Case>
        <Default>first-default</Default>
        <Default>second-default</Default>
      </Switch>,
    );

    expect(screen.getByText('first-default')).toBeInTheDocument();
    expect(screen.queryByText('second-default')).not.toBeInTheDocument();
  });

  it('does not render default when a case matches', () => {
    render(
      <Switch value="a">
        <Case value="a">matched</Case>
        <Default>default</Default>
      </Switch>,
    );

    expect(screen.getByText('matched')).toBeInTheDocument();
    expect(screen.queryByText('default')).not.toBeInTheDocument();
  });

  it('renders case and default markers as null outside a switch', () => {
    const { container } = render(
      <>
        <Case value="a">case</Case>
        <Default>default</Default>
      </>,
    );

    expect(container.textContent).toBe('');
  });
});

describe('createSwitch', () => {
  type Status = 'active' | 'idle' | 'error';

  it('renders the matching case', () => {
    const { Switch, Case, Default } = createSwitch<Status>();

    render(
      <Switch value="active">
        <Case value="active">Active</Case>
        <Case value="idle">Idle</Case>
        <Default>Unknown</Default>
      </Switch>,
    );

    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.queryByText('Idle')).not.toBeInTheDocument();
  });

  it('renders default when no case matches', () => {
    const { Switch, Case, Default } = createSwitch<Status>();

    render(
      <Switch value="error">
        <Case value="active">Active</Case>
        <Case value="idle">Idle</Case>
        <Default>Unknown</Default>
      </Switch>,
    );

    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('first match wins when multiple cases match the same value', () => {
    const { Switch, Case } = createSwitch<string>();

    render(
      <Switch value="a">
        <Case value="a">first</Case>
        <Case value="a">second</Case>
      </Switch>,
    );

    expect(screen.getByText('first')).toBeInTheDocument();
    expect(screen.queryByText('second')).not.toBeInTheDocument();
  });

  it('renders multiple matches in multiple mode', () => {
    const { Switch, Case } = createSwitch<string>();

    render(
      <Switch value="a" multiple={true}>
        <Case value="a">first-a</Case>
        <Case value="a">second-a</Case>
      </Switch>,
    );

    expect(screen.getByText(/first-a/)).toBeInTheDocument();
    expect(screen.getByText(/second-a/)).toBeInTheDocument();
  });

  it('matches array value', () => {
    const { Switch, Case, Default } = createSwitch<Status>();

    render(
      <Switch value="idle">
        <Case value={['active', 'idle']}>Matched</Case>
        <Default>Default</Default>
      </Switch>,
    );

    expect(screen.getByText('Matched')).toBeInTheDocument();
  });

  it('matches with function predicate', () => {
    const { Switch, Case } = createSwitch<number>();

    render(
      <Switch value={10}>
        <Case value={(v) => v > 5}>Greater</Case>
      </Switch>,
    );

    expect(screen.getByText('Greater')).toBeInTheDocument();
  });

  it('passes matched value to function children', () => {
    const { Switch, Case } = createSwitch<number>();

    render(
      <Switch value={42}>
        <Case value={42}>{(v) => <span>got {v}</span>}</Case>
      </Switch>,
    );

    expect(screen.getByText('got 42')).toBeInTheDocument();
  });

  it('renders function default children', () => {
    const { Switch, Case, Default } = createSwitch<string>();

    render(
      <Switch value="z">
        <Case value="a">A</Case>
        <Default>{() => <span>fallback</span>}</Default>
      </Switch>,
    );

    expect(screen.getByText('fallback')).toBeInTheDocument();
  });

  it('renders nothing when no match and no default', () => {
    const { Switch, Case } = createSwitch<string>();
    const { container } = render(
      <Switch value="z">
        <Case value="a">A</Case>
      </Switch>,
    );

    expect(container.textContent).toBe('');
  });

  it('can be called multiple times with different types', () => {
    const StringMatch = createSwitch<string>();
    const NumberMatch = createSwitch<number>();

    const { container: c1 } = render(
      <StringMatch.Switch value="hello">
        <StringMatch.Case value="hello">string-match</StringMatch.Case>
      </StringMatch.Switch>,
    );
    expect(c1.textContent).toBe('string-match');

    const { container: c2 } = render(
      <NumberMatch.Switch value={5}>
        <NumberMatch.Case value={5}>number-match</NumberMatch.Case>
      </NumberMatch.Switch>,
    );
    expect(c2.textContent).toBe('number-match');
  });
});
