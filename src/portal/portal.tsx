'use client';

import { type ReactNode, type RefObject, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export type PortalContainer =
  | Element
  | DocumentFragment
  | RefObject<Element | DocumentFragment | null>
  | null;

export interface PortalProps {
  children: ReactNode;
  container?: PortalContainer;
  disabled?: boolean;
}

function resolveContainer(
  container: PortalContainer | undefined,
): Element | DocumentFragment | null {
  if (container === undefined) {
    return document.body;
  }

  if (container === null) {
    return null;
  }

  return 'current' in container ? container.current : container;
}

/**
 * Renders children into `container`, or `document.body` by default. The
 * container can be an element, a document fragment, or a ref object. Renders
 * nothing on the server and portals on the client after mount.
 */
export function Portal({
  children,
  container,
  disabled = false,
}: PortalProps): ReactNode {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (disabled) {
    return children;
  }

  if (!mounted) {
    return null;
  }

  const target = resolveContainer(container);

  return target ? createPortal(children, target) : null;
}
