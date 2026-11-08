export const isFunction = (
  value: unknown,
): value is (...args: never[]) => unknown => typeof value === 'function';
