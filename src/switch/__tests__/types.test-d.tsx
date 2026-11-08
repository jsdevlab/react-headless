import type { ReactNode } from 'react';
import { For } from '../../for/for';
import { Show } from '../../show/show';
import { createSwitch } from '../switch';

interface User {
  name: string;
}

interface Admin extends User {
  adminOnly: boolean;
}

declare const users: User[];
declare const admins: Admin[];

type Status = 'active' | 'idle' | 'error';

const { Switch: StatusSwitch, Case: StatusCase } = createSwitch<Status>();

export const typedSwitch: ReactNode = (
  <StatusSwitch value="active">
    <StatusCase value="active">active</StatusCase>
  </StatusSwitch>
);

export const wrongSwitchValue: ReactNode = (
  // @ts-expect-error -- the switch value must be a Status
  <StatusSwitch value="unknown">x</StatusSwitch>
);

export const wrongCaseValue: ReactNode = (
  // @ts-expect-error -- case values must be a Status
  <StatusCase value="unknown">x</StatusCase>
);

export const typedFor: ReactNode = (
  <For each={users}>{(user) => user.name}</For>
);

export const subtypeFor: ReactNode = (
  <For each={admins}>{(admin) => String(admin.adminOnly)}</For>
);

export const wrongForChild: ReactNode = (
  // @ts-expect-error -- the item is a User, not a string
  <For each={users}>{(user: string) => user}</For>
);

export const typedShow: ReactNode = (
  <Show when={true}>{(value: boolean) => String(value)}</Show>
);

export const wrongShowChild: ReactNode = (
  // @ts-expect-error -- the render function receives a boolean
  <Show when={true}>{(value: string) => value}</Show>
);
