import type { Meta, StoryObj } from '@storybook/preact';
import * as iconPaths from './paths';
import * as menuIcons from './MenuIcon';
import { Icon } from './Icon';

function IconGrid() {
  return (
    <div style="display:grid;grid-template-columns:repeat(auto-fill, 48px)">
      {Object.entries(iconPaths).map(([name, path]) => (
        <Icon class="invert" src={path} alt={name} key={name} />
      ))}
      {Object.entries(menuIcons).map(([name, MenuIconComponent]) => (
        <MenuIconComponent class="invert" key={name} />
      ))}
    </div>
  );
}

const meta = {
  component: IconGrid,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Grid: Story = {};
