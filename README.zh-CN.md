# @jsdevlab/react-headless

基于 React 19 的类型安全无头逻辑组件。所有组件都不包含任何样式，不产生额外的
包裹 DOM，并且同时适用于客户端组件和服务端组件。

## 安装

```bash
pnpm add @jsdevlab/react-headless react react-dom
```

React 19 和 React DOM 19 是 peer 依赖。`Portal` 使用 React DOM。

## 组件

### `For`

渲染列表，并根据 `each` 自动推导元素类型。

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

- `each` —— 只读数组。
- `children` —— `(item, index) => ReactNode`。
- `filter` —— 可选过滤函数。过滤后列表为空时渲染 `fallback`。
- `fallback` —— 列表为空时渲染的内容。
- `keyBy` —— 生成稳定的 React key，默认使用元素下标。

`For` 为每个元素包裹一个带 key 的 Fragment，不产生额外 DOM。

### `Repeat` / `Range`

```tsx
import { Range, Repeat } from '@jsdevlab/react-headless';

<Repeat times={3}>{(index) => <Skeleton key={index} />}</Repeat>;

<Range from={1} to={5} step={1}>
  {(value) => <Dot key={value} />}
</Range>;
```

- `Repeat` 渲染 `times` 次子节点，回调收到从 0 开始的下标。非有限值和非正值会
  渲染 `fallback`。
- `Range` 渲染从 `from`（包含）到 `to`（不包含）的值。`step` 为负数时向下迭代；
  空区间或非法参数会渲染 `fallback`。

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

- 条件可以是布尔值或惰性函数 `() => boolean`。
- `children` 和 `fallback` 可以是 `ReactNode` 或惰性渲染函数。
- `When` 是 `Show` 的别名。
- `Unless` 在条件为 `false` 时渲染子节点。
- `Not` 是 `Unless` 的便捷封装。

### `With`

```tsx
import { With } from '@jsdevlab/react-headless';

<With value={user} fallback={<SignIn />}>
  {(user) => <Profile user={user} />}
</With>;
```

`With` 在 `value` 存在时渲染子节点，并为渲染函数收窄值类型。`false`、`null`、
`undefined` 视为不存在；`0` 和 `''` 视为存在。

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

- 每个条件可以是布尔值或惰性函数 `() => boolean`。
- `Every` 要求所有条件为 `true`。
- `Some` 要求至少一个条件为 `true`。
- `None` 要求所有条件为 `false`。

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

- `Switch` 使用 `Object.is` 将 `value` 与 `Case` 匹配。
- `Case` 的 `value` 可以是单个值、值数组，或谓词函数 `(value) => boolean`。
- `Case` 和 `Default` 的子节点可以是渲染函数；`Case` 的渲染函数会收到 switch
  的 `value`。
- 第一个匹配的 `Case` 生效。没有匹配时渲染 `Default`；既没有匹配也没有
  `Default` 时渲染 `fallback`。
- `multiple` 为 `true` 时渲染所有匹配的 `Case`。
- `Case` 和 `Default` 是标记组件，在 `Switch` 外渲染时输出空内容。

### 使用 `createSwitch` 绑定类型

`Switch` 和 `Case` 都是泛型组件，但 TypeScript 不会把父组件的类型参数传递给嵌套
的 JSX 子元素。可以用 `createSwitch<T>()` 把两者绑定到同一个类型：

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

`StatusSwitch` 的 `value` 和 `StatusCase` 的 `value` 都会按
`'active' | 'idle' | 'error'` 检查。

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

- `Await` 使用 React 的 `use` 读取稳定的 Promise。等待中渲染 `fallback`；失败时
  如果提供了 `error` 就渲染错误分支，否则交给最近的错误边界。
- `Catch` 是无头错误边界，捕获渲染和生命周期错误，不捕获事件处理函数或异步代码
  中的错误。`resetKeys` 变化时会重置边界。
- 两者都是客户端组件，带有 `'use client'`。

### `Portal`

```tsx
import { Portal } from '@jsdevlab/react-headless';

const containerRef = useRef<HTMLDivElement>(null);

<Portal container={containerRef}>
  <Modal />
</Portal>;
```

- `container` 支持 Element、DocumentFragment、ref 对象或 `null`。默认挂载到
  `document.body`；`null` 时不渲染。
- `disabled` 为 `true` 时直接内联渲染子节点。
- `Portal` 在服务端渲染为空，客户端挂载后再创建 portal。它是客户端组件，带有
  `'use client'`。

## 类型安全

- `For` 根据 `each` 推导元素类型。
- `With` 会从值类型中移除 `false`、`null` 和 `undefined`。
- `Await` 推导 Promise 解析后的值类型。
- `createSwitch<T>()` 让 `Switch` 和 `Case` 共享同一个类型参数。
- 条件支持 `boolean | (() => boolean)`。
- 列表和条件数组都是只读的。

## 服务端组件

`For`、`Show` / `When` / `Unless` / `Not`、`With`、`Repeat` / `Range`、
`Every` / `Some` / `None`、`Switch` / `Case` / `Default` 不使用 Hook 或浏览器
API，可以在 React Server Components 中使用。

`Await`、`Catch`、`Portal` 是客户端组件，文件中带有 `'use client'`。

## License

MIT
