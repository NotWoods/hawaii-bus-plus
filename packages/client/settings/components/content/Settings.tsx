import { h } from 'preact';
import { InputWithLabel } from '../../../components/InputWithLabel/InputWithLabel';
import { payments } from '../../../assets/icons/paths';
import { Button } from '../../../page/buttons/Button';
import { Header } from './Header';

export function Settings() {
  return (
    <main class="ml-96 p-4 space-y-6">
      <Header id="account">Account</Header>
      <InputWithLabel theme="auto" id="name" name="name" type="text">
        Name
      </InputWithLabel>
      <InputWithLabel theme="auto" id="email-address" name="email" type="email">
        Email address
      </InputWithLabel>
      <div class="inline-block">
        <Button
          href="/.netlify/functions/billing"
          iconClass="dark:invert"
          icon={payments}
        >
          Open billing portal
        </Button>
      </div>
      <Header id="display">Accessibility and display</Header>
      <Header id="about">Additional resources</Header>
      <Header id="logout">Logout</Header>
    </main>
  );
}
