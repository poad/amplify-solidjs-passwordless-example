import { JSX } from '@solidjs/web';

export function View(props: { children: JSX.Element }): JSX.Element {
  return <div class="bg-white rounded mx-auto p-1 h-fit w-1/5">{props.children}</div>;
}
