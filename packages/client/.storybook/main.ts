import type { StorybookConfig } from '@storybook/preact-vite';

const config: StorybookConfig = {
  stories: ['../@(page|assets)/**/*.stories.@(ts|tsx)'],
  staticDirs: ['../public'],
  framework: {
    name: '@storybook/preact-vite',
    options: {},
  },
};
export default config;
