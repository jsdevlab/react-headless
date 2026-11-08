import { describe, expect, it } from '@rstest/core';
import { render, screen } from '@testing-library/react';
import { With } from '../with';

describe('With', () => {
  it('passes the narrowed value to the render function', () => {
    render(
      <With value={{ name: 'Ada' }}>
        {(value) => <span>{value.name}</span>}
      </With>,
    );

    expect(screen.getByText('Ada')).toBeInTheDocument();
  });

  it('renders static children when the value is present', () => {
    render(<With value="ready">content</With>);

    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('renders fallback for null', () => {
    render(
      <With value={null} fallback={<span>fallback</span>}>
        content
      </With>,
    );

    expect(screen.getByText('fallback')).toBeInTheDocument();
    expect(screen.queryByText('content')).not.toBeInTheDocument();
  });

  it('renders fallback for undefined', () => {
    render(
      <With value={undefined} fallback={<span>fallback</span>}>
        content
      </With>,
    );

    expect(screen.getByText('fallback')).toBeInTheDocument();
  });

  it('renders fallback for false', () => {
    render(
      <With value={false} fallback={<span>fallback</span>}>
        content
      </With>,
    );

    expect(screen.getByText('fallback')).toBeInTheDocument();
  });

  it('calls the fallback render function when absent', () => {
    render(
      <With value={null} fallback={() => <span>lazy fallback</span>}>
        content
      </With>,
    );

    expect(screen.getByText('lazy fallback')).toBeInTheDocument();
  });

  it('treats 0 and the empty string as present', () => {
    const { container } = render(
      <>
        <With value={0}>{(value) => <span>{`zero:${value}`}</span>}</With>
        <With value="">{(value) => <span>{`empty:${value}`}</span>}</With>
      </>,
    );

    expect(container.textContent).toBe('zero:0empty:');
  });

  it('does not call the children render function when absent', () => {
    let called = false;

    render(
      <With value={undefined}>
        {() => {
          called = true;
          return 'content';
        }}
      </With>,
    );

    expect(called).toBe(false);
  });
});
