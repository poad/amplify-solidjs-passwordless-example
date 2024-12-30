import { JSX } from "solid-js";

export function Flex(props: {
    children: JSX.Element;
}): JSX.Element {
    return <div class='flex flex-col gap-1'>{props.children}</div>
}