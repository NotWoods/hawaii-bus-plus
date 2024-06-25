import type { Meta, StoryObj } from '@storybook/preact';
import { fn } from '@storybook/test';

import { MyLocationButtonContent, type Props } from './MyLocationButton';

const meta = {
  component: MyLocationButtonContent,
  args: {
    handleClick: fn(),
  },
  argTypes: {
    mode: {
      control: 'inline-radio',
      options: ['searching', 'disabled', 'found'],
    },
  },
} satisfies Meta<Props>;

export default meta;
type Story = StoryObj<Props>;

export const Searching: Story = {
  args: {
    mode: 'searching',
  },
};

export const Disabled: Story = {
  args: {
    mode: 'disabled',
  },
};

export const Found: Story = {
  args: {
    mode: 'found',
  },
};
