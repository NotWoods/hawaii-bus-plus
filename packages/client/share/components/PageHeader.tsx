import { Logo } from '../../components/Logo';

export function PageHeader() {
  return (
    <header class="flex pt-6 max-w-5xl items-center mx-auto">
      <a href="https://hawaiibusplus.com" class="mr-auto">
        <Logo />
      </a>
      <a
        id="openApp"
        class="shadow motion-safe:transition-colors text-black bg-white hover:bg-gray-200 px-4 py-2 ml-2"
        href="/"
      >
        Open app
      </a>
    </header>
  );
}
