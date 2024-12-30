import { Tabs } from "@kobalte/core/tabs";
import { For, JSX } from "solid-js";
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
    <Tabs value={props.value} onChange={props.onChange} class="tabs">
      <Tabs.List class="tabs__list">
        <For each={props.tabs}>
          {(items) => (
            <Tabs.Trigger class="tabs__trigger" value={items.id}>{items.name}</Tabs.Trigger>
          )}
        </For>
        <Tabs.Indicator class="tabs__indicator" />
      </Tabs.List>
      <For each={props.tabs}>
          {(items) => (
            <Tabs.Content class="tabs__content" value={items.id}>{items.content}</Tabs.Content>
          )}
      </For>
    </Tabs>
  );
}
