import type { JSX } from '@solidjs/web';
import { Show } from 'solid-js';
import './TextInput.css';

export function TextInput(props: {
  label?: string;
  id: string;
  type: string;
  required?: boolean;
  value?: string | number | string[];
  onChange?: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event>;
}) {
  const { id, label, type, required, value, onChange } = props;
  return (
    <div class="flex flex-col gap-1 w-full pb-2">
      <Show when={label}>
        <label for={id} class="text-field__label">
          {label}
          <Show when={required}>
            <span class="text-sm text-red-400"> (required)</span>
          </Show>
        </label>
      </Show>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        class="text-field__input"
      />
    </div>
  );
}
