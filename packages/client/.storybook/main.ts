import type { StorybookConfig } from '@storybook/preact-vite';

const config: StorybookConfig = {
  stories: ['../@(page|assets)/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
  staticDirs: ['../public'],
  framework: {
    name: '@storybook/preact-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;
