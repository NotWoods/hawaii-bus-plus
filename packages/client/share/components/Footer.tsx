import { h } from 'preact';

export function Footer() {
  return (
    <div class="flex text-gray-700 dark:text-gray-300 mt-8">
      <span>
        Data provided by{' '}
        <a class="mr-8 hover:underline" href="https://hawaiibusplus.com">
          Hawaii Bus Plus
        </a>
      </span>

      <a class="ml-auto group hover:underline" href="https://tigeroakes.com">
        Created by
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="32"
          width="160"
          viewBox="0 0 80 16"
          class="inline-block ml-1"
        >
          <title>Tiger Oakes</title>
          <g class="transition-opacity duration-300 group-hover:opacity-0">
            <g fill="none" stroke="currentColor">
              <rect width="13" height="13" x="1.5" y="1.5" />
              <circle class="eye" cx="5" cy="6" r="1.5" />
              <circle class="eye" cx="11" cy="6" r="1.5" />
              <path d="M4.5,7.5v3.5l2.5,1.5m4.5,-4.9v3.4l-2.5,1.5" />
            </g>
            <path fill="currentColor" d="M8,10.6l1.5,-1.6h-3l1.5,1.6Z" />
          </g>
          <g class="transition-opacity duration-300 opacity-0 group-hover:opacity-100">
            <rect width="12" height="12" x="2" y="2" fill="#e67237" />
            <g class="logo-path" fill="none" stroke="#032030">
              <circle class="eye" cx="5" cy="6" r="1.5" />
              <circle class="eye" cx="11" cy="6" r="1.5" />
              <path d="M4.5,7.5v3.5l2.5,1.5m4.5,-4.9v3.4l-2.5,1.5" />
            </g>
            <path fill="#032030" d="M8,10.6l1.5,-1.6h-3l1.5,1.6Z" />
          </g>
          <clipPath id="i">
            <path d="M29 8v6h-3V8h3zm0-1h-3V5h3v2z" />
          </clipPath>
          <g class="text" fill="none" stroke="currentColor">
            <path d="M23.5 13V7l-.5-.5h-3l-.5-.5V5l.5-.5h7" />
            <path d="M28 13l-.5-.5V6" clip-path="url(#i)" />
            <path d="M32.5,12.5h-2.5l-.5,-.5v-4l.5,-.5h3l.5,.5v7l-.5,.5h-3l-.5,-.5" />
            <path d="M36.5,10h2l.5,-.5v-1.5l-.5,-.5h-2.5l-.5,.5v4l.5,.5h2.5l.5,-.5" />
            <path d="M40.5,7.5l.5,.5v4l.5,.5h.5l.5,-.5v-4l.5,-.5h1.5l.5,.5" />
            <path d="M55.5,12.5h-4.5l-.5,-.5v-7l.5,-.5h4l.5,.5v6" />
            <path d="M57.5,8l.5,-.5h3l.5,.5v4l-.5,.5h-3l-.5,-.5v-2l.5,-.5h2" />
            <path d="M63,13l.5,-.5v-8.5" />
            <path d="M66.5,6v2l-.5,.5h-.5l-.5,.5v1l.5,.5h2l.5,.5v2" />
            <path d="M71,10h2l.5,-.5v-1.5l-.5,-.5h-2.5l-.5,.5v4l.5,.5h2.5l.5,-.5" />
            <path d="M75.5,12l.5,.5h3l.5,-.5v-1.5l-.5,-.5h-3l-.5,-.5v-1.5l.5,-.5h3l.5,.5" />
          </g>
          <g class="text text-overlay" fill="none" stroke="#ebeeef">
            <path
              style="animation-delay:0.2s"
              d="M23.5 13V7l-.5-.5h-3l-.5-.5V5l.5-.5h7"
            />
            <path
              style="animation-delay:0.5s"
              d="M28 13l-.5-.5V6"
              clip-path="url(#i)"
            />
            <path
              style="animation-delay:0.8s"
              d="M32.5,12.5h-2.5l-.5,-.5v-4l.5,-.5h3l.5,.5v7l-.5,.5h-3l-.5,-.5"
            />
            <path
              style="animation-delay:1.1s"
              d="M36.5,10h2l.5,-.5v-1.5l-.5,-.5h-2.5l-.5,.5v4l.5,.5h2.5l.5,-.5"
            />
            <path
              style="animation-delay:1.4s"
              d="M40.5,7.5l.5,.5v4l.5,.5h.5l.5,-.5v-4l.5,-.5h1.5l.5,.5"
            />
            <path
              style="animation-delay:0.2s"
              d="M55.5,12.5h-4.5l-.5,-.5v-7l.5,-.5h4l.5,.5v6"
            />
            <path
              style="animation-delay:0.5s"
              d="M57.5,8l.5,-.5h3l.5,.5v4l-.5,.5h-3l-.5,-.5v-2l.5,-.5h2"
            />
            <path style="animation-delay:0.8s" d="M63,13l.5,-.5v-8.5" />
            <path
              style="animation-delay:1.1s"
              d="M66.5,6v2l-.5,.5h-.5l-.5,.5v1l.5,.5h2l.5,.5v2"
            />
            <path
              style="animation-delay:1.4s"
              d="M71,10h2l.5,-.5v-1.5l-.5,-.5h-2.5l-.5,.5v4l.5,.5h2.5l.5,-.5"
            />
            <path
              style="animation-delay:1.7s"
              d="M75.5,12l.5,.5h3l.5,-.5v-1.5l-.5,-.5h-3l-.5,-.5v-1.5l.5,-.5h3l.5,.5"
            />
          </g>
        </svg>
      </a>
    </div>
  );
}
