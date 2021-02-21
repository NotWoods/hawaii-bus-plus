import { h } from 'preact';

interface Props {
  alert?: string;
}

function alertContent(alert: string) {
  switch (alert) {
    case 'sentConfirmation':
      return {
        type: 'success' as const,
        title: `One more step`,
        body: 'Check your inbox for a confirmation email!',
      };
    default:
      return { type: 'error' as const, body: alert };
  }
}

export function Alert(props: Props) {
  if (!props.alert) return null;
  const { title, body } = alertContent(props.alert);

  return (
    <aside class="fixed top-0 shadow-lg bg-ocean-light dark:bg-ocean-dark py-4 px-6 mx-4">
      {title ? <h4 class="font-medium">{title}</h4> : undefined}
      <p class="opacity-80">{body}</p>
    </aside>
  );
}
