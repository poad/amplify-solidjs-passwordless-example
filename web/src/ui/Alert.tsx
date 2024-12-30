import { Alert as KoblteAlert } from "@kobalte/core/alert";
import { BiRegularCheckCircle, BiSolidErrorCircle } from "solid-icons/bi";
import { JSX } from "solid-js";

export function Alert(props: {
  children: JSX.Element;
  variation: 'error' | 'success'
}): JSX.Element {
  if (props.variation === 'success') {
    return <KoblteAlert class='bg-emerald-100 text-emerald-700 py-2 -x4 align-middle'><BiRegularCheckCircle class='inline text-2xl leading-none' />
      <span class='pl-3'>{props.children}</span>
    </KoblteAlert>
  }
  return <KoblteAlert class='bg-red-100 text-amber-900 py-2 px-4 align-middle'><BiSolidErrorCircle class='inline text-2xl leading-none' />
    <span class='pl-3'>{props.children}</span>
  </KoblteAlert>
}
