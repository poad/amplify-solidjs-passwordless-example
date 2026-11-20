import { JSX } from '@solidjs/web';

export function Alert(props: {
  children: JSX.Element;
  variation: 'error' | 'success';
}): JSX.Element {
  if (props.variation === 'success') {
    return (
      <div class="bg-emerald-100 text-emerald-700 py-2 px-4 align-middle">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          class="inline h-6 w-6 leading-none"
          aria-hidden="true"
        >
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.3 7.7-5.1 5.1a1 1 0 0 1-1.4 0l-2.1-2.1 1.4-1.4 1.4 1.4 4.4-4.4 1.4 1.4Z" />
        </svg>
        <span class="pl-3">{props.children}</span>
      </div>
    );
  }
  return (
    <div class="bg-red-100 text-amber-900 py-2 px-4 align-middle">
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        class="inline h-6 w-6 leading-none"
        aria-hidden="true"
      >
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z" />
      </svg>
      <span class="pl-3">{props.children}</span>
    </div>
  );
}
