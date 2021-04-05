import clsx, { ClassValue } from 'clsx';
import { h } from 'preact';

interface Props {
  class?: ClassValue;
}

/**
 * Logo for the app saying "Hawaii Bus Plus"
 */
export function Logo(props: Props) {
  return (
    <h1
      class={clsx(
        'font-display font-medium text-2xl uppercase flex items-center',
        props.class,
      )}
    >
      <svg
        class="h-8 mr-1"
        viewBox="0 0 183 58"
        width="101"
        height="32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Hawaii</title>
        <path
          d="M12.4 29.2V28h.1l.4-1c.2-.6.2-1.3.3-2a81.6 81.6 0 01.2-2.5 10.1 10.1 0 00.3-2.8l.1-.8.1-.6.1-2.6a22.7 22.7 0 00.1-4.5c.3-.6.5-1.3.5-2a4 4 0 00-1.2-2.8 4 4 0 00-1-.7 4 4 0 00-.7-1 3.7 3.7 0 00-2.9-1.2l-.7.2-.9 1H7c-.4.3-.7.8-.7 1.3v1.7L6.4 9a10 10 0 00-.1 4.8L5.8 16a53 53 0 00-.4 2.5c0 .3 0 .7.2 1l-.3-.6c0 .3.1.6.3.8a13.8 13.8 0 01-.2 2.2l-.3 1-.3 1V25.3L4.6 27c-.1.5-.3.9-.6 1.3l-.2.8v1.3h-.1a1.4 1.4 0 01-.5 0 1.3 1.3 0 00-1.7.7l-.5.1c-.4.2-.7.5-.8 1L0 33c0 .8.1 1.4.4 2a7 7 0 001 1.7c.1.2.4.3.6.4h.3c0 .3.2.5.4.8a100.6 100.6 0 01-.3 4.6v1.7a40.9 40.9 0 00.4 2.4c.1.1.3.3.3.6A18.3 18.3 0 014 49c.1.5.4.9.8 1.2.1.2.3.3.6.4a1.3 1.3 0 00.4.6A3 3 0 007 52.4a1.3 1.3 0 001.3.8h2.2l1.3-.2c.4 0 1-.2 1.4-.5.3-.1.5-.3.6-.6.5-.3.7-.6.8-1 0-.3 0-.5.2-.7.3-.4.5-.9.6-1.4a1.3 1.3 0 00-1-1.6 3 3 0 01-.6-.2 1.3 1.3 0 00-1.1-1.5 3 3 0 01-1-.3 4 4 0 00-1-.4v-1.2a29.4 29.4 0 01.4-5 39.2 39.2 0 004.3-1.3 35 35 0 015.8-1.2l.4-.2.1.6-.2.8a8.5 8.5 0 000 2.4v1c0 .4 0 .7-.2 1v.6l.5 2.2.2 1.8c0 .3 0 .5.2.7.2.4.4.8.4 1.3l.4 2c0 .4.3.7.6.9l.1.2.1.4v.2a1.3 1.3 0 001.4 1.6l.2.4a1.3 1.3 0 001.5 1.3l.3.5c.2.6.7.9 1.2.9h.1c.3.3.5.5.8.6.3 0 .5.1.8 0h.7l1 .2h.5c.7-.4 1.3-.8 1.6-1.5a4 4 0 00.3-3c0-.3-.2-.5-.5-.7l-.6-.4v-.2c0-.6-.3-1.1-1-1.3l-.4-.1-.2-.1V50a56.4 56.4 0 00-1-2.6 28.8 28.8 0 00-.7-3.5l.1-5c0-1.6.1-3 .3-4.6l.5-.2a11.6 11.6 0 013.2-.5l1.1-.1.6.3 1.4.2a4 4 0 002.3-.7 4.6 4.6 0 001.5-1.9l.1-.6v-.3a10.8 10.8 0 00-.1-1.9c0-.2-.2-.4-.3-.5-.3-.5-.8-.9-1.4-1v-.2l-.2-.5a2.7 2.7 0 00-2.3-1.2l-1.6.3-1 .4h-1a34.6 34.6 0 01-2 0v-.1l.1-1.4c0-.4.1-.7.3-1v-.7l.1-.8.3-1.8-.1-.7a56.2 56.2 0 00.9-4.9 33.2 33.2 0 00.1-2.7l.2-1.2c0-.3.2-.5.3-.8.2-.2.3-.6.2-1a78 78 0 00-.2-1.2v-.9a10 10 0 00-.1-3c0-.3-.1-.5-.3-.6-.3-.5-.8-.8-1.3-1v-.2l-.3-.5c-.4-.5-.8-.8-1.4-1a4 4 0 00-1.5-.4h-.1c-1.3 0-2.1.5-2.7 1.2a4 4 0 00-.7 2.4l.1 1.7.1 1a2 2 0 00-.3 1v.8a1.4 1.4 0 000 .8V10l-.2 1v.6c-.3.3-.4.6-.4 1 0 .3 0 .6.2.9v.1l-.4 1.4-.2 1.4a42.9 42.9 0 00-.6 5.2 61.8 61.8 0 01-.9 5.8 130.7 130.7 0 00-9.8 1.8zm58.9 8.2l-.2-.2c-.1-.3-.4-.6-.7-.7l-.6-.1a3 3 0 00-.3-1c-.2-.2-.5-.5-.8-.6a3 3 0 00-1-.1h-.4a26 26 0 00-1.8 0 43.7 43.7 0 00-1.7-6.6l-.4-.8c0-.2-.1-.5 0-.8a7.1 7.1 0 000-1.8l-.7-2a5 5 0 01-.4-1.3l-.7-3.1a51.8 51.8 0 01-1.1-4.5c0-.9-.4-1.7-1-2.3-.2-.3-.5-.4-.9-.4-.2-.5-.4-1-.8-1.3-.2-.3-.5-.4-.8-.5-.8 0-1.4 0-1.8-.2-.4 0-.8-.3-1.2-.7-.4-.3-.9-.4-1.3-.2-.7.3-1.2.8-1.5 1.4l-.2.2c-.3.1-.6.3-.7.6l-.2.7.1.6-.6 1.4a31.7 31.7 0 00-1.3 3.7 3 3 0 01-.7 1l-.4.8-.1.7c-.4.2-.7.6-.8 1l-.5 2c-.3.7-.5 1.3-.9 1.9a201.3 201.3 0 01-2.1 3.8c-.4.2-.7.6-.7 1.1v.2c-.4.1-.7.5-.8.9a6 6 0 01-1.5 2.8c-.2.2-.4.5-.4.8v.5L38 36a560.3 560.3 0 00-3.2 4.2c-.5.5-1 1-1.8 1.3-.4.2-.7.6-.7 1a2.5 2.5 0 000 1v.2c-.3.3-.5.8-.7 1.2a8.4 8.4 0 00-.3 2.4v.5c.5 1 1 1.8 2 2.1A3 3 0 0036 52c.6 0 1.3-.1 2-.4.6-.3 1.1-.6 1.5-1 .3-.2.5-.6.5-1l.7-.7a14.8 14.8 0 001.4-1.8c0-.2.2-.3.4-.4.4-.2.7-.6.7-1.1l.5-.8.2-.1.7-.7v-.1l1.7.2h1.3l1.2-.1h.5c.4 0 .7-.2 1-.3h.2c.6 0 1-.2 1.5-.5l.3-.2h1.1a13.2 13.2 0 004.4-.6l.5.4a1.3 1.3 0 001.3 0l.7 1.4a5.6 5.6 0 001.8 1.9c.3.5.7 1 1.1 1.3.6.5 1.1.6 1.6.6l.1.1.6.4c.2.2.6.3 1.1.3h2.7l.6-.4h.3l1.2-.1c.6 0 1.1-.2 1.6-.4.6-.2 1-.5 1.5-.9.3-.2.5-.6.7-1h.1c.3.2.6.3.7.5l.8.8c.3.3.7.5 1.3.7l2.2.2a22.3 22.3 0 004.2-.4 23.6 23.6 0 013.2-1.7c.3-.1.5-.3.7-.6.3-.6.9-1 1.5-1.5h.3a4.3 4.3 0 00.7-.4 30.3 30.3 0 001.8-1.9l1.6-1.8a11.8 11.8 0 002.4 2.8l.4.5c.8.8 1.6 1.5 2.6 2 1 .6 2.2.8 3.6.8h1.1l.5-.2c.8-.6 1.7-1 2.7-1.4A452.2 452.2 0 01109 43l.1.7-.1.2c-.3.3-.5.8-.6 1.2a8.4 8.4 0 00-.4 2.4v.5c.5 1 1.1 1.8 2 2.1A3 3 0 00113 52c.6 0 1.2-.1 1.9-.4.6-.3 1.1-.6 1.5-1 .4-.2.5-.6.5-1l.7-.7A14.8 14.8 0 00119 47l.4-.4c.4-.2.7-.6.7-1.1l.5-.8.3-.1.6-.7v-.1l1.7.2h1.4l1.2-.1h.4c.4 0 .7-.2 1-.3h.2c.6 0 1.1-.2 1.6-.5l.2-.2h1.1a13.2 13.2 0 004.4-.6l.6.4a1.3 1.3 0 001.2 0l.7 1.4A5.6 5.6 0 00139 46c.3.5.7 1 1.1 1.3.6.5 1.2.6 1.6.6l.1.1.6.4c.2.2.6.3 1.2.3H146.2l.7-.4h.2l1.3-.1c.5 0 1-.2 1.5-.4.6-.2 1-.5 1.5-.9s.8-1 1-1.7c0-.4 0-.9-.4-1.2l-.4-.5-.7-1.1c-.3-.3-.5-.4-.8-.4l-.1-.2-.8-1.1c-.4-.4-1-.6-1.4-.4v-.2c.3-.4.6-1 .6-1.7 0-.3-.1-.8-.4-1.2-.1-.3-.4-.6-.7-.7l-.6-.1a3 3 0 00-.3-1c-.2-.2-.4-.5-.8-.6a3 3 0 00-1-.1h-.4a26 26 0 00-1.8 0 43.7 43.7 0 00-1.7-6.6l-.4-.8v-.8a7.2 7.2 0 000-1.8l-.7-2a5 5 0 01-.4-1.3c-.1-1-.4-2.1-.7-3.1l-.8-2.9-.3-1.6c0-.9-.4-1.7-1-2.3-.2-.3-.5-.4-.8-.4-.2-.5-.5-1-.9-1.3-.2-.3-.5-.4-.8-.5-.8 0-1.3 0-1.8-.2-.4 0-.7-.3-1.2-.7-.4-.3-.9-.4-1.3-.2-.7.3-1.2.8-1.5 1.4l-.2.2c-.3.1-.5.3-.7.6l-.1.7v.6l-.6 1.4a31.7 31.7 0 00-1.3 3.7 3 3 0 01-.7 1l-.4.8-.1.7c-.4.2-.7.6-.8 1 0 .8-.3 1.5-.5 2l-.8 1.9a227.4 227.4 0 01-2.2 3.8c-.4.2-.7.6-.7 1.1v.2c-.4.1-.7.5-.8.9a6 6 0 01-1.5 2.8c-.2.2-.3.5-.3.8v.5c-.6.5-1.1 1.1-1.6 1.8a688.4 688.4 0 00-3.1 4.2l-.3.2.4-.6c.2-.7.4-1.4.8-2a27 27 0 001.6-3v-1.4a54.7 54.7 0 01.8-3l.2-1.9c0-1.1-.1-2.3-.3-3.4l-.4-2.5.2-.4.3-.4a1.3 1.3 0 00.2-1.4c.2-.3.4-.7.4-1.2l.1-.1c.2-.3.3-.7.3-1l-.3-1v-.5-.5c0-.3-.1-.6-.3-.8-.3-.3-.5-.7-.6-1l-.5-1.5-.7-1.6a5 5 0 00-1-1.6c-.2-.2-.4-.3-.7-.3l-.7-1.1c-.2-.3-.4-.5-.7-.6H109.6l-.4-.4-.6-.5c-.7-.4-1.8-.4-2.5 0a2 2 0 00-.5.4l-.2.3-.4.4c-.2.2-.3.4-.3.7v.7l.3 1.2v1.2l-.1.4a1.3 1.3 0 00.5 1.2v.1c.3.6.3 1.2.4 1.9a4.5 4.5 0 00.2.7V16.8a63 63 0 00.3 4.2 62.2 62.2 0 01.3 7.3v.2a5.6 5.6 0 00-.5 1l-.2.8-.2 1-.5 1-.6.5c-.2 0-.4.3-.5.5l-.1.4a5 5 0 01-.8 1.6 2 2 0 01-.5.5 2 2 0 01-.8.2l-.4-2.9a71.7 71.7 0 010-8.6v-.6l-.7-.8v-.4c0-.5-.3-1-.9-1.2l-.4-.2-.3-.3c0-.4-.3-.8-.6-1l-.5-.3c-.2 0-.3-.1-.4-.3L97 19l-1.2-.8a3 3 0 00-1.3-.2l-.7.1-.2.2.2-.1h-.1l-.1.1a3.6 3.6 0 00-.8.8l-.7.9a1.3 1.3 0 000 1.2V21.4a5.1 5.1 0 00-.2.9v1.4l-.2 1.2c0 .2-.2.3-.3.5a1.3 1.3 0 00-.2 1l.1.5v.6l-.5 1.3a5 5 0 00-.1.7l-.2.2-.1.3-.2.3v.2l-.2.1-.2.4v.1l-.4.5a2 2 0 00-.3.6v.1l-.2.2-.3.3-1.5 1.7c-.3.3-.7.3-1 .6l-.3.5v.2l-.2.2-.5.4a1.3 1.3 0 00-.8.3c-.2 0-.3.2-.3.3l-.3.4-1 .5-1 .6a3.5 3.5 0 00-.7.6v.1a3.3 3.3 0 01-.8 0l.1-1.6c0-.5.1-1 .3-1.3.1-.3.2-.6.1-.8a6.6 6.6 0 00-.2-.7l.2-.7.5-1.5.6-3.3c.2-1 .5-1.9 1-2.7l.2-.7v-1.2l.8-2.6a36.5 36.5 0 001-9.3v-1.1c0-.4-.2-.8-.5-1l-1.2-.9c0-.3-.2-.5-.4-.7l-.6-.5a20 20 0 00-3-1.9l-.6-.3h-.9c-.1 0-.3 0-.4.2a3.5 3.5 0 00-1.2 1l-.4.7-.2.4v4.8L75 16V18.6l-.1.5a33.5 33.5 0 00-1.2 5.8c0 .5 0 1.1-.2 1.6v.3h-.1l-.1.2a2.2 2.2 0 00-.6 1l-.1 1v.2l-.1.6-.2 1.3-.2.9c0 .6-.2 1.2-.4 1.8 0 .6-.2 1-.3 1.6l-.2 2zm83.3 8.1l1 1.4c.3.3.8.5 1.3.4h.1c.4.4.8.7 1.4.8.4.1.8 0 1.2-.2h1.6c.6 0 1.1 0 1.5-.3.2 0 .4-.2.5-.3l.7-.8 1-1.1c.3-.4.3-1 0-1.4a29 29 0 01-1.2-2.1l-.7-2c0-.6-.5-1-1-1v-.1l-.3-.1h-.2l-.2-.6c0-.4-.2-.6-.5-.8-.2-1-.2-2-.2-3 0-2 .3-4.2.5-6.4.3-2.3.6-4.5.7-6.8.1-2.4-.2-4.7-.9-6.8 0-.2-.2-.4-.4-.6l-1.2-1v-.1l-.4-.6-1.4-1c-.5-.4-1.2-.6-1.9-.7-.5-.1-1-.1-1.6 0l-1.1.4c-.6.2-1 .8-.9 1.4-.4.2-.8.6-1 1.2-.2.5 0 1 .2 1.3v.4l-.4 1.1v.6a177.8 177.8 0 00.5 3.4 21.1 21.1 0 01-.2 3.2 88 88 0 01-1.1 7.1 33.8 33.8 0 01-.3 2.5v.2l.2 1.2a9.4 9.4 0 01.2 1 44 44 0 01.6 5.2 370 370 0 003.3 4.6c.1.2.3.4.6.4zm17.1 0l1 1.4c.4.3.9.5 1.3.4h.2c.3.4.8.7 1.4.8.4.1.8 0 1.1-.2H178.4c.6 0 1 0 1.5-.3.2 0 .3-.2.5-.3l.7-.8 1-1.1c.2-.4.2-1 0-1.4a29 29 0 01-1.2-2.1c-.4-.7-.6-1.4-.7-2-.1-.6-.5-1-1-1v-.1l-.4-.1h-.2l-.1-.6c0-.4-.3-.6-.6-.8l-.2-3 .6-6.4c.3-2.3.5-4.5.6-6.8.2-2.4-.1-4.7-.9-6.8l-.3-.6-1.3-1v-.1c0-.2-.2-.4-.4-.6l-1.3-1c-.6-.4-1.2-.6-2-.7-.4-.1-1-.1-1.6 0l-1 .4c-.7.2-1 .8-1 1.4-.4.2-.7.6-1 1.2-.1.5 0 1 .3 1.3l-.1.4-.4 1.1v.6a44.5 44.5 0 00.6 3.4 21.1 21.1 0 01-.3 3.2 89.9 89.9 0 01-1 7.1 37 37 0 01-.3 2.7c0 .4 0 .7.2 1.2l.1 1a44 44 0 01.6 5.2 328 328 0 003.3 4.6c.2.2.4.4.6.4zm-60.3-5l-1 .8a6 6 0 011-.8zM130.6 24v.2l.1.9 1 3a78.3 78.3 0 011.4 6.7h-.5a10.4 10.4 0 01-1.9.3c-.5 0-1 0-1.5-.2-.4-.2-.9-.1-1.2.1l-.6.2-1 .1-.8-.3h-.5l1-2.6a62.8 62.8 0 013-5.3c.5-1 .9-1.9 1.1-2.9l.4-.2zm-77 0l.2.2v.9l1 3a76.6 76.6 0 011.4 6.7h-.6a10.4 10.4 0 01-1.8.3c-.5 0-1 0-1.6-.2-.4-.2-.8-.1-1.1.1l-.6.2-1 .1-.8-.3h-.5l1-2.6a62.8 62.8 0 013-5.3c.5-1 .8-1.9 1-2.9l.4-.2zm19.9 2.9v-.1z"
          fill="#C67168"
        />
        <path
          d="M38 28.9v.5c-.4.5-.7 1-1.1 1.2-.4.3-1 .4-1.6.4h-.9l-.7-.5a33.8 33.8 0 01-3.4.3l-1.7.4c-.5.1-1 .4-1.3.7l-.4 5.3v5.3l.4 1.8.1 1.8.5 1a84.5 84.5 0 01.6 1.9l.6.8h.5l.6.2v.2c0 .4 0 .7.3.9l.8.6.1.8c0 .4 0 .8-.3 1.2-.2.4-.5.7-1 .8h-.7a2.7 2.7 0 00-1.3 0 1 1 0 01-.3-.3l-.3-.2-.3-.2h-.5a3 3 0 00-.6-1c-.3-.4-.6-.5-1-.5V52c0-.4 0-.7-.2-1l-.6-.8-.4-2c0-.6-.3-1.2-.6-1.8a46.3 46.3 0 01-.7-4.2l.2-1.4a14.8 14.8 0 00-.1-2v-1.1l.4-1-.3-.8v-.9-1.3l.2-1.2h-.3l-.6.1-.6.3h-.7l-1.2.1c-.3.1-.7.3-1 .6l-2.6.3A36.5 36.5 0 0011 35l-2.6.7a30.2 30.2 0 00-.6 6.2v1.9l.3.5.2.6c0 .2 0 .3-.2.4.2.3.5.6.9.8l1-.2c.4 0 .9.1 1.3.4l1.3.4-.5 1a3 3 0 00-.4 1.2h-.3l-.2.1-.2.1v.5a4 4 0 01-1 .4 10.2 10.2 0 01-2.3.1h-1l-.2-.3-.2-.2-.4-.1a1 1 0 01-.3-.2l-.4-.7a40 40 0 01-.8-1.9c0-.3-.2-.6-.4-.8a40 40 0 01.1-9.6 1 1 0 00-.8-.3l-.8-.1-.8-1.3-.3-1.5.1-.8.8-.2c.3-.1.4-.3.4-.6l.7.1.8-.1.7-.2.3-1.2v-1.3c.4-.5.6-1 .7-1.7l.3-1.9v-.6-.5l.3-1a31 31 0 00.5-2.3v-1.5l-.1-.3a52 52 0 01.8-5.2 6 6 0 01-.3-2c0-1 .2-2 .5-2.9l-.3-1.2.1-1V6l.7-.6.6-.6c.7 0 1.4.3 2 .8.4.6.7 1.2.7 2 0 .6-.2 1.1-.5 1.7l.2 1.7-.2 2.8c-.2 1-.2 2-.2 3l-.2 1.3a8.2 8.2 0 01-.3 2.4l-.2 1A81 81 0 0010 25l-.2.6-.2.4c-.1.6-.2 1.1-.1 1.7v1.7l-.2.5v1c2.3-.2 4.7-.6 7-1 2.3-.6 4.6-1 7-1.3l.2-1v-.7l.5-2.6a62.7 62.7 0 001-7.7l.2-1.3a10.5 10.5 0 01.6-2.2l-.2-.2c-.2 0-.3-.1-.3-.2l.1-.1h.1l.2-.7a15.4 15.4 0 00.2-1.6l.3-.6c0-.2 0-.4-.2-.5v-.6c-.1 0-.1 0 0 0a4.3 4.3 0 000-1.2c0-.4.2-.6.5-.8a15.3 15.3 0 01-.3-3c0-.6 0-1.1.4-1.6.3-.4.9-.7 1.6-.7.4 0 .8.1 1.1.3l.9.6a7.8 7.8 0 01.1 2.7 8.5 8.5 0 000 1.8l.2.8c-.3.3-.4.7-.5 1.2l-.2 1.3a25.9 25.9 0 00-.2 2.7 22.9 22.9 0 01-.9 5l.1.8c0 .4 0 .9-.2 1.3v1.4c-.3.4-.4 1-.4 1.4L28 24v1.5c0 .5-.1 1-.3 1.4 0 .1.1.2.3.2.1 0 .2.1.1.3a6 6 0 012-.2 97.5 97.5 0 004.1-.1l1.2-.4 1.2-.2c.5 0 1 .2 1.2.6a9.5 9.5 0 01.2 1.7zm34.5 14.4c0 .4-.3.7-.6 1-.3.3-.6.5-1 .6a5 5 0 01-1.3.3l-1.1.1h-.9c-.2 0-.2 0-.2.2s-.1.3-.3.3a2.6 2.6 0 00-1-.2h-.5l-.6.1h-.6l-.2-.3-.3-.2-.3-.3H63c-.1 0-.3 0-.6-.3l-1-1.1a24.5 24.5 0 01-1.5-3 6 6 0 00-1-1.3h-.4c-.6 0-1 .3-1.2.7a3 3 0 01-.4-.3l-.5-.4a23.6 23.6 0 01-4.6.8H50.5c-.3 0-.6.2-.9.4l-.8.2c-.2 0-.4 0-.7-.2-.1 0-.2.1-.2.3 0 .1-.1.2-.3.2H45.9l-1.3.1c-.6 0-1.2 0-1.8-.2a1 1 0 01-.6.1l-.2.3-.2.4-.3.3h-.4c0 .4-.2.7-.5 1-.2.2-.4.5-.4 1-.3.1-.6.3-.8.6a23.2 23.2 0 00-1.4 1.8l-.8.7c-.2.1-.2.4-.2.9l-1.2.7-1.4.3c-1 0-1.6-.5-2-1.4a7.8 7.8 0 01.4-2c0-.4.2-.7.4-1 .2-.2.4-.4.8-.5 0-.3-.1-.5-.3-.6-.2-.1-.3-.3-.2-.6.8-.4 1.6-1 2.2-1.6a643.3 643.3 0 013.3-4.3c.5-.8 1-1.4 1.7-2v-1c1-1 1.6-2.1 1.9-3.4.3 0 .5-.2.6-.5.2-.2.2-.5.2-.9.2 0 .3 0 .3-.2 0-.1.2-.1.4 0a203.8 203.8 0 002.9-6c.3-.7.5-1.5.6-2.3.4 0 .7-.3.7-.7l.2-1c.4-.5.8-1 1-1.6l.7-1.8.6-2c.2-.6.6-1.2 1-1.7 0-.2 0-.3-.2-.4-.1 0-.2-.1-.2-.3.5-.3.7-.5 1-.9.1-.3.4-.6.8-.7.6.5 1.2.8 1.7 1l2 .2c.4.4.6 1 .6 1.5a54.1 54.1 0 001.1 4.7c.4 1 .6 2 .8 3 0 .6.2 1.2.5 1.7l.5 1.6v1.5c0 .6 0 1 .2 1.4l.3.8.4 1a29.3 29.3 0 011 4.2c.2 1.1.5 2 1 3 .1.3.3.5.7.6l1 .3h3.3l.2.7c0 .4-.1.7-.4 1a1 1 0 00-.4.7l.2.5h-.5c-.8 0-1.5 0-2.1.3.2.6.5 1 1 1.4l1.3 1c.3-.3.6-.4 1-.4s.7 0 1 .3l1 .2.7-.1c.3.3.5.5.6.8l.6.9zm77 0c-.1.4-.3.7-.6 1-.3.3-.7.5-1.1.6a5 5 0 01-1.2.3l-1.2.1h-.9c-.1 0-.2 0-.2.2s0 .3-.2.3a2.6 2.6 0 00-1-.2h-.6l-.6.1h-.5l-.3-.3-.3-.2-.3-.3h-.5c-.2 0-.4 0-.7-.3l-1-1.1a24.5 24.5 0 01-1.5-3 6 6 0 00-1-1.3h-.4c-.5 0-1 .3-1.1.7a3 3 0 01-.5-.3l-.5-.4a23.6 23.6 0 01-4.6.8H127.4c-.3 0-.6.2-.8.4l-.9.2c-.2 0-.4 0-.6-.2-.2 0-.3.1-.3.3 0 .1 0 .2-.3.2H122.8l-1.3.1c-.6 0-1.2 0-1.8-.2a1 1 0 01-.5.1c-.2 0-.3.2-.3.3l-.2.4-.3.3h-.4c0 .4-.2.7-.5 1-.2.2-.4.5-.4 1-.3.1-.6.3-.8.6a23.2 23.2 0 00-1.3 1.8l-.9.7c-.2.1-.2.4-.1.9l-1.3.7-1.4.3c-1 0-1.5-.5-1.9-1.4a7.8 7.8 0 01.3-2c0-.4.2-.7.4-1l.8-.5c0-.3 0-.5-.3-.6-.2-.1-.2-.3-.2-.6.8-.4 1.6-1 2.2-1.6a814.6 814.6 0 013.3-4.3c.5-.8 1.1-1.4 1.8-2v-1c.9-1 1.5-2.1 1.8-3.4.3 0 .6-.2.7-.5l.1-.9c.2 0 .3 0 .3-.2 0-.1.2-.1.4 0a182.8 182.8 0 002.9-6c.3-.7.5-1.5.6-2.3.4 0 .7-.3.7-.7l.2-1c.5-.5.8-1 1-1.6l.7-1.8.6-2 1-1.7c0-.2 0-.3-.2-.4l-.1-.3c.4-.3.7-.5.8-.9.2-.3.5-.6.9-.7.6.5 1.2.8 1.7 1l2 .2c.4.4.6 1 .7 1.5a53.2 53.2 0 001.1 4.7l.7 3c0 .6.2 1.2.5 1.7l.5 1.6v1.5c0 .6 0 1 .2 1.4l.3.8.4 1a29.3 29.3 0 011 4.2c.2 1.1.5 2 1 3 .1.3.4.5.7.6l1 .3h3.3c.2.3.2.6.2.7 0 .4-.1.7-.4 1a1 1 0 00-.3.7c0 .1 0 .3.2.5h-.6c-.7 0-1.4 0-2.1.3.2.6.6 1 1 1.4l1.3 1c.3-.3.7-.4 1-.4.4 0 .7 0 1 .3l1.1.2.6-.1c.3.3.5.5.6.8l.6.9zM162 43l-.7 1-.8.8-1 .2h-1a6 6 0 00-.9 0 1 1 0 00-.6.2c-.4 0-.6-.2-.8-.5-.1-.2-.4-.3-.9-.4a1 1 0 00-.5 0l-1.7-2.2-1.4-2.3a45 45 0 00-.8-6.8l.1-1.3.2-1a90.2 90.2 0 011-7.2c.3-1 .3-2.2.3-3.4 0-1.2-.2-2.3-.5-3.3v-.3c0-.4 0-.7.2-.9l.2-.8c.1-.4 0-.8-.3-1 .1-.3.3-.5.6-.6.3-.1.5-.4.5-.7V12l1-.4a2 2 0 011 0c.6 0 1.1.2 1.5.5l1.2 1c.7 2 1 4 .8 6.3a93 93 0 01-.6 6.7l-.6 6.6c0 2.1.3 4.1 1 6h.2c.2 0 .3 0 .5-.2 0-.2.3-.3.5-.2l.3.1c.1.8.4 1.6.8 2.4L162 43zm17.2 0l-.8 1-.8.8-1 .2h-1a6 6 0 00-.8 0 1 1 0 00-.7.2c-.3 0-.6-.2-.7-.5-.2-.2-.5-.3-1-.4a1 1 0 00-.4 0l-1.7-2.2-1.5-2.3a45.5 45.5 0 00-.7-6.8v-1.3l.2-1a90.2 90.2 0 011.1-7.2c.2-1 .3-2.2.3-3.4 0-1.2-.2-2.3-.6-3.3v-.3l.2-.9.3-.8c0-.4 0-.8-.4-1 .2-.3.4-.5.7-.6.3-.1.4-.4.5-.7V12l1-.4a2 2 0 011 0c.6 0 1 .2 1.5.5l1.2 1c.6 2 .9 4 .8 6.3a93 93 0 01-.7 6.7l-.5 6.6c-.1 2.1.2 4.1 1 6h.1c.2 0 .4 0 .5-.2.1-.2.3-.3.5-.2l.3.1.8 2.4 1.3 2.2zM113 16.7h-.2-.2v.7c0 .4 0 .7-.3 1-.2.2-.4.4-.4.6l.2.3.3.1-.5.6c0 .2-.2.4-.4.6 0 1 .2 2.1.4 3.2.2 1 .3 2 .3 3.1l-.1 1.6a53 53 0 01-.7 3.1c-.2.5-.2 1-.2 1.6l-1.3 2.3c-.5.7-.8 1.5-1 2.4a7 7 0 00-1.9 1.6l-1.5 2c-1.1.3-2.1.8-3 1.4h-.8a6.5 6.5 0 01-5.2-2.3c-.7-.7-1.2-1.5-1.6-2.4l-1.2-2.8c-.8.5-1.4 1.1-2 1.8a111.1 111.1 0 01-3.6 3.7l-.4.2c-1 .5-1.6 1.2-2.1 2a17.3 17.3 0 00-3.5 1.8 61 61 0 00-3.4.2l-1.9-.1-.8-.5-.6-.6-1.2-.8-.4-1.2-.6-1.1V40v-.8l-.2-.7-.5-.4c0-1.1.2-2.3.4-3.4a41.3 41.3 0 001.2-6.5c0-.2.1-.3.3-.5.2 0 .3-.3.3-.5l.3-1.5a21.2 21.2 0 01.7-4.3l.7-2.8V18c0-1.2 0-2.4.2-3.5a23 23 0 00.1-5.3l.6-.8.8-.7a34.1 34.1 0 013.8 2.4v1.1a62.5 62.5 0 01-.9 9c-.2 1-.5 1.9-.9 2.7v1.5c-.5 1-1 2-1.1 3.1a61.4 61.4 0 01-1.3 6.2l.2.5c-.3.5-.4 1.1-.4 1.8l-.3 1.9.7 1.3.7 1.3H80a6.1 6.1 0 001.8 0c.1-.3.4-.6.7-.8l1-.5 1-.5.6-.8h.7l.3-.4a14 14 0 001-1v-.3a3 3 0 001-.6 13.3 13.3 0 001.5-1.8l1-.7-.1-.2c0-.3 0-.5.2-.7.2-.1.2-.4.2-.8h.4l.2-.4c0-.1 0-.3.2-.4l.3-.2c0-.6.1-1.2.4-1.7a3.7 3.7 0 00.3-2l-.2-.5c.3-.3.5-.6.6-1l.1-1.3v-1.3c.1-.4.2-.9.5-1.3 0-.3-.1-.5-.4-.6l.6-.8.7-.6c.4 0 .7.1 1 .3l.7.5.7.6.9.5v1c.3.1.5.4.7.7a133.7 133.7 0 000 8.7c0 1.2.2 2.5.5 3.7l1 1c.4.4.6.8.8 1.2h.6c1 0 2-.4 2.5-1 .6-.8 1-1.6 1.3-2.5.5-.2.8-.5 1-1 .3-.3.5-.8.6-1.2l.4-1.5c0-.4.3-.9.5-1.2v-2.3c0-1.8 0-3.7-.2-5.5a69.4 69.4 0 01-.6-6.2v-1l-.3-1c-.1-.3-.3-.5-.5-.6l.1-1.2-.1-1.2-.3-1.2.7-.7c.1-.2.4-.3.8-.3.2 0 .4 0 .5.2l.5.4.5.4a1 1 0 00.9.2h.2c.3.3.6.7.8 1.2l.6 1.4.5 1.6.8 1.3V16c.2.3.3.5.3.8zM58 35.7c-.1-.5-.2-.9-.4-1l-.3-1-.3-1.4c0-.5 0-1-.2-1.4a79.5 79.5 0 00-1.5-6.8v-.2c-.3-.3-.5-.7-.6-1.1a45.3 45.3 0 01-.8-2.6c-.2-.4-.4-.7-.8-1l-.2.7.1.6v.6c-.2.1-.5.4-.6.7-.1.3-.4.6-.7.8-.2 1-.6 2-1 2.8a63.4 63.4 0 01-3 5.3c-.5 1-.9 1.8-1.1 2.8a2 2 0 00-.9 1l-.2 1.4c.3.2.6.2 1 .3a23.7 23.7 0 002 0l.9.5 1.3-.2c.5 0 .9-.2 1.2-.4a6 6 0 003.1.2l1-.2c.4 0 .6.1.7.3l.7.2.3-.4c0-.2.1-.3.3-.4zm76.9 0c0-.5-.2-.9-.3-1l-.4-1-.2-1.4c0-.5-.2-1-.3-1.4a77.8 77.8 0 00-1.5-6.8v-.2c-.3-.3-.5-.7-.6-1.1a45.3 45.3 0 01-.8-2.6c-.2-.4-.4-.7-.8-1l-.1.7v.6l.1.6c-.3.1-.5.4-.7.7-.1.3-.3.6-.7.8-.2 1-.6 2-1 2.8a63.4 63.4 0 01-3 5.3 15 15 0 00-1.1 2.8 2 2 0 00-.8 1c-.2.5-.2 1-.2 1.4.2.2.6.2 1 .3a23.7 23.7 0 002 0l.8.5 1.3-.2c.5 0 1-.2 1.2-.4a6 6 0 003.1.2l1.1-.2c.3 0 .5.1.7.3.1.1.3.2.7.2l.2-.4c0-.2.1-.3.3-.4z"
          fill="#E2C049"
        />
      </svg>
      Bus Plus
      <svg
        class="h-4 ml-1 mb-3"
        viewBox="0 0 22 19"
        width="18"
        height="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>+</title>
        <path
          d="M7.5.2c-.5.1-1 .5-1 1l-.1.3-.3.8V3c.2.2.3.5.3.9l.1 1.3.1 1.4v.3H5.5L3.3 7l-2.2.2a1.3 1.3 0 00-1 1.9l1 1.4.5.7c.1.3.3.5.6.7l1 .2.8-.1H4c.4.2.8.2 1.2 0l.5-.1.6-.1h.4v.5a8.5 8.5 0 000 2v.6a3.9 3.9 0 000 1.6l.2.7c0 .3.3.6.5.8l1.4.6c.3.1.5.1.8 0a2 2 0 001-.6l.1-.3a1.3 1.3 0 001.4-.8c.3-.7.4-1.3.4-1.8V14c0-.4-.2-.8-.5-1v-.5-.9-.2h.2c.5 0 1-.1 1.4-.3a48.9 48.9 0 005.7 0c.5 0 .9-.2 1.1-.5l.3-.3c.4-.2.7-.6 1-1 .2-.4.2-.9 0-1.3-.3-.5-.7-.9-1.3-1.1l-.8-.4c-.3-.2-.7-.2-1 0h-1.8c-.5-.2-1-.2-1.5-.2h-.7l-.2.1h-.2l-.3.1a15 15 0 01-2 0v-.8-1.3a2.5 2.5 0 00-.2-1v-.1a7 7 0 01-.2-.6V2.1c0-.3-.1-.5-.3-.7-.1-.1-.3-.4-.7-.6A8.6 8.6 0 009.3.2L8.5 0a2 2 0 00-1 .2zm13.1 8.4c-.1.3-.3.5-.5.6l-.6.6a5 5 0 01-.7-.1l-.7-.1h-.5l-.5.4-1.9-.2h-1.8l-1.2.3-1.2.2a302.4 302.4 0 00-.2 2.2v.8c.1.3.3.5.5.6v1.3c0 .3 0 .7-.3 1.2l-.2-.1a.5.5 0 00-.6.1l-.3.4-.3.3c0 .2-.2.2-.3.3l-1-.5a22.8 22.8 0 01-.2-1.3l.1-.8a3.4 3.4 0 01-.2-1.4v-1A7.5 7.5 0 008 11v-.5H7a14.5 14.5 0 00-1.6.2l-.8.3c-.1-.2-.3-.2-.6-.2a2 2 0 00-.4 0 2 2 0 01-.4 0h-.6L2 9.6l-.7-1 2-.3h2.1L7 8.1h.5l.2-.2.3-.2V6.5L7.7 5a19.3 19.3 0 00-.4-2.6l.1-.5.2-.5.4-.1.4-.1.3.1a8.1 8.1 0 011.5.8V3a8.3 8.3 0 00.4 1.2v1.4a7 7 0 000 1.5v.6l.3.1.1.2 1.5-.2h1.9a3.1 3.1 0 00.6-.2h.3l1.2.1 1.3.1 1.2-.1.9.3.6.6zM4.1 12z"
          fill="#fff"
        />
      </svg>
    </h1>
  );
}
