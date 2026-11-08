import {
  Children,
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import { isFunction } from '../shared/is-function';

export interface SwitchProps<T> {
  value: T;
  children: ReactNode;
  multiple?: boolean;
}

export interface CaseProps<T> {
  value: T | readonly T[] | ((value: T) => boolean);
  children: ReactNode | ((value: T) => ReactNode);
}

export interface DefaultProps {
  children: ReactNode | (() => ReactNode);
}

export interface SwitchComponents<T> {
  Switch: (props: SwitchProps<T>) => ReactNode;
  Case: (props: CaseProps<T>) => null;
  Default: typeof Default;
}

function isCaseElement<T>(
  child: ReactNode,
): child is ReactElement<CaseProps<T>> {
  return isValidElement(child) && child.type === Case;
}

function isDefaultElement(
  child: ReactNode,
): child is ReactElement<DefaultProps> {
  return isValidElement(child) && child.type === Default;
}

function matchesCase<T>(caseValue: CaseProps<T>['value'], value: T): boolean {
  if (isFunction(caseValue)) {
    return caseValue(value);
  }

  if (Array.isArray(caseValue)) {
    return caseValue.some((candidate) => Object.is(candidate, value));
  }

  return Object.is(caseValue, value);
}

export function Switch<T>({
  value,
  children,
  multiple = false,
}: SwitchProps<T>): ReactNode {
  const matched: ReactNode[] = [];
  let defaultNode: ReactNode = null;
  let hasDefault = false;

  for (const child of Children.toArray(children)) {
    if (isCaseElement<T>(child)) {
      if (!matchesCase(child.props.value, value)) {
        continue;
      }

      const content = isFunction(child.props.children)
        ? child.props.children(value)
        : child.props.children;

      if (!multiple) {
        return content;
      }

      matched.push(<Fragment key={child.key}>{content}</Fragment>);
      continue;
    }

    if (!hasDefault && isDefaultElement(child)) {
      hasDefault = true;
      defaultNode = isFunction(child.props.children)
        ? child.props.children()
        : child.props.children;
    }
  }

  return matched.length > 0 ? matched : defaultNode;
}

export function Case<T>(_props: CaseProps<T>): null {
  return null;
}

export function Default(_props: DefaultProps): null {
  return null;
}

export function createSwitch<T>(): SwitchComponents<T> {
  return {
    Case: Case<T>,
    Default,
    Switch: Switch<T>,
  };
}
