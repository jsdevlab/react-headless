import { describe, expect, it } from '@rstest/core';
import { render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Portal } from '../portal';

function RefHost() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div data-testid="target" ref={containerRef} />
      <Portal container={containerRef}>
        <span>ref content</span>
      </Portal>
    </div>
  );
}

describe('Portal', () => {
  it('renders into a custom container', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const view = render(
      <Portal container={container}>
        <span>portal content</span>
      </Portal>,
    );

    expect(container.textContent).toBe('portal content');

    view.unmount();
    container.remove();
  });

  it('renders into a container ref', () => {
    render(<RefHost />);

    expect(screen.getByTestId('target').textContent).toBe('ref content');
  });

  it('renders into document.body by default', () => {
    const view = render(
      <Portal>
        <span>body content</span>
      </Portal>,
    );

    expect(screen.getByText('body content')).toBeInTheDocument();

    view.unmount();
  });

  it('renders inline when disabled', () => {
    const { container } = render(
      <Portal disabled>
        <span>inline content</span>
      </Portal>,
    );

    expect(container.textContent).toBe('inline content');
  });

  it('renders nothing when the container is null', () => {
    const { container } = render(
      <Portal container={null}>
        <span>hidden</span>
      </Portal>,
    );

    expect(container.textContent).toBe('');
    expect(screen.queryByText('hidden')).not.toBeInTheDocument();
  });

  it('renders nothing on the server', () => {
    expect(
      renderToStaticMarkup(
        <Portal>
          <span>ssr</span>
        </Portal>,
      ),
    ).toBe('');
  });

  it('renders inline on the server when disabled', () => {
    expect(
      renderToStaticMarkup(
        <Portal disabled>
          <span>ssr</span>
        </Portal>,
      ),
    ).toBe('<span>ssr</span>');
  });
});
