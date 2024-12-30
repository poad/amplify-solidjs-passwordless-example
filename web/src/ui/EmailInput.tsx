import { TextInput } from "./TextInput";

export function EmailInput(props: {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return <TextInput
    label="Email"
    id="email"
    type="email"
    value={props.value}
    onChange={(e) => props.onChange(e.currentTarget.value)}
    required={props.required}
  />

}
