# CLAUDE.md

## 项目定位

`@jsdevlab/react-headless` 是基于 React 19 的类型安全无头逻辑组件库。

- 组件不包含任何样式，不产生额外的包裹 DOM
- 核心控制流组件必须兼容 RSC：不使用 Hook、浏览器 API，不加 `'use client'`
- 异步、错误边界、Portal 等客户端组件必须在文件首行添加 `'use client'`
- 纯 ESM，使用 Rslib bundleless 输出

## 常用命令

- `pnpm check`：Biome 检查并自动修复
- `pnpm test`：`tsc -p tsconfig.test.json` + `rstest run`
- `pnpm test:coverage`：覆盖率，当前要求 100%
- `pnpm build`：Rslib 构建
- `pnpm peers check`：peer 依赖检查
- 单测调试：`pnpm exec rstest <path> --reporter=verbose`

## 目录结构

```text
src/
  index.ts                 # 唯一公共入口，直接导出实现文件
  env.d.ts                 # jest-dom -> @rstest/core 的类型扩展
  shared/
    is-function.ts
    condition.ts           # Condition / resolveCondition / allConditions / anyConditions
  <component>/
    <component>.tsx
    __tests__/
      <component>.test.tsx
      types.test-d.tsx     # 可选，编译期类型断言
```

规则：

- 不要为组件目录创建 `index.ts` 桶文件，已在去重时删除
- 新组件使用独立目录，实现文件名与目录同名
- 测试放在同目录的 `__tests__` 下
- 跨组件复用的条件逻辑放入 `src/shared/condition.ts`，不要重复实现

## 组件清单

RSC 安全（禁止加 Hook 或 `'use client'`）：

- `For` / `Repeat` / `Range`
- `Show` / `When`（`Show` 的唯一别名）/ `Unless` / `Not`
- `With`
- `Every` / `Some` / `None`
- `Switch` / `Case` / `Default` / `createSwitch<T>()`

客户端组件（文件首行必须有 `'use client'`）：

- `Await`：`use(promise)` + `Suspense`
- `Catch`：class 错误边界
- `Portal`：`react-dom` 的 `createPortal`，`container` 支持 Element、DocumentFragment、RefObject 或 null

## 编码约定

- 严格 TypeScript：`strict`、`exactOptionalPropertyTypes`、`noUncheckedIndexedAccess`、`verbatimModuleSyntax`、`isolatedModules`
- 类型导入使用 `import type` 或 `type` 修饰符
- 列表 props 使用 `readonly T[]`；条件统一为 `boolean | (() => boolean)`
- 组件 props interface 必须导出
- 禁止使用 `Object.assign`
- 实现代码避免 `as` 类型断言，优先使用类型守卫和收窄
- 不要添加无实际收益的 `memo` / `useMemo`
- 不添加纯别名组件（如 `ForEach`、`Condition`、`Guard`、`If`）；`When` 是 `Show` 唯一保留别名，`Not` 是 `Unless` 的便捷封装
- 不添加样式、`className`、主题等 UI 相关 props
- 组件自身不产生包裹 DOM；列表使用带 key 的 Fragment
- 列表 key 优先使用 `keyBy` 或稳定业务值；仅生成式位置列表可用 index，并加 `biome-ignore` 说明
- 值匹配使用 `Object.is`
- `fallback` 默认 `null`
- 泛型 API 必须补充类型测试

## 类型安全要点

- `For<T>` 从 `each` 推导元素类型
- `With<T>` 使用存在性判断：仅 `false` / `null` / `undefined` 视为不存在，`0` 和 `''` 存在，渲染函数参数收窄为 `NonNullable<T>`
- `Await<T>` 从 `Promise<T>` 推导解析值类型
- `createSwitch<T>()` 返回 `{ Switch, Case, Default }`，因为 TypeScript 不会把父组件泛型传递给嵌套 JSX 子元素；不要改回单个组件 + 静态属性的写法
- `Condition = boolean | (() => boolean)` 统一复用 `src/shared/condition.ts`
- 禁止使用 `any`；在 `.d.ts` 中确需时优先 `unknown`，必要时加 `biome-ignore` 说明

## 测试约定

- Rstest + happy-dom + Testing Library + jest-dom
- 测试位置：`src/**/__tests__/**/*.test.tsx`
- 类型测试：`*.test-d.tsx`，Rstest 不运行，由 `tsc` 检查
- `tsconfig.test.json` 必须保持 `"exclude": []`，否则会继承根 `exclude` 而漏检测试
- 覆盖率排除 `**/__tests__/**`、测试文件、`src/env.d.ts`、`src/index.ts`
- 错误边界测试需 spy `console.error`，避免 React 错误日志污染输出
- `Await` / Suspense 测试使用 `await act(async () => { render(...) })`；pending Promise 使用 deferred helper
- `Await` 的 `promise` 必须保持稳定，避免每次渲染重新挂起
- 新行为必须补测试；保持 100% 覆盖率

## 构建约定

- Rslib bundleless，纯 ESM，`output.target: 'web'`，React 插件
- `source.entry` 必须排除 `src/**/__tests__/**` 和 `src/**/*.test.*`
- `tsconfig.json` 的 `exclude` 必须排除测试，避免测试进入 `dist`
- 构建后确认 `dist` 无测试文件，且 `Await` / `Catch` / `Portal` 产物保留 `'use client'`
- `react` 与 `react-dom` 都是 peerDependency，Portal 使用 `react-dom`
- `@testing-library/jest-dom` 固定 6.x
- `happy-dom` 固定 `21.0.4`（低于该版本有安全漏洞）。`@rstest/core@0.12.6` 仍声明 `^20.8.3` peer，已在 `pnpm-workspace.yaml` 的 `peerDependencyRules.allowedVersions` 中显式放行，110 个测试验证通过
- TypeScript 保持 `^6.0.3`，不要升级到 7（IDE 暂不支持 tsgo 补全）

## 文档与发布

- 公共 API 变更同步更新 `README.md` 与 `README.zh-CN.md`
- 新功能 / 修复添加 changeset
- Biome 配置排除 `.changeset/**` 与 `*.md`，因为 Biome 2.6 的 Markdown 格式化会破坏 changeset frontmatter，不要移除这些排除项
- `dist/`、`coverage/` 是生成产物，不要手动修改或提交

## 新增组件流程

1. 判断属于 RSC 安全组件还是客户端组件
2. 创建 `src/<component>/<component>.tsx` 与 `__tests__`
3. 从 `src/index.ts` 直接导出实现文件
4. 补充运行时测试；泛型 API 补充 `*.test-d.tsx`
5. 更新 README 与 changeset
6. 执行 `pnpm check`、`pnpm test`、`pnpm build`、`pnpm peers check`
7. 检查 `dist` 无测试文件、客户端指令保留

## 提交前检查

1. `pnpm check`
2. `pnpm test`
3. `pnpm build`
4. `pnpm peers check`
5. 检查 `dist` 与覆盖率结果

## 参考技能

- `.claude/skills/rslib-best-practices/SKILL.md`
- `.claude/skills/rstest-best-practices/SKILL.md`
