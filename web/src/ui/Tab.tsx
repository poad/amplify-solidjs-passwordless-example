import type { JSX } from '@solidjs/web';
import { For } from 'solid-js';
import './Tab.css';

interface Tab {
  id: string;
  name: string;
  content: JSX.Element;
}

export function Tab(props: {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
}): JSX.Element {
  return (
    <div class="tabs">
      <div class="tabs__list" role="tablist">
        <For each={props.tabs}>
          {(items) => (
            <button
              type="button"
              role="tab"
              aria-selected={props.value === items.id ? 'true' : 'false'}
              class="tabs__trigger"
              onClick={() => props.onChange(items.id)}
            >
              {items.name}
            </button>
          )}
        </For>
        <div class="tabs__indicator" />
      </div>
      <For each={props.tabs}>
        {(items) => (
          <div hidden={props.value !== items.id} role="tabpanel" class="tabs__content">
            {items.content}
          </div>
        )}
      </For>
    </div>
  );
}
