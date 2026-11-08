# @jsdevlab/react-headless

Type-safe headless logic components for React 19. Every component is
style-free, renders no wrapper DOM of its own, and works in both client and
server components.

## Installation

```bash
pnpm add @jsdevlab/react-headless react react-dom
```

React 19 and React DOM 19 are peer dependencies. React DOM is used by
`Portal`.

## Components

### `For`

Render a list and infer the item type from `each`.

```tsx
import { For } from '@jsdevlab/react-headless';

<For
  each={users}
  keyBy={(user) => user.id}
  filter={(user) => user.active}
  fallback={<Empty />}
>
  {(user, index) => <UserRow user={user} index={index} />}
</For>;
```

- `each` — a readonly array of items.
- `children` — `(item, index) => ReactNode`.
- `filter` — optional predicate. `fallback` is rendered when the filtered
  list is empty.
- `fallback` — rendered when the list is empty.
- `keyBy` — derives a stable React key. Defaults to the item index.

`For` wraps each item in a keyed fragment and renders no DOM of its own.

### `Repeat` / `Range`

```tsx
import { Range, Repeat } from '@jsdevlab/react-headless';

<Repeat times={3}>{(index) => <Skeleton key={index} />}</Repeat>;

<Range from={1} to={5} step={1}>
  {(value) => <Dot key={value} />}
</Range>;
```

- `Repeat` renders children `times` times with a zero-based index.
  Non-finite and non-positive values render `fallback`.
- `Range` renders values from `from` (inclusive) to `to` (exclusive). A
  negative `step` iterates downwards; empty or invalid ranges render
  `fallback`.

### `Show` / `When` / `Unless` / `Not`

```tsx
import { Not, Show, Unless, When } from '@jsdevlab/react-headless';

<Show when={isLoading} fallback={<Content />}>
  <Spinner />
</Show>;

<When when={() => permissions.canEdit}>
  <Editor />
</When>;

<Unless when={isLoading}>
  <Content />
</Unless>;

<Not condition={isLoading} fallback={<Content />}>
  <Spinner />
</Not>;
```

- A condition can be a boolean or a lazy `() => boolean` function.
- `children` and `fallback` accept either a `ReactNode` or a lazy render
  function.
- `When` is an alias of `Show`.
- `Unless` renders its children when the condition is false.
- `Not` is a convenience wrapper around `Unless`.

### `With`

```tsx
import { With } from '@jsdevlab/react-headless';

<With value={user} fallback={<SignIn />}>
  {(user) => <Profile user={user} />}
</With>;
```

`With` renders its children when `value` is present and narrows the value type
for the render function. `false`, `null`, and `undefined` are absent; `0` and
`''` are present.

### `Every` / `Some` / `None`

```tsx
import { Every, None, Some } from '@jsdevlab/react-headless';

<Every conditions={[isReady, () => permissions.canEdit]}>
  <Editor />
</Every>;

<Some conditions={[isAdmin, isOwner]} fallback={<ReadOnly />}>
  <Toolbar />
</Some>;

<None conditions={[isLoading, hasError]} fallback={<Spinner />}>
  <Content />
</None>;
```

- Each condition can be a boolean or a lazy `() => boolean` function.
- `Every` requires all conditions to be true.
- `Some` requires at least one condition to be true.
- `None` requires all conditions to be false.

### `Switch` / `Case` / `Default`

```tsx
import { Case, Default, Switch } from '@jsdevlab/react-headless';

<Switch value={status} fallback={<Unknown />}>
  <Case value="loading">
    <Spinner />
  </Case>
  <Case value={['ready', 'idle']}>
    <Content />
  </Case>
  <Case value={(value) => value.startsWith('error')}>
    {(value) => <ErrorView code={value} />}
  </Case>
  <Default>
    <Empty />
  </Default>
</Switch>;
```

- `Switch` matches `Case` branches against `value` using `Object.is`.
- A `Case` value can be a single value, an array of values, or a predicate
  function `(value) => boolean`.
- `Case` children and `Default` children can be render functions. `Case` render
  functions receive the switch value.
- The first matching case wins. `Default` is used when no case matches.
  `fallback` is used when there is no match and no `Default`.
- `multiple` renders every matching case instead of only the first.
- `Case` and `Default` are markers and render nothing when used outside a
  `Switch`.

### Typed switches with `createSwitch`

`Switch` and `Case` are generic, but TypeScript does not propagate a parent
component's type parameters to nested JSX children. Use `createSwitch<T>()` to
bind both components to the same type:

```tsx
import { createSwitch } from '@jsdevlab/react-headless';

const {
  Switch: StatusSwitch,
  Case: StatusCase,
  Default: StatusDefault,
} = createSwitch<'active' | 'idle' | 'error'>();

<StatusSwitch value={status}>
  <StatusCase value="active">
    <Active />
  </StatusCase>
  <StatusCase value={['idle', 'error']}>
    <Inactive />
  </StatusCase>
  <StatusDefault>
    <Unknown />
  </StatusDefault>
</StatusSwitch>;
```

Both `StatusSwitch value` and `StatusCase value` are checked against
`'active' | 'idle' | 'error'`.

### `Await` / `Catch`

```tsx
import { Await, Catch } from '@jsdevlab/react-headless';

<Await
  promise={userPromise}
  fallback={<Spinner />}
  error={(error, reset) => (
    <ErrorView error={error} onRetry={reset} />
  )}
  onError={(error) => report(error)}
>
  {(user) => <Profile user={user} />}
</Await>;

<Catch
  fallback={(error, reset) => (
    <ErrorView error={error} onRetry={reset} />
  )}
  resetKeys={[userId]}
>
  <Profile />
</Catch>;
```

- `Await` reads a stable promise with React's `use` API. Pending renders
  `fallback`; rejected promises render `error` when provided, otherwise they
  propagate to the nearest error boundary.
- `Catch` is a headless error boundary. It catches render and lifecycle
  errors, not errors thrown in event handlers or async code. Changing
  `resetKeys` resets the boundary.
- Both are client components marked with `'use client'`.

### `Portal`

```tsx
import { Portal } from '@jsdevlab/react-headless';

const containerRef = useRef<HTMLDivElement>(null);

<Portal container={containerRef}>
  <Modal />
</Portal>;
```

- `container` accepts an element, a document fragment, a ref object, or `null`.
  It defaults to `document.body`; `null` renders nothing.
- `disabled` renders children inline instead of portaling.
- `Portal` renders nothing on the server and portals after mounting on the
  client. It is a client component marked with `'use client'`.

## Type safety

- `For` infers its item type from `each`.
- `With` narrows away `false`, `null`, and `undefined`.
- `Await` infers the resolved promise value.
- `createSwitch<T>()` shares one type parameter between `Switch` and `Case`.
- Conditions accept `boolean | (() => boolean)`.
- Lists and condition arrays are readonly.

## Server components

`For`, `Show` / `When` / `Unless` / `Not`, `With`, `Repeat` / `Range`,
`Every` / `Some` / `None`, and `Switch` / `Case` / `Default` use no hooks or
browser APIs and can be used in React Server Components.

`Await`, `Catch`, and `Portal` are client components and are marked with
`'use client'`.

## License

MIT
