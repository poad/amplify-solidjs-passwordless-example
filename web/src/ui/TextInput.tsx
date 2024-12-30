import { TextField } from "@kobalte/core/text-field";
import { JSX, Show } from "solid-js";
import './TextInput.css';

export function TextInput(props: {
  label?: string;
  id: string;
  type: string;
  required?: boolean;
  value?: string | number | string[];
  onChange?: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event>
}) {
  const {
    id,
    label,
    type,
    required,
    value,
    onChange,
  } = props;
  return (
    <TextField class="flex flex-col gap-1 w-full pb-2">
      <Show when={label}>
        <TextField.Label for={id} class="text-field__label">
          {label}
          <Show when={required}>
            <span class='text-sm text-red-400'>
              {' '}
              (required)
            </span>
          </Show>
        </TextField.Label>
      </Show>
      <TextField.Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        class="text-field__input"
      />
    </TextField>

  );
}
